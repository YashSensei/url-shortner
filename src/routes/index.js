import express from 'express';
import urlRoutes from './url.routes.js';

const router = express.Router();

// mount feature routes
router.use('/', urlRoutes);

export default router;
