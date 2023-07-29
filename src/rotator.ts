import { JsonRpcProvider } from "ethers";
import { EventEmitter } from "events";

export interface ChainProviderMap {
	[chainId: number]: string[];
}

export class RotatingProvider extends EventEmitter {
	private readonly chainProviderMap: ChainProviderMap;
	private readonly chainId: number;
	private readonly interval: number;
	private provider: JsonRpcProvider;

	constructor(
		chainProviderMap: ChainProviderMap,
		interval: number,
		chainId: number,
	) {
		const defaultProvider: string = chainProviderMap[chainId][0];
		super();
		this.provider = new JsonRpcProvider(defaultProvider);
		this.chainProviderMap = chainProviderMap;
		this.chainId = chainId;
		this.interval = interval;
		this.setupRotation();
	}

	private setupRotation() {
		setInterval(() => {
			const providers: string[] = this.chainProviderMap[this.chainId];
			console.log("Switching to providers:", providers);
			const nextProvider: string = providers[0]; // Use the first provider in the list
			this.provider = new JsonRpcProvider(nextProvider);
			this.emit("providerChanged", nextProvider);
		}, this.interval);
	}

	get currentProvider(): JsonRpcProvider {
		return this.provider;
	}
}

// Example Usage:
const chainProviderMap: ChainProviderMap = {
	1: [
		"https://eth.llamarpc.com",
		"https://rpc.ankr.com/eth", // Add more RPC URLs for Mainnet
	],
	5: [
		"https://rpc.notadegen.com/goerli",
		"https://rpc.ankr.com/eth_goerli", // Add more RPC URLs for Ropsten
	],
	// ... Add more chain IDs and RPC URLs here
};
// Create the rotating provider
const rotatingProvider = new RotatingProvider(chainProviderMap, 3000, 1);

// You can now use 'rotatingProvider.currentProvider' to access the current provider instance.
// For example:
rotatingProvider.currentProvider.getBlockNumber().then((blockNumber) => {
	console.log("Current block number:", blockNumber);
});

rotatingProvider.on("providerChanged", (newUrl: string) => {
	console.log(`Provider changed to: ${newUrl}`);
});
