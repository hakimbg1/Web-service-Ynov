import request from 'supertest';
import { connectDB, closeDB } from '../src/mongoose.js';
import app from '../src/app.js';
import { Movie } from '../src/models/movieModel.js';

describe('Movie Service', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await Movie.deleteMany({});
  });

  describe('GET /movies', () => {
    it('should get all movies', async () => {
      const res = await request(app).get('/movies');
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  describe('POST /movies', () => {
    it('should create a new movie', async () => {
      const movie = {
        uid: '12345',
        name: 'Test Movie',
        description: 'A movie for testing purposes',
        rate: 5,
        duration: 120,
      };
      const res = await request(app).post('/movies').send(movie);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('uid', '12345');
    });
  });

  describe('GET /movies/:uid', () => {
    it('should get a movie by uid', async () => {
      const movie = new Movie({
        uid: '12345',
        name: 'Test Movie',
        description: 'A movie for testing purposes',
        rate: 5,
        duration: 120,
      });
      await movie.save();
      const res = await request(app).get(`/movies/${movie.uid}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('uid', '12345');
    });
  });

  describe('PUT /movies/:uid', () => {
    it('should update a movie by uid', async () => {
      const movie = new Movie({
        uid: '12345',
        name: 'Test Movie',
        description: 'A movie for testing purposes',
        rate: 5,
        duration: 120,
      });
      await movie.save();
      const res = await request(app).put(`/movies/${movie.uid}`).send({ name: 'Updated Movie' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Movie');
    });
  });

  describe('DELETE /movies/:uid', () => {
    it('should delete a movie by uid', async () => {
      const movie = new Movie({
        uid: '12345',
        name: 'Test Movie',
        description: 'A movie for testing purposes',
        rate: 5,
        duration: 120,
      });
      await movie.save();
      const res = await request(app).delete(`/movies/${movie.uid}`);
      expect(res.status).toBe(204);
    });
  });
});
