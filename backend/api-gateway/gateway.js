const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: '*', // Allow all origins (for development)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

const authenticateToken = async (req, res, next) => {
    try {
        console.log('Authenticating token...');

        let token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

        if (!token) {
            token = req.headers['token'];
        }

        if (!token) {
            console.log('No token found in request headers');
            return res.sendStatus(401); // Unauthorized
        }

        console.log('Sending request to http://auth-service:3001/verify with token:', token);

        const response = await axios.post(
            'http://auth-service:3001/verify', 
            {}, 
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        console.log('Response from auth service:', response.data);
        
        req.user = response.data;
        console.log('Role retrieved in authenticateToken:', req.user.role);
        
        next();
    } catch (error) {
        console.error('Token verification failed:', error.response ? error.response.data : error.message);
        res.sendStatus(403);
    }
};

const authorizeRoles = (roles) => (req, res, next) => {
    console.log('Authorizing user...');
    if (!req.user || !req.user.role) {
        console.log('No user or role found in request:', req.user);
        return res.status(403).send({ message: 'Forbidden' });
    }

    if (!roles.includes(req.user.role)) {
        console.log('User not authorized:', req.user.role);
        return res.status(403).send({ message: 'Forbidden' });
    }

    console.log('User authorized:', req.user.role);
    next();
};

const streamifyBody = (req, proxyReq) => {
    if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

const handleErrors = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const errorMapping = {
        422: 'Invalid content in the request body',
        404: 'Resource not found',
        410: 'Reservation expired',
        400: 'Invalid search parameters',
        500: 'Internal server error',
    };

    const status = err.status || 500;
    const message = errorMapping[status] || 'Unknown error';

    res.status(status).send({ error: message });
};

// Auth routes
app.use('/auth', createProxyMiddleware({
    target: 'http://auth-service:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/auth': '',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding request to auth service:', req.method, req.originalUrl);
        streamifyBody(req, proxyReq);
    }
}));

// Public GET routes for movie management
app.use('/movies', (req, res, next) => {
    if (req.method === 'GET') {
        return createProxyMiddleware({
            target: 'http://movie-service:3002',
            changeOrigin: true,
            pathRewrite: {
                '^/movies': '',
            },
            onProxyReq: (proxyReq, req) => {
                console.log('Forwarding public GET request to movie service:', req.method, req.originalUrl);
                if (req.headers.authorization) {
                    proxyReq.setHeader('authorization', req.headers.authorization);
                }
                streamifyBody(req, proxyReq);
            }
        })(req, res, next);
    }
    next();
});

// Protected routes for non-GET movie management
app.use('/movies', authenticateToken, authorizeRoles(['admin']), (req, res, next) => {
    if (req.method !== 'GET') {
        return createProxyMiddleware({
            target: 'http://movie-service:3002',
            changeOrigin: true,
            pathRewrite: {
                '^/movies': '',
            },
            onProxyReq: (proxyReq, req) => {
                console.log('Forwarding authorized user request to movie service:', req.method, req.originalUrl);
                if (req.headers.authorization) {
                    proxyReq.setHeader('authorization', req.headers.authorization);
                }
                streamifyBody(req, proxyReq);
            },
            onError: (err, req, res) => {
                handleErrors({ status: 500 }, req, res);
            }
        })(req, res, next);
    }
    next();
});

// Protected routes for reservations
app.post('/movie/:movieUid/reservations', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/movie': '',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to reservation service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 422) {
                handleErrors({ status: 422 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.post('/reservations/:uid/confirm', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/reservations': '',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to reservation service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 422) {
                handleErrors({ status: 422 }, req, res);
            } else if (status === 410) {
                handleErrors({ status: 410 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.get('/movie/:movieUid/reservations', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/movie': '',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to reservation service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.get('/reservations/:uid', authenticateToken, authorizeRoles(['admin', 'owner']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/reservations': '',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to reservation service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

// Cinema routes
app.get('/cinema', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema': '',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to cinema service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 204) {
                res.status(204).send(); // No content
            } else if (status === 400) {
                handleErrors({ status: 400 }, req, res);
            } else if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.get('/cinema/:uid', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema': '',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to cinema service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.post('/cinema', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema': '',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to cinema service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 422) {
                handleErrors({ status: 422 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.put('/cinema/:uid', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema': '',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to cinema service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else if (status === 422) {
                handleErrors({ status: 422 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.delete('/cinema/:uid', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema': '',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to cinema service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

// Room routes
app.get('/cinema/:cinemaUid/rooms', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms': '/cinema/:cinemaUid/rooms',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to room service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.get('/cinema/:cinemaUid/rooms/:uid', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:uid': '/cinema/:cinemaUid/rooms/:uid',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to room service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.post('/cinema/:cinemaUid/rooms', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms': '/cinema/:cinemaUid/rooms',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to room service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 422) {
                handleErrors({ status: 422 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.put('/cinema/:cinemaUid/rooms/:uid', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:uid': '/cinema/:cinemaUid/rooms/:uid',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to room service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else if (status === 422) {
                handleErrors({ status: 422 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.delete('/cinema/:cinemaUid/rooms/:uid', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:uid': '/cinema/:cinemaUid/rooms/:uid',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to room service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

// Seance routes
app.get('/cinema/:cinemaUid/rooms/:roomUid/sceances', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:roomUid/sceances': '/cinema/:cinemaUid/rooms/:roomUid/sceances',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to seance service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.post('/cinema/:cinemaUid/rooms/:roomUid/sceances', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:roomUid/sceances': '/cinema/:cinemaUid/rooms/:roomUid/sceances',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to seance service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 422) {
                handleErrors({ status: 422 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.put('/cinema/:cinemaUid/rooms/:roomUid/sceances/:uid', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:roomUid/sceances/:uid': '/cinema/:cinemaUid/rooms/:roomUid/sceances/:uid',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to seance service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else if (status === 422) {
                handleErrors({ status: 422 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

app.delete('/cinema/:cinemaUid/rooms/:roomUid/sceances/:uid', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:roomUid/sceances/:uid': '/cinema/:cinemaUid/rooms/:roomUid/sceances/:uid',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to seance service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        if (err.response) {
            const status = err.response.status;
            if (status === 404) {
                handleErrors({ status: 404 }, req, res);
            } else {
                handleErrors({ status: 500 }, req, res);
            }
        } else {
            handleErrors({ status: 500 }, req, res);
        }
    }
}));

// Error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const errorMapping = {
        422: 'Invalid content in the request body',
        404: 'Resource not found',
        410: 'Reservation expired',
        400: 'Invalid search parameters',
        500: 'Internal server error',
    };

    const status = err.status || 500;
    const message = errorMapping[status] || 'Unknown error';

    res.status(status).send({ error: message });
});

app.listen(3000, () => {
    console.log('API Gateway running on port 3000');
});