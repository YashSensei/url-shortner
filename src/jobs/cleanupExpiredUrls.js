import { query } from '../config/db.js';

export async function cleanupExpiredUrls(batchSize = 1000) {
    try {
        const result = await query(
            `
            DELETE FROM urls
            WHERE id IN (
                SELECT id
                FROM urls
                WHERE expires_at IS NOT NULL
                  AND expires_at <= NOW()
                LIMIT $1
            )
            RETURNING id;
            `,
            [batchSize]
        );

        const deletedCount = result.rowCount;

        if (deletedCount > 0) {
            console.log(`🧹 Cleanup ran — deleted ${deletedCount} expired URLs`);
        }

        return deletedCount;
    } catch (err) {
        console.error('❌ Cleanup job failed:', err);
        return 0;
    }
}
