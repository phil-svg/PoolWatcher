import { PoolData } from './utils/Interfaces.js';
import { getPoolLaunchesLast7Days } from './utils/InfoGetter.js';
import { postOnX } from './utils/X.js';
import { formatText } from './utils/Formatting.js';
import { getNotifiedAddresses, storeNotifiedAddress } from './utils/storage.js';

// export const baseUrl = 'http://localhost:443';
export const baseUrl = 'https://api.curvemonitor.com';

async function runCycle() {
  const poolData = await getPoolLaunchesLast7Days();
  if (!poolData) return;

  const notifiedAddresses = getNotifiedAddresses();

  for (const launch of poolData) {
    // if was posted => skip
    if (notifiedAddresses.map((addr) => addr.toLowerCase()).includes(launch.address.toLowerCase())) continue;

    // new post to be done:
    console.log('launch: ', launch);
    const res = await processSingeLaunch(launch);
    console.log('res (for storing): ', res);
    if (res === 'Tweet successful' || res === 'You are not allowed to create a Tweet with duplicate content.') {
      storeNotifiedAddress(launch.address);
    }
  }
  console.log('cycle complete, waiting for next interval...');
}

async function processSingeLaunch(launch: PoolData): Promise<string | null> {
  const tweetText = await formatText(launch);
  console.log('tweetText: ', tweetText);
  if (!tweetText) return null;
  const res = await postOnX(tweetText);
  return res;
}

await runCycle();
setInterval(async () => {
  await runCycle();
}, 3600000); // 3600000 milliseconds = 1 hour
