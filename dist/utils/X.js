import { TwitterApi } from 'twitter-api-v2';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.clear();
config({ path: resolve(__dirname, '..', '..', '.env') });
const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_KEY_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
});
export async function postOnX(tweetText) {
    try {
        const response = await client.readWrite.v2.tweet(tweetText);
        console.log('Tweet successful:', response);
        return 'Tweet successful';
    }
    catch (error) {
        console.error('Failed to send tweet:', error);
        console.error(error.data.detail);
        if (error.data.detail.includes('You are not allowed to create a Tweet with duplicate content.')) {
            return 'You are not allowed to create a Tweet with duplicate content.';
        }
        return null;
    }
}
//# sourceMappingURL=X.js.map