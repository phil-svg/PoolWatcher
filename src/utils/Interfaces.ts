export interface CoinDetail {
  address: string;
  symbol: string;
  decimals: number;
}

export interface PoolData {
  address: string;
  name: string;
  coins: CoinDetail[];
  source_address: string;
  source_address_description: string;
  inception_block: number;
  creation_timestamp: number;
}
