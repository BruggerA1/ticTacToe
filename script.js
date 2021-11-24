const displayController = (() => {
	const views = (() => {
		// Define Variables
		const startView = document.getElementById('startScreen');
		const gameView = document.getElementById('gameScreen');
		const gameOverView = document.getElementById('gameOverScreen');	
		// Define Functions
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
		};
	})();
	const buttons = (() => {
		// Define Variables
		// Start View
		const startPlayGame = document.getElementById('startPlayGame');
		// Game View
		const gameRestart = document.getElementById('gameRestart');
		const gameMainMenu = document.getElementById('gameMainMenu');
		// GameOver View
		const gameOverPlayAgain = document.getElementById('gameOverPlayAgain');
		const gameOverMainMenu = document.getElementById('gameOverMainMenu');
		
		// Initialization
		const init = (() => {
			startPlayGame.addEventListener('click', () => displayController.views.toggleView(gameScreen));

			gameRestart.addEventListener('click', () => displayController.views.toggleView(gameScreen));
			gameMainMenu.addEventListener('click', () => displayController.views.toggleView(startScreen));

			gameOverPlayAgain.addEventListener('click', () => displayController.views.toggleView(gameScreen));
			gameOverMainMenu.addEventListener('click', () => displayController.views.toggleView(startScreen))
		})();

		return {
			init,
		};
	})();
	return {
		views,
		buttons,
	};
})();

const gameController = (() => {
	// Define Variables
	const fieldTiles = Array.from(document.querySelectorAll('.gameTile'));
	const boardMatrix = [];

	// Initialization
	const init = (() => {
		while (fieldTiles.length > 0) {
			boardMatrix.push(fieldTiles.splice(0,3));
		};
	})();

	// Define Functions
	const markX = (row, col) => {
		boardMatrix[row-1][col-1].innerText = 'close';
		return 'X';
	};
	const markO = (row, col) => {
		boardMatrix[row-1][col-1].innerText = 'circle';
		return 'O';
	}
	return {
		init,
		markX,
		markO,
	};
})();

const player = (symbol, name) => {
	let score = 0;
	const getScore = () => score;
	const addPoint = () => {
		score++
		return score
	};
	const getSymbol = () => symbol;
	const getName = () => name;
	return {
		getScore,
		addPoint,
		getSymbol,
		getName,
	};
};

const playerOne = player('X', 'Brugger');
const playerTwo = player('O', 'Winston');

