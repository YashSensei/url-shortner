import express from 'express';
import { shortenUrl, redirectUrl } from '../controllers/url.controller.js';

const router = express.Router();

router.post('/shorten', shortenUrl);

export default router;
