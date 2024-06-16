import fetch from 'node-fetch';
import { baseUrl } from '../App.js';
import { PoolData } from './Interfaces.js';

export async function getPoolLaunchesLast7Days(): Promise<PoolData[] | null> {
  const url = `${baseUrl}/getPoolLaunchesLast7Days`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as PoolData[];
  } catch (error) {
    console.error(`Error fetching data:`, error);
    return null;
  }
}
