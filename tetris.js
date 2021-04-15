// initialized the canvas
const canvas = document.querySelector('.my-canvas');
// canvas dimension
canvas.width = 260;
canvas.height = 400;

//canvas context
const ctx = canvas.getContext('2d');

//used for storing the current, next tetromino and its position
let tetromino = {
	currentTetro: null,
	currentTetroLetter: null,
	nextTetroLetter: null,
	pos: { x: 0, y: 0 },
};

//used for storing player details
let player = {
	score: 0,
	highScore: 0,
	level: 1,
};

//used for showing next tetromino
const next = document.querySelector('.tetro-img');

//colors array
const colors = [
	null,
	'#23A148',
	'#DB98AE',
	'#EE7828',
	'#870116',
	'#008FCD',
	'#9B469C',
	'#ECE000',
];

//game board of size 20x13 for holding the tetrominos position
const gameBoard = new Array(20).fill(0).map(() => new Array(13).fill(0));

/**
 * Initialize the game
 */
const init = () => {
	//scaling the canvas elements
	ctx.scale(20, 20);

	tetromino.nextTetroLetter = randomTetrominoLetter();
	gameBoardReset();

	//running the game
	run();
};

/*************DRAWING THE BOARD AND TETROMINOS*************/

/**
 * drawing the game board and tetrominos
 */
const draw = () => {
	ctx.beginPath();
	ctx.fillStyle = '#E0ECFF';
	//trail effect
	if (keyPressed) ctx.globalAlpha = 0.1;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//resetting alpha value
	ctx.globalAlpha = 1;
	drawBoard();
	drawTetromino();
};

/**
 * drawing the game board
 */
const drawBoard = () => {
	gameBoard.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				ctx.beginPath();
				ctx.fillStyle = colors[value];
				ctx.fillRect(x, y, 1, 1);
			}
		});
	});
};

/**
 * drawing the tetromino
 */
const drawTetromino = () => {
	tetromino.currentTetro.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				ctx.beginPath();
				ctx.fillStyle = colors[value];
				ctx.fillRect(x + tetromino.pos.x, y + tetromino.pos.y, 1, 1);
			}
		});
	});
};

/*************Game Board Interactions*************/

/**
 *Checking if the there is collision between tetrominos or game board boundaries
 * @returns {Boolean} true if collision happened and false if not
 */
const collision = () => {
	const [current, pos] = [tetromino.currentTetro, tetromino.pos];
	for (let y = 0; y < current.length; y++) {
		for (let x = 0; x < current[y].length; x++) {
			//checking if the tetromino matrix non zero value is colliding with the game board matrix non zero value
			if (
				current[y][x] !== 0 &&
				(gameBoard[y + pos.y] && gameBoard[y + pos.y][x + pos.x]) !== 0
			)
				return true;
		}
	}

	return false;
};

/**
 * Adding tetromino to gameBoard matrix
 */
const addTetrominoToBoard = () => {
	//looping through the tetromino array
	tetromino.currentTetro.forEach((row, y) => {
		row.forEach((value, x) => {
			//adding all non zero value to gameBoard array
			if (value !== 0)
				gameBoard[y + tetromino.pos.y][x + tetromino.pos.x] = value;
		});
	});
};

/**
 * Removing the completed lines from the game board array
 */
const gameBoardSweep = () => {
	//checking if there is any completed lines
	outer: for (let y = gameBoard.length - 1; y > 0; y--) {
		for (let x = 0; x < gameBoard[y].length; x++) {
			if (gameBoard[y][x] === 0) continue outer;
		}
		//removing that line from the game board matrix
		const row = gameBoard.splice(y, 1)[0].fill(0);
		//moving that line to the top of the matrix
		gameBoard.unshift(row);
		y++;
	}
};

/**
 * Resetting the game board after every tetromino drop is complete
 */
const gameBoardReset = () => {
	//setting up the current and next tetromino
	tetromino.currentTetroLetter = tetromino.nextTetroLetter;
	tetromino.nextTetroLetter = randomTetrominoLetter();
	tetromino.currentTetro = getTetromino(tetromino.currentTetroLetter);

	//setting the next tetromino image
	next.src = './resources/images/' + tetromino.nextTetroLetter + '.svg';

	//adjusting the starting position of the tetromino
	tetromino.pos.y = 0;
	tetromino.pos.x =
		((gameBoard[0].length / 2) | 0) -
		((tetromino.currentTetro[0].length / 2) | 0);
	const letter = tetromino.currentTetroLetter;
	//adjusting the position of the 'O' and 'I' tetrominos
	if (letter === 'O' || letter === 'I') tetromino.pos.x++;

	//game over
	if (collision()) {
		gameBoard.forEach((row) => row.fill(0));
	}
};

/*************Tetromino Structure & Functions*************/

/**
 * Provide the shape of tetromino according to the given type
 *
 * @param {String} type Letter of the shape
 * @returns {Number[][]} 2D array Representing the shape of tetromino
 */
const getTetromino = (type) => {
	if (type === 'T') {
		return [
			[0, 0, 0],
			[1, 1, 1],
			[0, 1, 0],
		];
	} else if (type === 'O') {
		return [
			[2, 2],
			[2, 2],
		];
	} else if (type === 'L') {
		return [
			[0, 3, 0],
			[0, 3, 0],
			[0, 3, 3],
		];
	} else if (type === 'J') {
		return [
			[0, 4, 0],
			[0, 4, 0],
			[4, 4, 0],
		];
	} else if (type === 'S') {
		return [
			[0, 5, 5],
			[5, 5, 0],
			[0, 0, 0],
		];
	} else if (type === 'Z') {
		return [
			[6, 6, 0],
			[0, 6, 6],
			[0, 0, 0],
		];
	} else if (type === 'I') {
		return [
			[0, 7, 0, 0],
			[0, 7, 0, 0],
			[0, 7, 0, 0],
			[0, 7, 0, 0],
		];
	}
};

/**
 *
 * @returns {String} Representing the letter of the tetromino
 */
const randomTetrominoLetter = () => {
	const tetrominos = ['T', 'O', 'L', 'J', 'S', 'Z', 'I'];
	const index = Math.floor(Math.random() * tetrominos.length);
	return tetrominos[index];
};

/**
 * Moving the tetromino vertically
 */
const tetrominoMoveVertical = () => {
	//increasing the y value
	tetromino.pos.y++;

	if (collision()) {
		tetromino.pos.y--;
		addTetrominoToBoard();
		gameBoardReset();
		gameBoardSweep();
	}

	//resetting the drop count
	dropCounter = 0;
};

/**
 * Moving the tetromino horizontally
 * @param {Number} direction (+) Move right or (-) Move left
 */
const tetrominoMoveHorizontal = (direction) => {
	//changing the x value according to direction
	tetromino.pos.x += direction;

	//stop horizontal movement when collision happens
	//with game board boundary or other tetromino
	if (collision()) tetromino.pos.x -= direction;
};

/**
 * Rotate the tetromino matrix
 * @param {Number[][]} tetromino The tetromino matrix
 * @param {Number} direction (+) Rotate Clockwise (-) Rotate Anti-clockwise
 */
const rotate = (tetromino, direction) => {
	//transposing the matrix
	for (let y = 0; y < tetromino.length; y++) {
		for (let x = 0; x < y; x++) {
			[tetromino[x][y], tetromino[y][x]] = [tetromino[y][x], tetromino[x][y]];
		}
	}

	//reversing each row in the matrix clockwise
	if (direction > 0) tetromino.forEach((row) => row.reverse());
	//reversing the matrix anti clockwise
	else tetromino.reverse();
};

/**
 *	Calling the rotate on current tetromino and check collision while rotating
 *  * @param {Number} direction (+) Rotate Clockwise (-) Rotate Anti-clockwise
 */
const tetrominoRotate = (direction) => {
	rotate(tetromino.currentTetro, direction);

	//when rotation causes collision
	const posX = tetromino.pos.x;
	let offset = 1;
	while (collision()) {
		tetromino.pos.x += offset;
		offset = -(offset + (offset > 0 ? 1 : -1));
		if (offset > tetromino.currentTetro[0].length) {
			rotate(tetromino.currentTetro, -direction);
			tetromino.pos.x = posX;
			return;
		}
	}
};

/*************Keyboard Interactions*************/

//for trail effect
let keyPressed = false;
document.addEventListener('keyup', (e) => {
	if (e.key === 's') keyPressed = false;
});

//handling key events
document.addEventListener('keydown', (e) => {
	if (e.key === 'a') tetrominoMoveHorizontal(-1);
	else if (e.key === 'd') tetrominoMoveHorizontal(+1);
	else if (e.key === 's') {
		keyPressed = true;
		tetrominoMoveVertical();
	} else if (e.key === 'w') tetrominoRotate(+1);
});

/*************Game Run*************/

//used to check when to drop the tetromino
let dropCounter = 0;
//used for how much time it take for tetromino to drop
//1 sec = 1000 ms
let timeForDrop = 1000;
//used to store the previous time
let prevTime = 0;

/**
 * creating animation by moving the tetromino inside the board
 * @param {number} time The current time in millisecond
 */
const run = (time = 0) => {
	//finding the difference between current and previous time
	const deltaTime = time - prevTime;

	//adding it to the drop counter
	dropCounter += deltaTime;

	//performing the drop if dropCounter is greater than time for drop
	if (dropCounter > timeForDrop) {
		tetrominoMoveVertical();
	}

	//storing the current time
	prevTime = time;

	draw();
	requestAnimationFrame(run);
};

///////////////////////////////////////////
/*testing methods*/

init();
