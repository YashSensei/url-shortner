import { query } from '../config/db.js';

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

        if (isNaN(expiryDate.getTime())) {
            return res.status(400).json({ error: 'Invalid expires_at date' });
        }

        if (expiryDate <= new Date()) {
            return res.status(400).json({ error: 'expires_at must be in the future' });
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

        console.log('📥 DB result:', result.rows);

        return res.status(201).json({
            message: 'URL inserted',
            id: result.rows[0].id
        });

    } catch (err) {
        console.error('❌ DB insert failed:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
