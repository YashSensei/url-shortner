import express from 'express';
import { shortenUrl, redirectUrl } from '../controllers/url.controller.js';
import { rateLimitShorten } from '../middlewares/rateLimit.js';

const router = express.Router();

router.post('/shorten', rateLimitShorten, shortenUrl);
export default router;
