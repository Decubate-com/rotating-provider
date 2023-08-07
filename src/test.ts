import { createFallbackProvider } from "./rotator.js";

async function main() {
	const provider = await createFallbackProvider({
		chainId: 56,
		rotateIntervalSeconds: 60,
	});

	let counter = 0;
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	setInterval(async () => {
		const block = await provider.getBlockNumber();
		counter++;
		if (counter === 10000) {
			// eslint-disable-next-line n/no-process-exit
			process.exit(0);
		}

		console.log("Current block:", block);
	}, 3000);
}

main().catch((err) => {
	console.error(err);
});
