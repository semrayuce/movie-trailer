import { fetchTrailer } from '../services/tmdbService';
import { Request, Response } from 'express';

// Controller function to handle requests for getting trailer URL
export const getTrailer = async (req: Request, res: Response): Promise<void> => {
  const movieUrl = req.query.movieUrl as string;

  if (!movieUrl) {
    res.status(400).json({ error: 'Movie url is required' });
    return;
  }

  try {
    // Call the fetchTrailer function to get the trailer URL using the provided movieUrl
    const trailerUrl = await fetchTrailer(movieUrl);
    res.json({ trailerUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};