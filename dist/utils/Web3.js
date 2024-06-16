import Web3 from 'web3';
export async function getTokenName(tokenAddress) {
    try {
        const WEB3_HTTP_PROVIDER = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_HTTP));
        const ABI_TOKEN_NAME = [
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
        ];
        const CONTRACT = new WEB3_HTTP_PROVIDER.eth.Contract(ABI_TOKEN_NAME, tokenAddress);
        const name = (await CONTRACT.methods.name().call());
        return name;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
//# sourceMappingURL=Web3.js.map