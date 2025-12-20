import { query } from '../config/db.js';
import {encodeBase62} from '../utils/base62.js';

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
        if (isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
            return res.status(400).json({ error: 'Invalid expires_at value' });
        }
    }

    console.log('✅ Validation passed');

    // DB INSERT
    try {
        console.log('🗄️ Inserting into DB');

        const result = await query(
            `INSERT INTO urls (original_url, expires_at)
             VALUES ($1, $2)
             RETURNING id`,
            [original_url, expires_at || null]
        );
        const id = result.rows[0].id;
        const short_code = encodeBase62(id);
        await query(
            `UPDATE urls SET short_code = $1 WHERE id = $2`,
            [short_code, id]
        );
        return res.status(201).json({
            short_code,
            short_url: `http://localhost:3000/${short_code}`
        });

    } catch (err) {
        console.error('Write path failed:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



export const redirectUrl = async(req,res)=>{
    const {short_code} = req.params;
    try{
        const result = await query(
            `SELECT original_url, expires_at FROM urls WHERE short_code = $1`, [short_code]);
        if(result.rows.length ===0){
            return res.status(404).json({error: 'Short URL not found'});
        }
        const {original_url, expires_at} = result.rows[0];
        if(expires_at && new Date(expires_at) <= new Date()){
            return res.status(410).json({error: 'Short URL has expired'});
        }
        
        return res.redirect(302, original_url);
    }catch(err){
        console.error('❌ DB query failed:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}