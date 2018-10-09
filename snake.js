snakeBlocks = [];
changes = [];

SNAKE_BLOCK_SIZE = 20;

canvas = null;
ctx = null;

window.onload = function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	snakeBlocks.push({x: 200, y: 200, dx: 1, dy: 0});

	window.onkeydown = function(e) {
		switch(e.keyCode) {
			case 32: // SPACE
				appendBlock();
				break;
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

	setInterval(gameLoop, 150);
}

function gameLoop() {
	draw();

	for(var i = 0; i < snakeBlocks.length; i++) {
		for(var j = 0; j < changes.length; j++) {
			if(snakeBlocks[i].x === changes[j].x && snakeBlocks[i].y === changes[j].y) {
				snakeBlocks[i].dx = changes[j].dx;
				snakeBlocks[i].dy = changes[j].dy;
				if(i === snakeBlocks.length - 1) changes.shift();
			}
		}
		snakeBlocks[i].x += snakeBlocks[i].dx * SNAKE_BLOCK_SIZE;
		snakeBlocks[i].y += snakeBlocks[i].dy * SNAKE_BLOCK_SIZE;
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < snakeBlocks.length; i++) {
		ctx.fillRect(snakeBlocks[i].x, snakeBlocks[i].y, 0.9* SNAKE_BLOCK_SIZE, 0.9* SNAKE_BLOCK_SIZE);
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