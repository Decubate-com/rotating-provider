import { Provider } from "@ethersproject/providers";

import { createProvider } from "./rotator.js";

class TestClass {
	constructor(public provider: Provider) {}
}
async function main() {
	const rotating = await createProvider(1);

	const testClass = new TestClass(rotating);
	const provider = testClass.provider;

	let counter = 0;
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	setInterval(async () => {
		const block = await provider.getBlockNumber();
		counter++;
		if (counter === 5) {
			// eslint-disable-next-line n/no-process-exit
			process.exit(0);
		}

		console.log("Current block:", block);
	}, 3000);
}

main().catch((err) => {
	console.error(err);
});
