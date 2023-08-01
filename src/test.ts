import { RotatingProvider } from "./rotator.js";

class TestClass {
	constructor(public provider: RotatingProvider) {}
}

const testClass = new TestClass(new RotatingProvider(1, 5000));
const provider = testClass.provider.provider;

function main() {
	let counter = 0;
	setInterval(async () => {
		const block = await provider.getBlockNumber();
		counter++;
		if (counter === 5) {
			testClass.provider.stopRotation();
			process.exit(0);
		}
		console.log("Current block:", block);
	}, 3000);
}

main();
