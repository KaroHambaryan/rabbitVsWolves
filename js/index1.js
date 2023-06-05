const FREE_CELL = 'cell';
const RABBIT_CELL = 'rabbit';
const WOLF_CELL = 'wolf';
const HOME_CELL = 'home';
const BARRIER_CELL = 'barrier';

let matrix = [];

let settings = {
	boardSize: 5,
	wolf: 3,
	barrier: 2,
	rabbit: 1,
	home: 1,
};

const changeStateSettings = data => settings = data;
const changeStateMatrix = matr => matrix = matr;

const zip = reset => {
	let container = []
	return (...args) => {
		container.push(...args);
		if (reset === null) { container = [] };
		console.log(container);
		return container.length === 1 ? container[0] : container;
	}
};

const setBoardSize = curry((data, size) => {
	data.boardSize = size;
	return data;
});

const setWolvesQuantity = data => {
	data.wolf = Math.floor((data.boardSize * 60) / 100);
	return data;
};

const setBarriersQuantity = data => {
	data.barrier = Math.ceil((data.boardSize * 40) / 100);
	console.log(data);
	return data;
};

const createMatrix = data => {
	matr = [];
	for (let i = 0; i < data.boardSize; i++) {
		matr[i] = [];
		for (let j = 0; j < data.boardSize; j++) {
			matr[i][j] = FREE_CELL;
		}
	}
	return matr;
};

const getRandomCoordinates = curry((data, matr) => {
	let lock = true;
	while (lock) {
		const [x, y] = [Math.floor(Math.random() * data.boardSize), Math.floor(Math.random() * data.boardSize)];
		if (matr[x][y] === FREE_CELL) {
			lock = false;
			return { x, y };
		}
	}
});

const putAnimalInMatrix = curry((data, animalName, matr) => {
	for (let i = 0; i < data[animalName]; i++) {
		const arr = getRandomCoordinates(data, matr);
		const { x, y } = arr;
		matr[x][y] = animalName;
	}
	return matr;
});

const getAnimalCoordinates = curry((animalName, matr) => {
	const coordsArray = []
	for (let i = 0; i < matr.length; i++) {
		for (let j = 0; j < matr.length; j++) {
			if (matr[i][j] === animalName) {
				coordsArray.push({ x: i, y: j })
			}
		}
	}
	return coordsArray.length === 1 ? coordsArray[0] : coordsArray;
});

const rabbitStep = curry((event, data, coords) => {
	let { x, y } = coords;
	let temp = coords;
	switch (event) {
		case "ArrowUp":
			y -= 1;
			if (y < 0) { y = data.boardSize - 1 };
			break;
		case "ArrowDown":
			y += 1
			if (y > data.boardSize - 1) { y = 0 };
			break;
		case "ArrowLeft":
			x -= 1
			if (x < 0) { x = data.boardSize - 1 };
			break;
		case "ArrowRight":
			x += 1;
			if (x > data.boardSize - 1) { x = 0 };
			break;
	}
	return {
		newCoord: { x, y },
		oldCoord: temp,
	};
});

const renderVictoriInfo = (message) => {
	const info = document.querySelector("#info");
	info.querySelector('.text-style').textContent = message;
	info.classList.remove('display-none');
};

const changePlaice = curry((matr, animalName, coords) => {
	const { newCoord, oldCoord } = coords;
	if (matr[newCoord.x][newCoord.y] === FREE_CELL) {
		matr[oldCoord.x][oldCoord.y] = FREE_CELL;
		matr[newCoord.x][newCoord.y] = animalName;
	}
	return matr;
});

const wolfStep = curry((wolf, rabbit) => {
	console.log(wolf, "old");
	const random = Math.floor(Math.random() * 2);
	if (random === 0) {
		if (wolf.y < rabbit.y) { wolf.y += 1; }
		if (wolf.y > rabbit.y) { wolf.y -= 1; }
	} else {
		if (wolf.x < rabbit.x) { wolf.x += 1; }
		if (wolf.x > rabbit.x) { wolf.x -= 1; }
	}
	return wolf;
});
// I Have a problem
const wolvesStep = matr => {
	const wolves = getAnimalCoordinates(WOLF_CELL, matr);
	const rabbit = getAnimalCoordinates(RABBIT_CELL, matr);
	// console.log(rabbit, "rab");
	for (let i = 0; i < wolves.length; i++) {
		let wol = wolves[i];
		let futurePlaceWolf = wolfStep(wol, rabbit);
		const coord = { newCoord:futurePlaceWolf, oldCoord: wolves[i]}
		console.log(futurePlaceWolf,'new');
		console.log(coord);
		const m = changePlaice(matr, WOLF_CELL, { newCoord: futurePlaceWolf, oldCoord: wol });
		render(m)
	}
	return changeStateMatrix(matr)
};

const render = matr => {
	const root = document.getElementById('root');
	const board = (root.lastElementChild).querySelector('#board');
	board.innerHTML = null;
	matr.forEach(array => {
		const column = document.createElement('div');
		array.forEach(cellName => {
			const row = document.createElement('div');
			row.classList.add(cellName);
			column.append(row);
		})
		board.append(column);
	})
};

const changeSelectValue = (selectedValue) => {
	const set = compose(
		changeStateSettings,
		setBarriersQuantity,
		setWolvesQuantity,
		setBoardSize(settings))
	set(selectedValue);
}

const startGame = () => {
	const start = compose(
		render,
		changeStateMatrix,
		putAnimalInMatrix(settings, BARRIER_CELL),
		putAnimalInMatrix(settings, HOME_CELL),
		putAnimalInMatrix(settings, WOLF_CELL),
		putAnimalInMatrix(settings, RABBIT_CELL),
		createMatrix
	);
	start(settings);
}

document.addEventListener("keyup", function (e) {
	const move = compose(
		wolvesStep,
		changePlaice(matrix, RABBIT_CELL),
		rabbitStep(e.key, settings),
		// zip(),
		getAnimalCoordinates(RABBIT_CELL));
	console.log(move(matrix));
});