import 'dotenv/config';
import app from './app.js';
import { cleanupExpiredUrls } from './jobs/cleanupExpiredUrls.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Start the cleanup job interval
    const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minute
    const BATCH_SIZE = 1000;
    
    setInterval(async()=>{
        try{
            await cleanupExpiredUrls(BATCH_SIZE);
        }catch(err){
            console.error('❌ Error during cleanup job:', err);
        }
    }, CLEANUP_INTERVAL_MS);
});
