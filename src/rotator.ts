import { FallbackProvider, JsonRpcProvider } from "@ethersproject/providers";

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

export interface RotatingProviderConfig {
	chainId: number;
	maxProviders: number;
	rotateIntervalSeconds: number;
}

export async function createFallbackProvider(
	initial_config?: Partial<RotatingProviderConfig>,
) {
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

	return new FallbackProvider(
		final_provider_list,
		1 / final_provider_list.length,
	);
}
