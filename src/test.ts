import { Provider } from "@ethersproject/providers";

import { RotatingProvider } from "./rotator.js";

class TestClass {
	constructor(public provider: Provider) {}
}
async function main() {
	const rotating = await RotatingProvider.new({
		chainId: 56,
		rotateIntervalSeconds: 10,
	});

	const testClass = new TestClass(rotating.provider);
	const provider = testClass.provider;

	let counter = 0;
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	setInterval(async () => {
		const block = await provider.getBlockNumber();
		counter++;
		if (counter === 30) {
			// eslint-disable-next-line n/no-process-exit
			process.exit(0);
		}

		console.log("Current block:", block);
	}, 3000);
}

main().catch((err) => {
	console.error(err);
});
