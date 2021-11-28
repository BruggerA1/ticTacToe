const player = (name) => {
	let score = 0;
	const getScore = () => score;
	const setScore = newScore => score = newScore;
	const addPointToScore = () => {
		score++;
		display.playerFields.refresh();
		return score;
	};
	const getName = () => name;
	const setName = newName => name = newName;

	return {
		getScore,
		setScore,
		addPointToScore,
		getName,
		setName,
	};
};

const display = (() => {

	const views = (() => {
		const startView = document.getElementById('startScreen');
		const gameView = document.getElementById('gameScreen');
		const gameOverView = document.getElementById('gameOverScreen');

		const toggleView = view => {
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
			};
		};

		return {
			toggleView,
		}
	})();

	const buttons = (() => {
		const startPlayGame = document.getElementById('startPlayGame');
		const gameRestart = document.getElementById('gameRestart');
		const gameMainMenu = document.getElementById('gameMainMenu');
		const gameOverPlayAgain = document.getElementById('gameOverPlayAgain');
		const gameOverMainMenu = document.getElementById('gameOverMainMenu');

		const init = (() => {
			startPlayGame.addEventListener('click', () => {
				gameController.newGame();
			});
			gameRestart.addEventListener('click', () => {

			});
			gameMainMenu.addEventListener('click', () => {

			});
			gameOverPlayAgain.addEventListener('click', () => {

			});
			gameOverMainMenu.addEventListener('click', () => {

			});
		})();

		return {
			init,
		};
	})();

	const playerFields = (() => {
		const playerOneTextBox = document.getElementById('startPlayerOneTextBox');
		const playerOneName = document.getElementById('playerOneName');
		const playerOneScore = document.getElementById('playerOneScore');

		const playerTwoTextBox = document.getElementById('startPlayerTwoTextBox');
		const playerTwoName = document.getElementById('playerTwoName');
		const playerTwoScore = document.getElementById('playerTwoScore');

		const refresh = (() => {
			playerOne.setName(playerOneTextBox.value);
			playerOneName.innerText = playerOne.getName();
			playerOneScore.innerText = playerOne.getScore();

			playerTwo.setName(playerTwoTextBox.value);
			playerTwoName.innerText = playerTwo.getName();
			playerTwoScore.innerText = playerTwo.getScore();
		});

		return {
			refresh,
		};
	})();

	return {
		views,
		buttons,
		playerFields,
	}
})();

const gameController = (() => {
	const fieldTiles = Array.from(document.querySelectorAll('.gameTile'));
	const boardMatrix = [];
	const gameBoard = [
		['', '', ''],
		['', '', ''],
		['', '', '']
	];

	let turnIndex = 0;
	const playerTurn = (turnIndex) => {
		return (turnIndex % 2 == 0) ? 'X' : 'O';
	};

	const markSymbol = (symbol, row, col) => {
		boardMatrix[row][col].innerText = (symbol == 'X') ? 'close' : 'circle';
		gameBoard[row][col] = (symbol == 'X') ? 'X' : 'O';
		gameController.turnIndex++;
	};

	const checkBoard = (value) => {
		// Rows
		for (let i = 0; i < 3; i++) {
			if (gameBoard[i][0] == value)
				if (gameBoard[i][1] == value)
					if (gameBoard[i][2] == value) return true;
		};

		// Columns
		for (let i = 0; i < 3; i++) {
			if (gameBoard[0][i] == value)
				if (gameBoard[1][i] == value)
					if (gameBoard[2][i] == value) return true;
		};

		// First Diagonal
		if (gameBoard[0][0] == value)
			if (gameBoard[1][1] == value)
				if (gameBoard[2][2] == value) return true;

		// Second Diagonal
		if (gameBoard[0][2] == value)
			if (gameBoard[1][1] == value)
				if (gameBoard[2][0] == value) return true;

		// No Win Condition		
		return false;
	};

	const newGame = () => {
		playerOne.setScore(0);
		playerTwo.setScore(0);
		display.playerFields.refresh();
		display.views.toggleView(gameScreen);
	};

	const markTile = ((e) => {
		let whosTurn = gameController.playerTurn(gameController.turnIndex);
		let tileArray = e.target.id.split('');
		tileArray.forEach(x => parseInt(x));

		if (e.target.innerText == '') {
			(whosTurn == 'X') ? gameController.markSymbol('X', tileArray[0], tileArray[1]) : gameController.markSymbol('O', tileArray[0], tileArray[1]);

			if (gameController.checkBoard(whosTurn) == true) {
				(whosTurn == 'X') ? playerOne.addPointToScore() : playerTwo.addPointToScore();
			};

		};

	});

	const init = (() => {
		fieldTiles.forEach(tile => tile.addEventListener('click', (e) => gameController.markTile(e)));
		while (fieldTiles.length > 0) {
			boardMatrix.push(fieldTiles.splice(0, 3));
		};
	})();

	return {
		gameBoard,
		markSymbol,
		checkBoard,
		init,
		newGame,
		turnIndex,
		playerTurn,
		markTile,
	}

})();


const playerOne = player('');
const playerTwo = player('');