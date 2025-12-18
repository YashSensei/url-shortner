import 'dotenv/config';
import pool from './config/db.js';

(async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('✅ DB connected:', res.rows[0]);
        process.exit(0);
    } catch (err) {
        console.error('❌ DB connection failed:', err);
        process.exit(1);
    }
})();
