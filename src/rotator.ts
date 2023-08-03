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

export const createProvider = async (chainId: number, maxProviders = 5) => {
	const providers = chainList[chainId].map((url) => new JsonRpcProvider(url));

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

	const max = Math.min(maxProviders, valid_providers.length);

	const final_provider_list = valid_providers
		.slice(0, max)
		.map(({ provider }) => provider);

	return new FallbackProvider(final_provider_list);
};
