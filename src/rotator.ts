import {
	FallbackProvider,
	JsonRpcProvider,
	Provider,
} from "@ethersproject/providers";

import rpcList from "./constants/rpc.json";

type ChainProviderMap = Record<string, string[]>;
const chainList: ChainProviderMap = rpcList;

function timeout(ms: number) {
	return new Promise((resolve, reject) =>
		setTimeout(() => {
			reject(new Error("Timeout"));
		}, ms),
	);
}

function delay(ms: number) {
	return new Promise((resolve) =>
		setTimeout(() => {
			resolve(null);
		}, ms),
	);
}

export interface RotatingProviderConfig {
	chainId: number;
	maxProviders: number;
	rotateIntervalSeconds: number;
}

export class RotatingProvider {
	constructor(
		public provider: Provider,
		private _config: RotatingProviderConfig,
	) {
		setInterval(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			this.updateProvider.bind(this),
			Math.floor(_config.rotateIntervalSeconds * 1000),
		);
	}

	protected static async createNewProvider(config: RotatingProviderConfig) {
		const providers = chainList[config.chainId].map(
			(url) => new JsonRpcProvider(url),
		);

		const start = +new Date();
		const checked_providers = await Promise.all(
			providers.map(async (p) => {
				let working = true;
				try {
					await Promise.race([p.detectNetwork(), timeout(3000)]);
				} catch {
					working = false;
				}

				return { provider: p, time: +new Date() - start, working };
			}),
		);

		const valid_providers = checked_providers
			.filter(({ working }) => working)
			.sort((a, b) => a.time - b.time);

		const max = Math.min(config.maxProviders, valid_providers.length);

		const final_provider_list = valid_providers
			.slice(0, max)
			.map(({ provider }) => provider);

		return new FallbackProvider(final_provider_list);
	}

	public static async new(initial_config?: Partial<RotatingProviderConfig>) {
		const {
			chainId = 1,
			maxProviders = 5,
			rotateIntervalSeconds = 60,
		} = initial_config ?? {};

		const config = {
			chainId,
			maxProviders,
			rotateIntervalSeconds,
		};

		const provider = await this.createNewProvider(config);
		return new RotatingProvider(provider, config);
	}

	private async updateProvider(retries = 5): Promise<void> {
		try {
			this.provider = await RotatingProvider.createNewProvider(this._config);
			return;
		} catch {
			if (retries > 0) {
				await delay(100);
				return this.updateProvider(retries - 1);
			}
		}
	}
}
