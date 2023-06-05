// compose :: ((y -> z), (x -> y),  ..., (a -> b)) -> a -> z
const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
const curry = (fn) => {
	const arity = fn.length;
	return function $curry(...args) {
		if (args.length < arity) {
			return $curry.bind(null, ...args);
		}
		return fn.call(null, ...args);
	};
};

const zip = reset => {
	let container = []
	return (...args) => {
		container.push(...args);
		if (reset === null) { container = [] };
		console.log(container);
		return container.length === 1 ? container[0] : container;
	}
};