const player = (name = '') => {
	let score = 0;
	const getScore = () => score;
	const setScore = newScore => score = newScore;
	const addPoint = () => {
		score++;
		return score;
	};
	const getName = () => name;
	const setName = newName => name = newName;

	return { getScore, setScore, addPoint, getName, setName };
};

const playerONE = player();
const playerTWO = player();

const views = (() => {
	const startView = document.getElementById('startView');
	const gameView = document.getElementById('gameView');
	const gameOverView = document.getElementById('gameOverView');
	const gameViewModal = document.getElementById('gameViewModal');

	const toggle = view => {
		switch (view) {
			case startView:
				startView.classList.remove("hidden");
				gameView.classList.add("hidden");
				gameOverView.classList.add("hidden");
				break;
			case gameView:
				startView.classList.add("hidden");
				gameView.classList.remove("hidden");
				gameOverView.classList.add("hidden");
				break;
			case gameOverView:
				startView.classList.add("hidden");
				gameView.classList.add("hidden");
				gameOverView.classList.remove("hidden");
				break;
			case gameViewModal:
				gameViewModal.classList.toggle("hidden");
				break;
		};
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
		gameLogic.newRound();
		playerONE.setScore(0);
		playerTWO.setScore(0);
		playerScoreBoard.update();
	});
	gameMainMenu.addEventListener('click', () => {
		views.toggle(startView);
	});
	gameOverPlayAgain.addEventListener('click', () => {
		gameLogic.newRound();
		playerONE.setScore(0);
		playerTWO.setScore(0);
		playerScoreBoard.update();
		views.toggle(gameView);
	});
	gameOverMainMenu.addEventListener('click', () => {
		gameLogic.newRound();
		playerONE.setScore(0);
		playerTWO.setScore(0);
		playerScoreBoard.update();
		views.toggle(startView);
	});
	gameNextRound.addEventListener('click', () => {
		gameLogic.newRound();
		views.toggle(gameViewModal);
	});
})();

const playerName = (() => {
	const one = (() => document.getElementById('startPlayerOneTextBox').value);
	const two = (() => document.getElementById('startPlayerTwoTextBox').value);

	return { one, two };
})();

const playerScoreBoard = (() => {
	const nameOne = document.getElementById('playerOneName');
	const scoreOne = document.getElementById('playerOneScore');
	const nameTwo = document.getElementById('playerTwoName');
	const scoreTwo = document.getElementById('playerTwoScore');

	const roundWinner = document.getElementById('roundWinner');
	const displayRoundWinner = () => roundWinner.innerText = turnLogic.playerTurn();

	const gameWinner = document.getElementById('gameWinner');
	const displayGameWinner = () => gameWinner.innerText = turnLogic.playerTurn();

	const update = () => {
		nameOne.innerText = playerONE.getName();
		scoreOne.innerText = playerONE.getScore();

		nameTwo.innerText = playerTWO.getName();
		scoreTwo.innerText = playerTWO.getScore();
	};

	return { update, displayRoundWinner, displayGameWinner };
})();

const scoreRange = (() => {
	const slider = document.getElementById('rangeSlider');
	const label = document.getElementById('scoreLabel');

	const setMaxScore = value => {
		slider.value = value;
		label.innerText = value;
	};

	const getMaxScore = () => slider.value;

	// init object
	slider.addEventListener('change', () => setMaxScore(slider.value));
	[slider.min, slider.max] = [1, 10];
	setMaxScore(3);

	return { getMaxScore };
})();

const gameBoard = (() => {
	const fieldTiles = Array.from(document.querySelectorAll('.gameTile'));
	const matrix = [];

	const markTile = targetTile => {
		let row = targetTile.dataset.row;
		let col = targetTile.dataset.col;
		if (targetTile.innerText == '') {
			if (turnLogic.isTurnOver == true) return;

			matrix[row][col].innerText = turnLogic.playerTurn();

			gameLogic.checkWin(matrix[row][col].innerText);
			turnLogic.nextTurn();
		};
	};

	const clear = () => {
		matrix.forEach(row => {
			row.forEach(column => column.innerText = '');
		});
	};

	// init object
	fieldTiles.forEach(tile => tile.addEventListener('click', (e) => markTile(e.target)));
	while (fieldTiles.length > 0) matrix.push(fieldTiles.splice(0, 3));

	return { fieldTiles, matrix, markTile, clear };

})();

const turnLogic = (() => {
	let isTurnOver = false;
	let turnIndex = 0;

	const getTurn = () => turnIndex;
	const resetTurn = () => {
		turnIndex = 0;
		turnLogic.isTurnOver = false;;
	};
	const endTurn = () => {
		turnLogic.isTurnOver = true;
	};
	const nextTurn = () => {
		turnIndex++;
		return turnIndex;
	};
	const playerTurn = () => {
		return (turnIndex % 2 == 0) ? 'close' : 'circle'
	};

	return { getTurn, resetTurn, nextTurn, playerTurn, isTurnOver, endTurn }
})();

const gameLogic = (() => {


	const newRound = () => {
		turnLogic.resetTurn();
		gameBoard.clear();
		views.toggle(gameView);
		playerONE.setName(playerName.one());
		playerTWO.setName(playerName.two());
		playerScoreBoard.update();
	};

	const scoreCheck = (player) => {
		if (player == scoreRange.getMaxScore()) {
			playerScoreBoard.displayGameWinner();
			views.toggle(gameOverView);
			views.toggle(gameViewModal);
		};
	};

	const winRound = () => {
		turnLogic.endTurn();
		playerScoreBoard.displayRoundWinner();
		if (turnLogic.playerTurn() == 'close') {
			playerONE.addPoint();
			scoreCheck(playerONE.getScore());
		}
		else {
			playerTWO.addPoint();
			scoreCheck(playerTWO.getScore());
		};
		playerScoreBoard.update();
		views.toggle(gameViewModal);
	};

	const checkWin = (value) => {
		// Draw
		if (turnLogic.getTurn() == 9) {
			views.toggle(gameViewModal);
		}
		// Rows
		for (let i = 0; i < 3; i++) {
			if (gameBoard.matrix[i][0].innerText == value)
				if (gameBoard.matrix[i][1].innerText == value)
					if (gameBoard.matrix[i][2].innerText == value) {
						winRound();
					};
		};
		// Columns
		for (let i = 0; i < 3; i++) {
			if (gameBoard.matrix[0][i].innerText == value)
				if (gameBoard.matrix[1][i].innerText == value)
					if (gameBoard.matrix[2][i].innerText == value) {
						winRound();
					};
		};
		// First Diagonal
		if (gameBoard.matrix[0][0].innerText == value)
			if (gameBoard.matrix[1][1].innerText == value)
				if (gameBoard.matrix[2][2].innerText == value) {
					winRound();
				};
		// Second Diagonal
		if (gameBoard.matrix[0][2].innerText == value)
			if (gameBoard.matrix[1][1].innerText == value)
				if (gameBoard.matrix[2][0].innerText == value) {
					winRound();
				};
	};

	return { newRound, checkWin };
})();