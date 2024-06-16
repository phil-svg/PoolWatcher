import { countTwitterPostCharacters, extractPoolName, generateSearchURL } from './Formatting.js';
import { PoolData } from './Interfaces.js';
import { getTokenName } from './Web3.js';

export function tryFixingPostLengthByRemovingXSearchLinks(text: string): string {
  // Regex to find all occurrences of 'x.com/search?q=' URLs inside the parentheses
  const regex = /\(x\.com\/search\?q=[^\s]+\)/g;

  // Extract all matches into an array
  const links = text.match(regex);

  if (links && links.length > 0) {
    // Get the last link
    const lastLink = links[links.length - 1];

    // Replace only the last occurrence of the found link with an empty string
    text = text.replace(lastLink, '');
  } else {
    return text;
  }

  // Optionally check if this is within Twitter's character limit
  if (countTwitterPostCharacters(text) > 280) {
    text = tryFixingPostLengthByRemovingXSearchLinks(text);
  }

  return text;
}

export function tryFixingPostLengthByRemovingExplore(text: string): string {
  // Regex to find and replace the 'Explore the pool here:' prefix along with any leading spaces
  const regex = /Explore the pool here:\s*/;

  // Replace the found text with an empty string, effectively removing it
  text = text.replace(regex, '');

  return text;
}

export function tryFixingPostLengthByRemovingPoolName(text: string): string {
  // Regex to match the specific structure of the pool launch announcement up to the exclamation mark
  const regex = /^.*?has launched on @CurveFinance!/;

  // Replace the matched text with the new simplified announcement
  text = text.replace(regex, 'New Pool has launched on @CurveFinance!');

  return text;
}

export async function tryFixingPostLengthByRemovingFeaturing(launch: PoolData): Promise<string | null> {
  // Generate hashtags from the coin symbols and ensure they are unique
  const hashtags = Array.from(new Set(launch.coins.map((coin) => `#${coin.symbol.replace(/[\W_]+/g, '')}`))).join(' ');

  // Construct the tweet text with organized sections
  let tweetText =
    `${extractPoolName(launch.name)} (${launch.source_address_description}) has launched on @CurveFinance!\n\n` +
    `Explore the pool here: https://curve.fi/#/ethereum/pools?search=${launch.address}\n\n` +
    `${hashtags}`;

  return tweetText;
}

export async function tryFixingPostLengthByRemovingMax(launch: PoolData): Promise<string | null> {
  // Generate hashtags from the coin symbols and ensure they are unique
  const hashtags = Array.from(new Set(launch.coins.map((coin) => `#${coin.symbol.replace(/[\W_]+/g, '')}`))).join(' ');

  // Construct the tweet text with organized sections
  let tweetText =
    `New Pool has launched on @CurveFinance!\n\n` +
    `Explore the pool here: https://curve.fi/#/ethereum/pools?search=${launch.address}\n\n`;

  return tweetText;
}
