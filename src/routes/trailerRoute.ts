import express from 'express';
import { getTrailer } from '../controllers/trailerController';

const router = express.Router();

router.get('/', getTrailer);

export default router;