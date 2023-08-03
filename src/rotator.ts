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

function shuffle<T>(arr: T[]) {
	let currentIndex = arr.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[arr[currentIndex], arr[randomIndex]] = [
			arr[randomIndex],
			arr[currentIndex],
		];
	}

	return arr;
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
	const valid_providers = working
		.filter(([w]) => w)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		.map(([_, p]) => p) as JsonRpcProvider[];

	const final_provider_list = shuffle(valid_providers).slice(
		0,
		Math.min(5, valid_providers.length),
	);

	return new FallbackProvider(final_provider_list);
};
