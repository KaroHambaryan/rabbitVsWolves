const FREE_CELL = 'cell';
const RABBIT_CELL = 'rabbit';
const WOLF_CELL = 'wolf';
const HOME_CELL = 'home';
const BARRIER_CELL = 'barrier';

let matrix= [];

const settings = {
	boardSize: 5,
	wolf: 3,
	barrier: 2,
	rabbit: 1,
	home: 1,
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
	return data;
};

const getMatrix = matr=> {
	matr = [];
	for (let i = 0; i < settings.boardSize; i++) {
		matr[i] = [];
		for (let j = 0; j < settings.boardSize; j++) {
			matr[i][j] = FREE_CELL;
		}
	}
	matrix = matr
	return matrix ;
};

const getRandomPosition = curry((data,matr) => {
	let lock = true;
	while (lock) {
		const [x, y] = [Math.floor(Math.random() * data.boardSize), Math.floor(Math.random() * data.boardSize)];
		if (matr[x][y] === FREE_CELL) {
			lock = false;
			return { x, y };
		}
	}
});

const placeAnimal = curry((data,animalName,matr) => {
	for (let i = 0; i < data[animalName]; i++) {
		const arr = getRandomPosition(data,matr);
		const { x, y } = arr;
		matr[x][y] = animalName;
	}
	return matrix = matr;
});

const getAnimalCoordinates= curry((animalName, matr) => {
	const coordsArray = []
	for (let i = 0; i < matr.length; i++) {
		for (let j = 0; j < matr.length; j++) {
			if (matr[i][j] === animalName) {
				coordsArray.push({i, j})
			}
		}
	}
	return coordsArray;
});

const rabbitStep = curry((event, coordArray) => {
	let { x, y } = coordArray[0];
	let temp = coordArray[0];
	switch (event) {
		case "ArrowUp":
			y -= 1
			if(y < 0){y = settings.boardSize - 1}
			break;
		case "ArrowDown":
			y += 1
			if(y > settings.boardSize - 1){y = 0}
			break;
		case "ArrowLeft":
			x -= 1
			if(x < 0){x = settings.boardSize - 1}
			break;
		case "ArrowRight":
			x += 1;
			if(x > settings.boardSize - 1){x = 0}
			break;
	}
	return {
		newCoord: { x, y },
		oldCoord: temp
	};
});

const moveStep = curry((matr, animalName, coords) => {
	const { nx, ny } = coords.newCoord;
	const { ox, oy } = coords.oldCoord;
	if (matr[nx][ny] === className) {
		matr[ox][oy] = FREE_CELL;
		matr[nx][ny] = animalName;
		matrix = matr;
		return matrix;
	}
});

const render = matr=> {
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
	const set = compose(setBarriersQuantity,setWolvesQuantity,setBoardSize(settings))
	set(selectedValue);
}

const startGame = () => {
	const start = compose(
		render,
		placeAnimal(settings,BARRIER_CELL),
		placeAnimal(settings,HOME_CELL),
		placeAnimal(settings,WOLF_CELL),
		placeAnimal(settings,RABBIT_CELL),
		getMatrix
	);
	start(settings);
}

document.addEventListener("keyup", function (e) {
	const move = compose(rabbitStep(e.key),getAnimalCoordinates(RABBIT_CELL));
	console.log(matrix);
	console.log(move(matrix));
});