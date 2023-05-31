'use strict';
const newGameData = () => {
	return {
		matr: [],
		randomCoords: [],
		boardSize: 5,
		rabbit_cell: 'rabbit',
		home_cell: 'home',
		barrier_cell: 'barrier',
		wolf_cell: 'wolf',
		free_cell: 'cell',
		countOfRabbit: 1,
		countOfHome: 1,
		countOfWolves: 3,
		countOfBarriers: 2,
	}
};

const setBoardSize = value => data => {
	data.boardSize = value;
	return data
}

const setParticipant = data => {
	data.countOfWolves = Math.floor((data.boardSize * 60) / 100);
	data.countOfBarriers = Math.ceil((data.boardSize * 40) / 100);
	return data;
};

const createMatrix = data => {
	data.matr = [];
	for(let i = 0; i < data.boardSize; i++){
		data.matr[i] = [];
		for(let j = 0; j < data.boardSize; j++){
			data.matr[i][j] = data.free_cell;
		}
	}
	return data;
}



const placeCharacter = data => {
	[
		[data.rabbit_cell, data.countOfRabbit], [data.home_cell, data.countOfHome],
		[data.wolf_cell, data.countOfWolves], [data.barrier_cell, data.countOfBarriers]
	].forEach(elem => {
		for (let i = 0; i < elem[1]; i++) {
			const arr = setRandomCell(data);
			const [x, y] = [arr[0],arr[1]];
			data.matr[x][y] = elem[0];
		}
	});
	return data;
}

const render = data => {
	const root = document.getElementById('root');
	const board = (root.lastElementChild).querySelector('#board');
	board.innerHTML = null;
	data.matr.forEach(element => {
		const column = document.createElement('div');
		element.forEach(class_name => {
			const row = document.createElement('div');
			row.classList.add(class_name);
			column.append(row);
		})
		board.append(column);
	})
	return data;
}

const gameData = newGameData();
const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

const changeSelectValue = selectValue => {
	const setBoardData = compose(createMatrix,setParticipant,setBoardSize(selectValue));
	setBoardData(gameData);
};

const startGame = () => {
	const start = compose(render, placeCharacter, createMatrix, setParticipant);
	start(gameData);
}

const getAnimalCoordinates= class_name => data =>  {
	const coordsArray = []
	for (let i = 0; i < data.matr.length; i++) {
		for (let j = 0; j < data.matr.length; j++) {
			if (data.matr[i][j] === class_name) {
				coordsArray.push([i, j])
			}
		}
	}
	console.log(coordsArray[0]);
	return coordsArray;
};

const rabbitStep = event => coordArray => {
	let [x, y] = coordArray[0];
	console.log(event);
	switch (event) {
		case "ArrowUp":
			y -= 1
			return [x, y];
		case "ArrowDown":
			y += 1
			return [x, y];
		case "ArrowLeft":
			x -= 1
			return [x, y];
		case "ArrowRight":
			x += 1
			return [x, y];
	}
}

const moveStep = 

document.addEventListener("keyup", function (e) {
	const move = compose(rabbitStep(e.key),getCoordinates(gameData.rabbit_cell))
	move(gameData);
	console.log(move(gameData));
});
