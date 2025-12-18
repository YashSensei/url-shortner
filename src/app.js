import express from 'express';
import urlRoutes from './routes/url.routes.js';

const app = express();

// GLOBAL LOGGER (for debugging)
app.use((req, res, next) => {
    console.log('🌍 Incoming:', req.method, req.url);
    next();
});

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/api/v1', urlRoutes);

export default app;
