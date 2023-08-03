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

export const createProvider = async (chainId: number) => {
	const providers = chainList[chainId].map((url) => new JsonRpcProvider(url));

	const working = await Promise.all(
		providers.map(async (p) => {
			try {
				await Promise.race([p.detectNetwork(), timeout(3000)]);
				return [true, p];
			} catch {
				return [false, p];
			}
		}),
	);
	const providers_to_use = working
		.filter(([w]) => w)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		.map(([_, p]) => p) as JsonRpcProvider[];

	return new FallbackProvider(providers_to_use);
};
