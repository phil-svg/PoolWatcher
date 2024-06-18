import { getTokenName } from './Web3.js';
import { tryFixingPostLengthByRemovingExplore, tryFixingPostLengthByRemovingFeaturing, tryFixingPostLengthByRemovingMax, tryFixingPostLengthByRemovingPoolName, tryFixingPostLengthByRemovingXSearchLinks, } from './Shrinker.js';
export function countTwitterPostCharacters(text) {
    // Twitter counts all URLs as 23 characters regardless of their actual length
    const urlRegex = /https?:\/\/[^\s]+/gi;
    // Replace found URLs with a placeholder string that is exactly 23 characters long
    const processedText = text.replace(urlRegex, '01234567890123456789012');
    // The length of the processed text is now the length of the tweet
    return processedText.length;
}
export function generateSearchURL(query) {
    const baseUrl = 'https://x.com/search';
    const encodedQuery = encodeURIComponent(query);
    const url = `${baseUrl}?q=${encodedQuery}`;
    return url;
}
export function extractPoolName(fullName) {
    // Split the string by the colon character
    const parts = fullName.split(':');
    // Check if the split resulted in more than one part
    if (parts.length > 1) {
        // Return the part after the colon, trimming any leading or trailing whitespace
        return parts[1].trim();
    }
    // If there's no colon, return the original string
    return fullName;
}
export async function getCurvePoolLink(address) {
    const url = 'https://api.curve.fi/api/getPools/all/ethereum';
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.success) {
            throw new Error('Failed to fetch pool data');
        }
        const normalizedAddress = address.toLowerCase();
        const pool = data.data.poolData.find((pool) => pool.address.toLowerCase() === normalizedAddress);
        if (pool && pool.poolUrls && pool.poolUrls.swap && pool.poolUrls.swap.length > 0) {
            return pool.poolUrls.swap[0];
        }
        else {
            return `https://curve.fi/#/ethereum/pools?hideSmallPools=false&search=${address}`;
        }
    }
    catch (error) {
        console.error('Error fetching or processing data:', error);
        return `https://curve.fi/#/ethereum/pools?hideSmallPools=false&search=${address}`;
    }
}
export async function stage0(launch) {
    // Generate hashtags from the coin symbols and ensure they are unique
    const hashtags = Array.from(new Set(launch.coins.map((coin) => `#${coin.symbol.replace(/[\W_]+/g, '')}`))).join(' ');
    // Fetch token names and construct search URLs for each token
    const features = await Promise.all(launch.coins.map(async (coin) => {
        const tokenName = await getTokenName(coin.address);
        if (tokenName) {
            if (tokenName.length <= 24) {
                const searchURL = generateSearchURL(tokenName);
                return `- ${tokenName} (${searchURL})`;
            }
            else {
                return `- ${tokenName}`;
            }
        }
        return null;
    }));
    // Filter out any null entries if getTokenName failed to return a name
    const filteredFeatures = features.filter((feature) => feature !== null);
    // Ensure there is at least one feature to display
    if (filteredFeatures.length === 0) {
        return null;
    }
    // Construct the tweet text with organized sections
    let tweetText = `${extractPoolName(launch.name)} (${launch.source_address_description}) has launched on @CurveFinance!\n\n` +
        `Featuring:\n${filteredFeatures.join('\n')}\n\n` +
        `Explore the pool here: ${await getCurvePoolLink(launch.address)}\n\n` +
        `${hashtags}`;
    return tweetText;
}
export async function formatText(launch) {
    let tweetText = await stage0(launch);
    if (!tweetText)
        return null;
    if (countTwitterPostCharacters(tweetText) <= 280)
        return tweetText;
    tweetText = tryFixingPostLengthByRemovingXSearchLinks(tweetText);
    if (countTwitterPostCharacters(tweetText) <= 280)
        return tweetText;
    tweetText = tryFixingPostLengthByRemovingExplore(tweetText);
    if (countTwitterPostCharacters(tweetText) <= 280)
        return tweetText;
    tweetText = tryFixingPostLengthByRemovingPoolName(tweetText);
    if (countTwitterPostCharacters(tweetText) <= 280)
        return tweetText;
    tweetText = await tryFixingPostLengthByRemovingFeaturing(launch);
    if (!tweetText)
        return null;
    if (countTwitterPostCharacters(tweetText) <= 280)
        return tweetText;
    tweetText = await tryFixingPostLengthByRemovingMax(launch);
    if (!tweetText)
        return null;
    if (countTwitterPostCharacters(tweetText) <= 280)
        return tweetText;
    // length = 299 passed
    return null;
}
//# sourceMappingURL=Formatting.js.map