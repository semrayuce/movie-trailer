import { RequestUtil } from '../utils/requestUtil';
import { TmdbMovieResponse, TmdbVideoResponse } from '../types/tmdbTypes';
import { fetchImdbId } from './viaplayService';
import redisClient from '../utils/redisClient';

const TMDB_API_KEY = "fd9b0b68f574fa836b7b9b5c0e806a28";//process.env.TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3';//process.env.TMDB_API_URL;
const CACHE_EXPIRATION_TIME = 604800; // 1 week in seconds


/**
 * Fetches the trailer URL for a given movie URL.
 * @param {string} movieUrl - The URL of the movie from an external service.
 * @returns {Promise<string>} - The URL of the trailer on YouTube.
 */
export const fetchTrailer = async (movieUrl: string): Promise<string> => {
    try {
        // Check if the trailer URL is already cached
        const cachedTrailerUrl = await redisClient.get(movieUrl);
        if (cachedTrailerUrl) {
            console.log('Cache hit');
            return cachedTrailerUrl;
        }

        //1.Get IMDb info from Viaplay Content API
        const imdbId = await fetchImdbId(movieUrl);

        //2.Find movie data by imdbId from TMDb API
        const { data } = await RequestUtil<TmdbMovieResponse>(
            `${TMDB_API_URL}/find/${imdbId}`,
            {
                method: 'get',
                params: {
                    api_key: TMDB_API_KEY,
                    external_source: 'imdb_id'
                }
            }
        );

        //3.Get movie's video details
        if (data.movie_results.length > 0) {
            const movieId = data.movie_results[0].id;
            const videosResponse = await RequestUtil<TmdbVideoResponse>(
                `${TMDB_API_URL}/movie/${movieId}/videos`,
                {
                    method: 'get',
                    params: {
                        api_key: TMDB_API_KEY
                    }
                }
            );

            //4.Get the trailer
            const trailer = videosResponse.data.results.find((video) => video.type === 'Trailer');
            if (trailer) {
                const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;

                // Cache the trailer URL with an expiration time (e.g., 1 hour)
                await redisClient.set(movieUrl, trailerUrl, 'EX', CACHE_EXPIRATION_TIME);

                return trailerUrl;
            }
        }

        throw new Error('Trailer not found');
    } catch (error) {
        throw error;
    }
};