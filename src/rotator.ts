import { JsonRpcProvider } from "ethers";
import { EventEmitter } from "events";

import rpcList from "./constants/rpc.json" assert { type: "json" };
type ChainProviderMap = Record<string, string[]>;
const chainList: ChainProviderMap = rpcList;

export class RotatingProvider extends EventEmitter {
	private readonly chainId: number;
	private readonly interval: number;
	private intervalId: NodeJS.Timeout | null = null;
	public provider: JsonRpcProvider;

	constructor(chainId: number, interval: number) {
		const defaultProvider: string = chainList[chainId][0];
		super();
		this.provider = new JsonRpcProvider(defaultProvider);
		this.chainId = chainId;
		this.interval = interval;
		process.on("beforeExit", () => {
			this.stopRotation();
		});
		this.setupRotation();
	}

	private getRandomNumber(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	private async rotateProviders() {
		const providers: string[] = chainList[this.chainId];
		let randomIndex: number;
		let nextProvider: string = providers[0]; // Initialize with a default value
		let isValidProvider = false;
		let providerToCheck: JsonRpcProvider = new JsonRpcProvider(nextProvider);

		while (!isValidProvider) {
			randomIndex = this.getRandomNumber(0, providers.length - 1);
			nextProvider = providers[randomIndex];
			try {
				// Create a new provider instance for the current check
				providerToCheck = new JsonRpcProvider(nextProvider);
				await providerToCheck.getBlockNumber();
				isValidProvider = true; // Exit the loop
			} catch {
				console.log("Provider is not valid:", nextProvider);
				providerToCheck.destroy();
				await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a delay of 1 second before retrying.
			}
		}

		this.provider = providerToCheck; // Set the valid provider
		console.log("Switching to provider:", nextProvider);
		this.emit("providerChanged", nextProvider);
	}

	private setupRotation() {
		this.intervalId = setInterval(() => {
			void this.rotateProviders();
		}, this.interval);
	}

	stopRotation(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}
}
