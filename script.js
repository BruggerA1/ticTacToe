const player = (name = '') => {
	let score = 0;
	const getScore = () => score;
	const setScore = (newScore) => (score = newScore);
	const addPoint = () => {
		score++;
		return score;
	};
	const getName = () => name;
	const setName = (newName) => (name = newName);

	return { getScore, setScore, addPoint, getName, setName };
};

const playerONE = player();
const playerTWO = player();

const views = (() => {
	const startView = document.getElementById('startView');
	const gameView = document.getElementById('gameView');
	const gameOverView = document.getElementById('gameOverView');
	const gameViewModal = document.getElementById('gameViewModal');

	const toggle = (view) => {
		switch (view) {
			case startView:
				startView.classList.remove('hidden');
				gameView.classList.add('hidden');
				gameOverView.classList.add('hidden');
				break;
			case gameView:
				startView.classList.add('hidden');
				gameView.classList.remove('hidden');
				gameOverView.classList.add('hidden');
				break;
			case gameOverView:
				startView.classList.add('hidden');
				gameView.classList.add('hidden');
				gameOverView.classList.remove('hidden');
				break;
			case gameViewModal:
				gameViewModal.classList.toggle('hidden');
				break;
		}
	};

	return { toggle };
})();

const buttons = (() => {
	const startPlayGame = document.getElementById('startPlayGame');
	const gameRestart = document.getElementById('gameRestart');
	const gameMainMenu = document.getElementById('gameMainMenu');
	const gameOverPlayAgain = document.getElementById('gameOverPlayAgain');
	const gameOverMainMenu = document.getElementById('gameOverMainMenu');
	const gameNextRound = document.getElementById('gameNextRound');

	// init object
	startPlayGame.addEventListener('click', () => {
		gameLogic.newRound();
	});
	gameRestart.addEventListener('click', () => {
		gameLogic.restartGame();
	});
	gameMainMenu.addEventListener('click', () => {
		views.toggle(startView);
	});
	gameOverPlayAgain.addEventListener('click', () => {
		gameLogic.restartGame();
		turnController.isTurnOver = false;
		views.toggle(gameView);
	});
	gameOverMainMenu.addEventListener('click', () => {
		gameLogic.restartGame();
		turnController.isTurnOver = false;
		views.toggle(startView);
	});
	gameNextRound.addEventListener('click', () => {
		gameLogic.newRound();
		turnController.isTurnOver = false;
		views.toggle(gameViewModal);
	});
})();

const playerName = (() => {
	const one = () => document.getElementById('startPlayerOneTextBox').value;
	const two = () => document.getElementById('startPlayerTwoTextBox').value;

	return { one, two };
})();

const playerScoreBoard = (() => {
	const nameOne = document.getElementById('playerOneName');
	const scoreOne = document.getElementById('playerOneScore');
	const nameTwo = document.getElementById('playerTwoName');
	const scoreTwo = document.getElementById('playerTwoScore');

	const roundWinner = document.getElementById('roundWinner');
	const displayRoundWinner = () =>
		(roundWinner.innerText = turnController.playerTurn());

	const gameWinner = document.getElementById('gameWinner');
	const displayGameWinner = () =>
		(gameWinner.innerText = turnController.playerTurn());

	const update = () => {
		nameOne.innerText = playerONE.getName();
		scoreOne.innerText = playerONE.getScore();

		nameTwo.innerText = playerTWO.getName();
		scoreTwo.innerText = playerTWO.getScore();
	};

	return { displayRoundWinner, displayGameWinner, update };
})();

const scoreRange = (() => {
	const slider = document.getElementById('rangeSlider');
	const label = document.getElementById('scoreLabel');

	const setMaxScore = (value) => {
		slider.value = value;
		label.innerText = value;
	};

	const getMaxScore = () => slider.value;

	// init object
	slider.addEventListener('mousemove', () => setMaxScore(slider.value));
	[slider.min, slider.max] = [1, 10];
	setMaxScore(3);

	return { getMaxScore };
})();

const gameBoard = (() => {
	const fieldTiles = Array.from(document.querySelectorAll('.gameTile'));
	const matrix = [];

	const markTile = (targetTile) => {
		let row = targetTile.dataset.row;
		let col = targetTile.dataset.col;
		if (targetTile.innerText == '') {
			if (turnController.isTurnOver == true) return;

			matrix[row][col].innerText = turnController.playerTurn();

			gameLogic.checkWin(matrix[row][col].innerText);
			turnController.nextTurn();
		}
	};

	const clear = () => {
		matrix.forEach((row) => {
			row.forEach((column) => (column.innerText = ''));
		});
	};

	// init object
	fieldTiles.forEach((tile) =>
		tile.addEventListener('click', (e) => markTile(e.target))
	);
	// Create 3x3 Matrix
	while (fieldTiles.length > 0) matrix.push(fieldTiles.splice(0, 3));

	return { fieldTiles, matrix, markTile, clear };
})();

const turnController = (() => {
	let isTurnOver = false;
	let turnIndex = 0;

	const getTurn = () => turnIndex;
	const resetTurn = () => {
		turnIndex = 0;
		isTurnOver = false;
	};
	const endTurn = () => (turnController.isTurnOver = true);
	const nextTurn = () => {
		turnIndex++;
		return turnIndex;
	};
	const playerTurn = () => {
		return turnIndex % 2 == 0 ? 'close' : 'circle';
	};

	return { isTurnOver, getTurn, resetTurn, endTurn, nextTurn, playerTurn };
})();

const gameLogic = (() => {
	const newRound = () => {
		turnController.resetTurn();
		gameBoard.clear();
		views.toggle(gameView);
		playerONE.setName(playerName.one());
		playerTWO.setName(playerName.two());
		playerScoreBoard.update();
	};

	const restartGame = () => {
		newRound();
		playerONE.setScore(0);
		playerTWO.setScore(0);
		playerScoreBoard.update();
	};

	const scoreCheck = (player) => {
		if (player == scoreRange.getMaxScore()) {
			playerScoreBoard.displayGameWinner();
			views.toggle(gameOverView);
			views.toggle(gameViewModal);
		}
	};

	const winRound = () => {
		turnController.endTurn();
		playerScoreBoard.displayRoundWinner();

		switch (turnController.playerTurn()) {
			case 'close':
				playerONE.addPoint();
				scoreCheck(playerONE.getScore());
				break;
			case 'circle':
				playerTWO.addPoint();
				scoreCheck(playerTWO.getScore());
				break;
		}

		playerScoreBoard.update();
		views.toggle(gameViewModal);
	};

	const checkWin = (value) => {
		// Draw
		if (turnController.getTurn() == 9) views.toggle(gameViewModal);

		// Rows
		for (let i = 0; i < 3; i++) {
			if (
				gameBoard.matrix[i][0].innerText == value &&
				gameBoard.matrix[i][1].innerText == value &&
				gameBoard.matrix[i][2].innerText == value
			)
				winRound();
		}

		// Columns
		for (let i = 0; i < 3; i++) {
			if (
				gameBoard.matrix[0][i].innerText == value &&
				gameBoard.matrix[1][i].innerText == value &&
				gameBoard.matrix[2][i].innerText == value
			)
				winRound();
		}

		// First Diagonal
		if (
			gameBoard.matrix[0][0].innerText == value &&
			gameBoard.matrix[1][1].innerText == value &&
			gameBoard.matrix[2][2].innerText == value
		)
			winRound();

		// Second Diagonal
		if (
			gameBoard.matrix[0][2].innerText == value &&
			gameBoard.matrix[1][1].innerText == value &&
			gameBoard.matrix[2][0].innerText == value
		)
			winRound();
	};

	return { newRound, restartGame, checkWin };
})();
