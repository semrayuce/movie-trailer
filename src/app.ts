import 'tsconfig-paths/register';

import express from 'express';
import dotenv from 'dotenv';
import trailerRoutes from './routes/trailerRoute';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST ? process.env.HOST : 'localhost';

console.log(`HOST: ${HOST}`);
console.log(`PORT: ${PORT}`);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/trailer', trailerRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Movie Trailer API is running');
});

// Start server
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

export default app;