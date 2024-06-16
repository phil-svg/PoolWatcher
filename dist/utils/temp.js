import fs from 'fs';
const FILE_PATH = '../notified_addresses.json';
export function getNotifiedAddresses() {
    if (!fs.existsSync(FILE_PATH)) {
        return [];
    }
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
}
export function storeNotifiedAddress(address) {
    const addresses = getNotifiedAddresses();
    addresses.push(address);
    fs.writeFileSync(FILE_PATH, JSON.stringify(addresses));
}
//# sourceMappingURL=temp.js.map