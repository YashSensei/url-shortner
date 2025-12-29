import express from 'express';
import apiRoutes from './routes/index.js';
import { redirectUrl } from './controllers/url.controller.js';

const app = express();

// GLOBAL LOGGER
app.use((req, res, next) => {
    console.log('🌍 Incoming:', req.method, req.url);
    next();
});

app.use(express.json());

// health check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// API routes
app.use('/api/v1', apiRoutes);

// public redirect route
app.get('/:short_code', redirectUrl);

export default app;
