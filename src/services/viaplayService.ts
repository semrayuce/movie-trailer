import { RequestUtil } from '../utils/requestUtil';

/**
 * Fetches the IMDb ID from a given Viaplay movie URL.
 * @param {string} movieUrl - The URL of the movie from Viaplay.
 * @returns {Promise<string>} - The IMDb ID of the movie.
 */
export const fetchImdbId = async (movieUrl: string): Promise<string> => {
    try {
        const viaplayResponse = await RequestUtil(movieUrl,
            { method: 'get' });

        // Extract the IMDb information from the response data
        const imdb =
            viaplayResponse.data
                ._embedded['viaplay:blocks'][0]
                ._embedded['viaplay:product']
                .content.imdb;
        return imdb?.id;
    } catch (error) {
        throw error;
    }
};