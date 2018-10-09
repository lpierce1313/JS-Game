snakeBlocks = [];
changes = [];

SNAKE_BLOCK_SIZE = 20;

canvas = null;
ctx = null;
gameState = 0;
score = 0;
failed = 1;
x = 0;
y = 0;

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
			alert("x:" + x + " y:" + y);
			ctx.rect(475, 230, 250, 100);
			if(x > 475 && x < 475 + 250 && y > 230 && y < 230 + 100){
				gameState = 1;
			}
		}
	}
	else if(gameState == 1){
		clear();
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

		window.onmousedown = function(e){
			var x = event.x;
			var y = event.y;
			x -= canvas.offsetLeft;
			y -= canvas.offsetTop;
			y += Math.round(window.scrollY);
			alert("x:" + x + " y:" + y);
			ctx.rect(475, 230, 250, 100);
			if(x > 475 && x < 475 + 250 && y > 230 && y < 230 + 100){
				gameState = 1;
			}
		}
	}
}

function draw() {

	for(var i = 0; i < snakeBlocks.length; i++) {
		ctx.fillStyle = "#00ff00";
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

function clear(){
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
