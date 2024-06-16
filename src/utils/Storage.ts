import fs from 'fs';

const FILE_PATH = '../notified_addresses.json';

export function getNotifiedAddresses(): string[] {
  if (!fs.existsSync(FILE_PATH)) {
    return [];
  }

  const data = fs.readFileSync(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

export function storeNotifiedAddress(address: string): void {
  const addresses = getNotifiedAddresses();
  addresses.push(address);
  fs.writeFileSync(FILE_PATH, JSON.stringify(addresses));
}
