// Constants
SNAKE_BLOCK_SIZE = 20;
NUM_SOLID_BLOCKS = 3;

// Game items
snakeBlocks = [];
changes = [];
solidBlocks = [];
pellet = {};

// Canvas stuff
canvas = null;
ctx = null;

//Game stats
gameState = 0;
score = 0;
failed = 1;
x = 0;
y = 0;

window.onload = function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	initGame();

	window.onkeydown = function(e) {
		switch(e.keyCode) {
			case 37: // LEFT
				changes.push({x: snakeBlocks[0].x, y: snakeBlocks[0].y, dx: -1, dy: 0});
				e.preventDefault();
				break;
			case 38: // UP
				changes.push({x: snakeBlocks[0].x, y: snakeBlocks[0].y, dx: 0, dy: -1});
				e.preventDefault();
				break;
			case 39: // RIGHT
				changes.push({x: snakeBlocks[0].x, y: snakeBlocks[0].y, dx: 1, dy: 0});
				e.preventDefault();
				break;
			case 40: // DOWN
				changes.push({x: snakeBlocks[0].x, y: snakeBlocks[0].y, dx: 0, dy: 1});
				e.preventDefault();
				break;
		}
	}

	setInterval(gameLoop, 75);
}

function initGame() {
	update_scores();
	snakeBlocks = [];
	snakeBlocks.push({x: 200, y: 200, dx: 1, dy: 0});

	randomizePellet();

	randomizeSolidBlocks(3);
}

function gameLoop() {
	if(gameState == 0){
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

		window.onmousedown = function(e){
			var x = event.x;
			var y = event.y;
			x -= canvas.offsetLeft;
			y -= canvas.offsetTop;
			y += Math.round(window.scrollY);
			ctx.rect(475, 230, 250, 100);
			if(x > 475 && x < 475 + 250 && y > 230 && y < 230 + 100){
				gameState = 1;
				initGame();
			}
		}
	}
	else if(gameState == 1){
		clear();
		draw();
		for(var i = 0; i < snakeBlocks.length; i++) {
			// change the tail direction at the correct point
			for(var j = 0; j < changes.length; j++) {
				if(snakeBlocks[i].x === changes[j].x && snakeBlocks[i].y === changes[j].y) {
					snakeBlocks[i].dx = changes[j].dx;
					snakeBlocks[i].dy = changes[j].dy;

					// Remove from the changes after all the blocks have gone through it
					if(i === snakeBlocks.length - 1) changes.shift();
				}
			}

			snakeBlocks[i].x += snakeBlocks[i].dx * SNAKE_BLOCK_SIZE;
			snakeBlocks[i].y += snakeBlocks[i].dy * SNAKE_BLOCK_SIZE;

			// If we collide with our tail, GAME OVER
			if(i != 0 && snakeBlocks[0].x == snakeBlocks[i].x && snakeBlocks[0].y == snakeBlocks[i].y) {
				// GAME OVER
				gameState = 2;
				return;
			}

			// Check for collision with solid blocks
			for(var j = 0; j < solidBlocks.length; j++) {
				if(snakeBlocks[i].x === solidBlocks[j].x && snakeBlocks[i].y === solidBlocks[j].y) {
					// GAME OVER
					gameState = 2;
					return;
				}
			}
		}
	}
	else{
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
		ctx.fillText("Score: 4000", 20, 480);

		ctx.font = "40px Courier New";
		ctx.fillStyle = "#f00";
		ctx.textAlign = "center";
		ctx.fillText(replay, canvas.width/2, 290);

		ctx.beginPath();
		ctx.lineWidth="3";
		ctx.strokeStyle="white";
		ctx.rect(475, 230, 250, 100);
		ctx.stroke();

		// ['name'=>'First Last', 'score'=>100]
		// highscore(score) Update the score for the api

		window.onmousedown = function(e){
			var x = event.x;
			var y = event.y;
			x -= canvas.offsetLeft;
			y -= canvas.offsetTop;
			y += Math.round(window.scrollY);
			ctx.rect(475, 230, 250, 100);
			if(x > 475 && x < 475 + 250 && y > 230 && y < 230 + 100){
				gameState = 1;
				initGame();
			}
		}
	}

	// Game over if we hit the edges of the canvas
	if(snakeBlocks[0].x < 0 || snakeBlocks[0].x >= canvas.width || snakeBlocks[0].y < 0 || snakeBlocks[0].y >= canvas.height) {
		gameState = 2;
		return;
	}

	// Check collision with pellet
	if(snakeBlocks[0].x === pellet.x && snakeBlocks[0].y === pellet.y) {
		appendBlock();
		randomizeSolidBlocks(solidBlocks.length + 1);
		randomizePellet();
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

function appendBlock() {
	var lastBlock = snakeBlocks[snakeBlocks.length - 1];

	snakeBlocks.push({
		x: lastBlock.x - lastBlock.dx * SNAKE_BLOCK_SIZE,
		y: lastBlock.y - lastBlock.dy * SNAKE_BLOCK_SIZE,
		dx: lastBlock.dx,
		dy: lastBlock.dy
	});
}

function randomBoardPos(max) {
	return Math.floor((max / SNAKE_BLOCK_SIZE) * Math.random()) * SNAKE_BLOCK_SIZE
}

function randomizeSolidBlocks(numBlocks) {
	if(numBlocks > 10) numBlocks = 10;
	solidBlocks = [];
	for(var i = 0; i < numBlocks; i++) {
		solidBlocks.push({x: randomBoardPos(canvas.width), y: randomBoardPos(canvas.height)});
	}
}

function randomizePellet() {
	pellet = {x: randomBoardPos(canvas.width), y: randomBoardPos(canvas.height)};
}

function clear(){
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
