// Constants
SNAKE_BLOCK_SIZE = 20;

// Game items
dx = 1;
dy = 0;
snakeBlocks = [];
solidBlocks = [];
pellet = {};

// Canvas stuff
canvas = null;
ctx = null;

//Game stats
score = 0;
failed = 1;
x = 0;
y = 0;

gameLoopInterval = null;

window.onload = function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	window.onkeydown = function(e) {
		switch(e.keyCode) {
			case 37: // LEFT
				if(dx != 1) dx = -1;
				dy = 0;
				e.preventDefault();
				break;
			case 38: // UP
				if(dy != 1) dy = -1;
				dx = 0;
				e.preventDefault();
				break;
			case 39: // RIGHT
				if(dx != -1) dx = 1;
				dy = 0;
				e.preventDefault();
				break;
			case 40: // DOWN
				if(dy != -1) dy = 1;
				dx = 0;
				e.preventDefault();
				break;
		}
	}

	mainMenu();
}

function initGame() {
	dx = 1;
	dy = 0;

	gameLoopInterval = setInterval(gameLoop, 75);
	update_scores();


	snakeBlocks = [];
	snakeBlocks.push({x: 200, y: 200});

	randomizePellet();

	randomizeSolidBlocks(3);
}

function gameLoop() {
	clear();
	draw();

	for(var i = snakeBlocks.length - 1; i >= 0; i--) {
		// If we collide with our tail, GAME OVER
		if(i != 0 && snakeBlocks[0].x === snakeBlocks[i].x && snakeBlocks[0].y === snakeBlocks[i].y) {
			// GAME OVER
			gameOver();
			return;
		}

		if(i != 0) {
			snakeBlocks[i].x = snakeBlocks[i - 1].x;
			snakeBlocks[i].y = snakeBlocks[i - 1].y;
		} else {
			if(dy === 0) {
				snakeBlocks[i].x += dx * SNAKE_BLOCK_SIZE;
			}
			else if (dx === 0) {
				snakeBlocks[i].y += dy * SNAKE_BLOCK_SIZE;
			}
		}


	}

	// Check for collision with solid blocks with head of snake.
	for(var j = 0; j < solidBlocks.length; j++) {
		if(snakeBlocks[0].x === solidBlocks[j].x && snakeBlocks[0].y === solidBlocks[j].y) {
	 		// GAME OVER
	 		gameOver();
	 		return;
	 	}
	}

	// Game over if we hit the edges of the canvas
	if(snakeBlocks[0].x < 0 || snakeBlocks[0].x >= canvas.width || snakeBlocks[0].y < 0 || snakeBlocks[0].y >= canvas.height) {
		gameOver();
		gameOverPromise.
		return;
	}

	// Check collision with pellet
	if(snakeBlocks[0].x === pellet.x && snakeBlocks[0].y === pellet.y) {
		appendBlocks(1);
		randomizePellet();
		randomizeSolidBlocks(solidBlocks.length + 1);

	}
}

function draw() {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw pellet
	ctx.fillStyle = "#ff0000";
	ctx.fillRect(pellet.x, pellet.y, SNAKE_BLOCK_SIZE, SNAKE_BLOCK_SIZE);

	// Draw snake
	for(var i = 0; i < snakeBlocks.length; i++) {
		ctx.fillStyle = "#00ff00";
		ctx.fillRect(snakeBlocks[i].x, snakeBlocks[i].y, 0.99 * SNAKE_BLOCK_SIZE, 0.99 * SNAKE_BLOCK_SIZE);
	}

	// Draw solid blocks
	for(var i = 0; i < solidBlocks.length; i++) {
		ctx.fillStyle = "#ffff00";
		ctx.fillRect(solidBlocks[i].x, solidBlocks[i].y, SNAKE_BLOCK_SIZE, SNAKE_BLOCK_SIZE);
	}
}

function appendBlocks(numBlocks) {
	for(var i = 0; i < numBlocks; i++) {
		snakeBlocks.push({x: snakeBlocks[0].x + SNAKE_BLOCK_SIZE * dx, y: snakeBlocks[0].y + SNAKE_BLOCK_SIZE * dy});
	}
}

function randomBoardPos(max) {
	return Math.floor((max / SNAKE_BLOCK_SIZE) * Math.random()) * SNAKE_BLOCK_SIZE
}

function randomizeSolidBlocks(numBlocks) {
	if(numBlocks > 10) numBlocks = 10;
	solidBlocks = [];
	for(var i = 0; i < numBlocks; i++) {
		x = randomBoardPos(canvas.width);
		y = randomBoardPos(canvas.height);
		//Prevent the block from being in the same position as the pellet
		//Prevent blocks from being in the same line of the direction traveling
		if((pellet.x === x && pellet.y === y) ||  x === snakeBlocks[0].x || y === snakeBlocks[0].y){
			i--;
			continue;
		}
		solidBlocks.push({x: x, y: y});
	}
}

function randomizePellet() {
	pellet = {x: randomBoardPos(canvas.width), y: randomBoardPos(canvas.height)};
}

function clear(){
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function mainMenu() {
	//clearInterval(gameLoopInterval);

	clear();
	ctx.font = "80px Courier New";
	ctx.fillStyle = "#00ff00";
	ctx.textAlign = "center";
	ctx.fillText("SnakeBlocks", canvas.width/2, 150);

	ctx.font = "40px Courier New";
	ctx.fillStyle = "#f00";
	ctx.textAlign = "center";
	ctx.fillText("Play Game", canvas.width/2, 290);

	ctx.beginPath();
	ctx.lineWidth="3";
	ctx.strokeStyle="white";
	ctx.rect(475, 230, 250, 100);
	ctx.stroke();

	window.onmousedown = function(e) {
		var x = event.x;
		var y = event.y;
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		y += Math.round(window.scrollY);
		ctx.rect(475, 230, 250, 100);
		if(x > 475 && x < 475 + 250 && y > 230 && y < 230 + 100){
			initGame();
		}
	}
}

function gameOver() {
	clearInterval(gameLoopInterval);

	clear();

	if(failed == 1){
		var replay = "Try Again";
		var status = "You Suck!"
	}
	else{
		var replay = "Play Again";
		var status = "You Did Great!"
	}

	ctx.font = "80px Courier New";
	ctx.fillStyle = "#00ff00";
	ctx.textAlign = "center";
	ctx.fillText("Game Over", canvas.width/2, 150);

	ctx.font = "32px Courier New";
	ctx.fillStyle = "#00ff00";
	ctx.textAlign = "left";
	ctx.fillText(status, 20, 430);
	ctx.fillText("Score: " + snakeBlocks.length, 20, 480);

	ctx.font = "40px Courier New";
	ctx.fillStyle = "#f00";
	ctx.textAlign = "center";
	ctx.fillText(replay, canvas.width/2, 290);

	ctx.beginPath();
	ctx.lineWidth="3";
	ctx.strokeStyle="white";
	ctx.rect(475, 230, 250, 100);
	ctx.stroke();

	window.onmousedown = function(e){
		var x = event.x;
		var y = event.y;
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		y += Math.round(window.scrollY);
		ctx.rect(475, 230, 250, 100);
		if(x > 475 && x < 475 + 250 && y > 230 && y < 230 + 100){
			initGame();
		}
	}

	setTimeout(function() {
		highscore(snakeBlocks.length);
	}, 100);
}
