import { query } from '../config/db.js';
import { nanoid } from 'nanoid';
import redis  from '../config/redis.js';

async function addToDB(original_url, expires_at){
    const short_code = nanoid(8);
    const result = await query(
            `INSERT INTO urls (short_code, original_url, expires_at)
            VALUES ($1, $2, $3)`,
            [short_code, original_url, expires_at || null]
    );
    return short_code;
}


export const shortenUrl = async (req, res) => {
    console.log('➡️ Controller hit');

    const { original_url, expires_at } = req.body;
    console.log('📦 Body:', req.body);

    // VALIDATION
    if (!original_url || typeof original_url !== 'string') {
        return res.status(400).json({ error: 'original_url is required' });
    }

    if (
        !original_url.startsWith('http://') &&
        !original_url.startsWith('https://')
    ) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    if (expires_at) {
        const expiryDate = new Date(expires_at);
        if (isNaN(expiryDate.getTime()) || expiryDate <= Date.now()) {
            return res.status(400).json({ error: 'Invalid expires_at value' });
        }
    }

    console.log('✅ Validation passed');

    // DB INSERT
    try {
        for (let attempt = 1; attempt <= 3; attempt++) {
            try{
                const short_code = await addToDB(original_url, expires_at);
                return res.status(201).json({
                    short_url: `${req.protocol}://${req.get('host')}/${short_code}`,
                    short_code: short_code,
                });
            }catch(err){
                if(err.code === '23505'){
                    console.warn(`⚠️  Collision detected on attempt ${attempt}, retrying...`);
                    continue;
                }
                else{
                    throw err;
                }
            }
        }
    } catch (err) {
        console.error('Write path failed:', err);
        return res.status(500).json({ error: 'Faield to generate unique short URL' });
    }
};



export const redirectUrl = async(req,res)=>{
    const {short_code} = req.params;
    const redisKey = `shorturl:${short_code}`;
    const cached = await redis.get(redisKey);
    
    if(cached){
        const {original_url} = JSON.parse(cached);
        console.log('🟢 Redis HIT');
        return res.redirect(302, original_url);
    }else{console.log('🟡 Redis MISS');}

    try{
        const result = await query(
            `SELECT original_url, expires_at FROM urls WHERE short_code = $1`, [short_code]);
        if(result.rows.length ===0){
            return res.status(404).json({error: 'Short URL not found'});
        }
        const {original_url, expires_at} = result.rows[0];
        if(expires_at && new Date(expires_at) <= Date.now()){
            return res.status(410).json({error: 'Short URL has expired'});
        }
        
        const ttl = expires_at ? Math.floor((new Date(expires_at) - Date.now()) / 1000) : 86400;
        if(ttl >0){
            await redis.set(redisKey, JSON.stringify({original_url,expires_at}), 'EX', ttl);
        }
        return res.redirect(302, original_url);
    }catch(err){
        console.error('❌ DB query failed:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}