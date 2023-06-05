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
		const [x, y] = [Math.floor(Math.random() * data.boardSize), Math.floor(Math.random() * data.boardSize)];
		if (matr[x][y] === FREE_CELL) {
			return { x, y };
		}
		return getRandomCoordinates(data, matr)
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

const renderVictoryInfo = (message) => {
	const info = document.querySelector("#info");
	info.querySelector('.text-style').textContent = message;
	info.classList.remove('display-none');
};

const displayNone = () => info.classList.add('display-none');

const changePlaice = curry((matr, animalName, coords) => {
	const { newCoord, oldCoord } = coords;
	if (matr[newCoord.x][newCoord.y] === FREE_CELL) {
		matr[oldCoord.x][oldCoord.y] = FREE_CELL;
		matr[newCoord.x][newCoord.y] = animalName;
	}
	if (animalName === RABBIT_CELL) {
		if (matr[newCoord.x][newCoord.y] === WOLF_CELL) {
			renderVictoryInfo('Loss');
			matr[oldCoord.x][oldCoord.y] = FREE_CELL;
			matr[newCoord.x][newCoord.y] = animalName;
		}
		if (matr[newCoord.x][newCoord.y] === HOME_CELL) {
			renderVictoryInfo('Won');
			matr[oldCoord.x][oldCoord.y] = FREE_CELL;
			matr[newCoord.x][newCoord.y] = animalName;
		}
	}
	if (animalName === WOLF_CELL) {
		if (matr[newCoord.x][newCoord.y] === RABBIT_CELL) {
			renderVictoryInfo('Loss');
			matr[oldCoord.x][oldCoord.y] = FREE_CELL;
			matr[newCoord.x][newCoord.y] = animalName;
		}
	}
	return matr;
});

const wolfStep = curry((wolf, rabbit) => {
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

const wolvesStep = matr => {
	const length = getAnimalCoordinates(WOLF_CELL, matr).length;
	const rabbit = getAnimalCoordinates(RABBIT_CELL, matr);
	for (let i = 0; i < length; i++) {
		let wolf = getAnimalCoordinates(WOLF_CELL, matr)[i];
		let futurePlaceWolf = wolfStep({ ...wolf }, rabbit);
		const coord = { newCoord: futurePlaceWolf, oldCoord: wolf }
		matr = changePlaice(matr, WOLF_CELL, coord);
	}
	return matr
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
	const set = compose(changeStateSettings, setBarriersQuantity, setWolvesQuantity, setBoardSize(settings));
	set(selectedValue);
}

const startGame = () => {
	const start = compose(render, changeStateMatrix, putAnimalInMatrix(settings, BARRIER_CELL), putAnimalInMatrix(settings, HOME_CELL), putAnimalInMatrix(settings, WOLF_CELL), putAnimalInMatrix(settings, RABBIT_CELL), createMatrix);
	start(settings);
	displayNone();
}

document.addEventListener("keyup", function (e) {
	const move = compose(render, changeStateMatrix, wolvesStep, changePlaice(matrix, RABBIT_CELL), rabbitStep(e.key, settings), getAnimalCoordinates(RABBIT_CELL));
	move(matrix);
});