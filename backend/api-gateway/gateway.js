const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const cors = require('cors');

const app = express();

const corsOptions = {
<<<<<<< HEAD
    origin: '*',
=======
    origin: '*', // Allow all origins (for development)
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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

<<<<<<< HEAD
// reservation routes
=======
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
// Protected routes for reservations
app.post('/movie/:movieUid/reservations', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
<<<<<<< HEAD
    pathRewrite: (path, req) => {
        return path.replace('/movie/', '/reservation/movie/');
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to reservation service:', req.method, req.originalUrl);
        
        // Log the full address the request is forwarded to
        const forwardPath = proxyReq.path;
        const forwardAddress = `${proxyReq.protocol}//${proxyReq.host}${forwardPath}`;
        console.log('Forwarding to address:', forwardAddress);
        
=======
    pathRewrite: {
        '^/movie': '',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to reservation service:', req.method, req.originalUrl);
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
<<<<<<< HEAD
        console.error('Proxy error:', err);
        handleErrors({ status: 500 }, req, res);
    }
}));

app.post('/reservations/:uid/confirm', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/reservations': '/reservation', // This will remove /reservations from the path
=======
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
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to reservation service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
<<<<<<< HEAD
        console.error('Proxy error:', err);
        handleErrors({ status: 500 }, req, res);
=======
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
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
    }
}));

app.get('/movie/:movieUid/reservations', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
<<<<<<< HEAD
        '^/movie': '/reservation/movie/', // This will remove /movie from the path
=======
        '^/movie': '',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to reservation service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
<<<<<<< HEAD
    onProxyRes: (proxyRes, req, res) => {
        console.log('Received response from reservation service:', proxyRes.statusCode, req.originalUrl);
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        handleErrors({ status: 500 }, req, res);
    }
}));

app.get('/reservations/:uid', authenticateToken, authorizeRoles(['admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/reservations': '/reservation', 
=======
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
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
    },
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to reservation service:', req.method, req.originalUrl);
        if (req.headers.authorization) {
            proxyReq.setHeader('authorization', req.headers.authorization);
        }
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
<<<<<<< HEAD
        console.error('Proxy error:', err);
        handleErrors({ status: 500 }, req, res);
    }
}));


app.get('/reservations/username/:username', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: (path, req) => path.replace('/reservations/username/', '/reservation/username/'),
    onProxyReq: (proxyReq, req) => {
        console.log('Forwarding authorized user request to reservation service:', req.method, req.originalUrl);
        const forwardPath = proxyReq.path;
        const forwardAddress = `${proxyReq.protocol}//${proxyReq.host}${forwardPath}`;
        console.log('Forwarding to address:', forwardAddress);
        if (req.headers.authorization) proxyReq.setHeader('authorization', req.headers.authorization);
        streamifyBody(req, proxyReq);
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        handleErrors({ status: 500 }, req, res);
=======
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
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
    }
}));

// Cinema routes
<<<<<<< HEAD
app.get('/cinema', authenticateToken, authorizeRoles(['client','admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema': '/cinema',
=======
app.get('/cinema', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema': '',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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

<<<<<<< HEAD
app.get('/cinema/:uid', authenticateToken, authorizeRoles(['client','admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema': '/cinema',
=======
app.get('/cinema/:uid', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema': '',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
        '^/cinema': '/cinema',
=======
        '^/cinema': '',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
        '^/cinema': '/cinema',
=======
        '^/cinema': '',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
        '^/cinema': '/cinema',
=======
        '^/cinema': '',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
app.get('/cinema/:cinemaUid/rooms', authenticateToken, authorizeRoles(['client' , 'admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: (path, req) => {
        const { cinemaUid } = req.params;
        return path.replace(`/cinema/${cinemaUid}/rooms`, `/rooms/cinema/${cinemaUid}/rooms`);
=======
app.get('/cinema/:cinemaUid/rooms', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms': '/cinema/:cinemaUid/rooms',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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

<<<<<<< HEAD
app.get('/cinema/:cinemaUid/rooms/:uid', authenticateToken, authorizeRoles(['client' , 'admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: (path, req) => {
        const { cinemaUid, uid } = req.params;
        return path.replace(`/cinema/${cinemaUid}/rooms/${uid}`, `/rooms/rooms/${uid}`);
=======
app.get('/cinema/:cinemaUid/rooms/:uid', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:uid': '/cinema/:cinemaUid/rooms/:uid',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
    pathRewrite: (path, req) => {
        const { cinemaUid } = req.params;
        return path.replace(`/cinema/${cinemaUid}/rooms`, `/rooms`);
=======
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms': '/cinema/:cinemaUid/rooms',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
    pathRewrite: (path, req) => {
        const { cinemaUid, uid } = req.params;
        return path.replace(`/cinema/${cinemaUid}/rooms/${uid}`, `/rooms/rooms/${uid}`);
=======
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:uid': '/cinema/:cinemaUid/rooms/:uid',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
    pathRewrite: (path, req) => {
        const { cinemaUid, uid } = req.params;
        return path.replace(`/cinema/${cinemaUid}/rooms/${uid}`, `/rooms/rooms/${uid}`);
=======
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:uid': '/cinema/:cinemaUid/rooms/:uid',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
app.get('/cinema/:cinemaUid/rooms/:roomUid/sceances', authenticateToken, authorizeRoles(['client', 'admin']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: (path, req) => {
        const { cinemaUid, roomUid } = req.params;
        return path.replace(`/cinema/${cinemaUid}/rooms/${roomUid}/sceances`, `/sceances`);
=======
app.get('/cinema/:cinemaUid/rooms/:roomUid/sceances', authenticateToken, authorizeRoles(['client']), createProxyMiddleware({
    target: 'http://movie-reservation:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:roomUid/sceances': '/cinema/:cinemaUid/rooms/:roomUid/sceances',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
    pathRewrite: (path, req) => {
        const { cinemaUid, roomUid } = req.params;
        return path.replace(`/cinema/${cinemaUid}/rooms/${roomUid}/sceances`, `/sceances`);
=======
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:roomUid/sceances': '/cinema/:cinemaUid/rooms/:roomUid/sceances',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
    pathRewrite: (path, req) => {
        const { cinemaUid, roomUid, uid } = req.params;
        return path.replace(`/cinema/${cinemaUid}/rooms/${roomUid}/sceances/${uid}`, `/sceances/${uid}`);
=======
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:roomUid/sceances/:uid': '/cinema/:cinemaUid/rooms/:roomUid/sceances/:uid',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
    pathRewrite: (path, req) => {
        const { cinemaUid, roomUid, uid } = req.params;
        return path.replace(`/cinema/${cinemaUid}/rooms/${roomUid}/sceances/${uid}`, `/sceances/${uid}`);
=======
    pathRewrite: {
        '^/cinema/:cinemaUid/rooms/:roomUid/sceances/:uid': '/cinema/:cinemaUid/rooms/:roomUid/sceances/:uid',
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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