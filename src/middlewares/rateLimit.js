import redis from '../config/redis.js';

const WINDOW_SECONDS = 60; // 1 minute
const MAX_REQUESTS = 5; // max 5 requests per minute

// Middleware to rate limit shorten URL requests
export async function rateLimitShorten(req,res,next){
    try{
        const ip = req.ip;
        const key = `rate_limit:shorten:${ip}`;

        const count = await redis.incr(key);

        if(count === 1){
            await redis.expire(key, WINDOW_SECONDS);
        }

        if(count > MAX_REQUESTS){
            console.log(`⚠️  Rate limit exceeded for IP: ${ip}`);
            return res.status(429).json({error:'Too many requests. Please try again later.'});
        }

        next();
    }catch(err){
        console.error('❌ Rate limiting error:', err);
        console.log('⚠️  Proceeding without rate limiting due to error.');
        // On error, allow the request to proceed, to avoid blocking legitimate users
        next();
    }
}