import { fetchTrailer } from '../src/services/tmdbService';
import { fetchImdbId } from '../src/services/viaplayService';
import redisClient from '../src/utils/redisClient';
import { RequestUtil } from '../src/utils/requestUtil';
import { AxiosRequestConfig, AxiosResponse } from 'axios';


jest.mock('../src/services/viaplayService');
jest.mock('../src/utils/redisClient');
jest.mock('../src/utils/requestUtil');

const mockedFetchImdbId = fetchImdbId as jest.MockedFunction<typeof fetchImdbId>;
const mockedRedisClientGet = redisClient.get as jest.MockedFunction<typeof redisClient.get>;
const mockedRedisClientSet = redisClient.set as jest.MockedFunction<typeof redisClient.set>;
const mockedRequestUtil = RequestUtil as jest.MockedFunction<typeof RequestUtil>;

describe('fetchTrailer', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return trailer URL from cache if available', async () => {
        const movieUrl = 'https://content.viaplay.se/pc-se/film/arrival-2016';
        const cachedTrailerUrl = 'https://www.youtube.com/watch?v=AMgyWT075KY';

        mockedRedisClientGet.mockResolvedValue(cachedTrailerUrl);

        const result = await fetchTrailer(movieUrl);

        expect(result).toBe(cachedTrailerUrl);
    });

    it('should fetch trailer URL from TMDb if not in cache and cache the result', async () => {
        const movieUrl = 'https://content.viaplay.se/pc-se/film/arrival-2016';
        const imdbId = 'tt2543164';
        const trailerUrl = 'https://www.youtube.com/watch?v=AMgyWT075KY';

        mockedRedisClientGet.mockResolvedValue(null);
        mockedFetchImdbId.mockResolvedValue(imdbId);
        mockedRequestUtil.mockImplementation((url: string, config: AxiosRequestConfig): Promise<AxiosResponse> => {
            if (url.includes('/find/')) {
                return Promise.resolve({
                    data: {
                        movie_results: [{ id: 1 }]
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                } as AxiosResponse);
            } else if (url.includes('/movie/1/videos')) {
                return Promise.resolve({
                    data: {
                        results: [{ key: 'AMgyWT075KY', type: 'Trailer' }]
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                } as AxiosResponse);
            }
            return Promise.reject(new Error('Unknown URL'));
        });

        const result = await fetchTrailer(movieUrl);

        expect(result).toBe(trailerUrl);
    });

    it('should throw an error if no trailer is found', async () => {
        const movieUrl = 'https://content.viaplay.se/pc-se/film/arrival-2016';
        const imdbId = 'tt2543164';

        mockedRedisClientGet.mockResolvedValue(null);
        mockedFetchImdbId.mockResolvedValue(imdbId);
        mockedRequestUtil.mockImplementation((url: string, config: AxiosRequestConfig): Promise<AxiosResponse> => {
            if (url.includes('/find/')) {
                return Promise.resolve({
                    data: {
                        movie_results: [{ id: 1 }]
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                } as AxiosResponse);
            } else if (url.includes('/movie/1/videos')) {
                return Promise.resolve({
                    data: {
                        results: []
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                } as AxiosResponse);
            }
            return Promise.reject(new Error('Unknown URL'));
        });

        await expect(fetchTrailer(movieUrl)).rejects.toThrow('Trailer not found');
    });
});
