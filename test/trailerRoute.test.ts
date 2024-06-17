import request from 'supertest';
import app from '../src/app';
import { fetchTrailer } from '../src/services/tmdbService';

jest.mock('../src/services/tmdbService');

const mockedFetchTrailer = fetchTrailer as jest.MockedFunction<typeof fetchTrailer>;

describe('GET /api/trailer', () => {
    it('should return 400 if movieUrl is not provided', async () => {
        const response = await request(app).get('/api/trailer');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Movie url is required' });
    });

    it('should return trailer URL if movieUrl is provided', async () => {
        const movieUrl = 'https://content.viaplay.se/pc-se/film/arrival-2016';
        const trailerUrl = 'https://www.youtube.com/watch?v=AMgyWT075KY';

        mockedFetchTrailer.mockResolvedValue(trailerUrl);

        const response = await request(app).get('/api/trailer').query({ movieUrl });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ trailerUrl });
    });

    it('should return 500 if an error occurs', async () => {
        const movieUrl = 'https://content.viaplay.se/pc-se/film/arrival-2016';

        mockedFetchTrailer.mockRejectedValue(new Error('Internal Server Error'));

        const response = await request(app).get('/api/trailer').query({ movieUrl });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal Server Error' });
    });
});