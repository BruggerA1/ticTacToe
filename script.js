const displayController = (() => {
	const views = (() => {
		const startScreen = document.getElementById('startScreen');
		const gameScreen = document.getElementById('gameScreen');
		const gameOverScreen = document.getElementById('gameOverScreen');

		const toggleView = view => {
			switch (view) {
				case startScreen:
					startScreen.classList.remove("hidden");
					gameScreen.classList.add("hidden");
					gameOverScreen.classList.add("hidden");
					break;
				case gameScreen:
					startScreen.classList.add("hidden");
					gameScreen.classList.remove("hidden");
					gameOverScreen.classList.add("hidden");
					break;
				case gameOverScreen:
					startScreen.classList.add("hidden");
					gameScreen.classList.add("hidden");
					gameOverScreen.classList.remove("hidden");
					break;
			};
		};

		return {
			toggleView
		};
	})();
	const buttons = (() => {
		const startPlayGame = document.getElementById('startPlayGame');

		const gameRestart = document.getElementById('gameRestart');
		const gameMainMenu = document.getElementById('gameMainMenu');

		const gameOverPlayAgain = document.getElementById('gameOverPlayAgain');
		const gameOverMainMenu = document.getElementById('gameOverMainMenu');
		
		(() => {
			startPlayGame.addEventListener('click', () => displayController.views.toggleView(gameScreen));

			gameRestart.addEventListener('click', () => displayController.views.toggleView(gameScreen));
			gameMainMenu.addEventListener('click', () => displayController.views.toggleView(startScreen));

			gameOverPlayAgain.addEventListener('click', () => displayController.views.toggleView(gameScreen));
			gameOverMainMenu.addEventListener('click', () => displayController.views.toggleView(startScreen))
		})();
		
	})();
	return {
		views,
		buttons
	};
})();

const GameController = (() => {
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

