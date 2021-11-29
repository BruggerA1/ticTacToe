const player = (name) => {
	let score = 0;
	const getScore = () => score;
	const setScore = newScore => score = newScore;
	const addPoint = () => {
		score++;
		display.playerFields.refresh();
		return score;
	};
	const getName = () => name;
	const setName = newName => name = newName;

	return {
		getScore,
		setScore,
		addPoint,
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
				game.logic.newGame();
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

const game = (() => {
	const board = (() => {
		const fieldTiles = Array.from(document.querySelectorAll('.gameTile'));
		const matrix = [];

		const mark = (symbol, row, col) => {
			matrix[row][col].innerText = (symbol == 'close') ? 'close' : 'circle';
		};

		const getTile = ((e) => {
			let tileArray = e.target.id.split('');
			tileArray.forEach(x => parseInt(x));
			if (e.target.innerText == '') {
				(logic.playerTurn(logic.turnIndex) == 'close') ? mark('close', tileArray[0], tileArray[1])
				: mark('circle', tileArray[0], tileArray[1]);
				if (checkWin(logic.playerTurn(logic.turnIndex)) == true) {
					(logic.playerTurn(logic.turnIndex) == 'close') ? playerOne.addPoint()
					: playerTwo.addPoint();
				}
			};
			logic.turnIndex++;
		});

		const checkWin = (value) => {
			// Rows
			for (let i = 0; i < 3; i++) {
				if (matrix[i][0].innerText == value)
					if (matrix[i][1].innerText == value)
						if (matrix[i][2].innerText == value) return true;
			};
			// Columns
			for (let i = 0; i < 3; i++) {
				if (matrix[0][i].innerText == value)
					if (matrix[1][i].innerText == value)
						if (matrix[2][i].innerText == value) return true;
			};
			// First Diagonal
			if (matrix[0][0].innerText == value)
				if (matrix[1][1].innerText == value)
					if (matrix[2][2].innerText == value) return true;
			// Second Diagonal
			if (matrix[0][2].innerText == value)
				if (matrix[1][1].innerText == value)
					if (matrix[2][0].innerText == value) return true;
			// No Win Condition		
			return false;
		};

		const init = (() => {
			fieldTiles.forEach(tile => tile.addEventListener('click', (e) => getTile(e)));
			while (fieldTiles.length > 0) {
				matrix.push(fieldTiles.splice(0, 3));
			};
		})();

		return {
			fieldTiles,
			matrix,
			mark,
			getTile,
			checkWin,
			init,
		};
	})();

	const logic = (() => {
		let turnIndex = 0;

		const playerTurn = (turnIndex) => {
			return (turnIndex % 2 == 0) ? 'close' : 'circle';
		};

		const newGame = () => {
			playerOne.setScore(0);
			playerTwo.setScore(0);
			display.playerFields.refresh();
			display.views.toggleView(gameScreen);
		};

		return {
			turnIndex,
			playerTurn,
			newGame,
		};
	})();

	return {
		board,
		logic,
	};
})();


const playerOne = player('');
const playerTwo = player('');