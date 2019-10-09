function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

if (!isMobile()) {
  var canvas = document.getElementById("gameboard");
  var ctx = canvas.getContext("2d");
  var x = canvas.width / 2;
  var y = canvas.height - 30;
  var dx = 5;
  var dy = -5;
  var ballRadius = 10;
  var score = 0;
  var paddleHeight = 10;
  var paddleWidth = 150;
  var paddleX = (canvas.width - paddleWidth) / 2;
  var paddleY = canvas.height - paddleHeight - 13;
  var brickNumbers = brickColumnCount * brickRowCount;
  var rightPressed = false;
  var leftPressed = false;
  var brickRowCount = 5;
  var brickColumnCount = 6;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 30;
  var lives = 3;
  var reset = document.getElementById("reset");

  var bricks = [];
  for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  reset.addEventListener("click", function() {
    document.location.reload(false);
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    collisionDetect();

    //Paddle collision and game over logic
    if (y + dy < ballRadius) {
      dy = -dy;

      //adding delta variables
    } else if (y + dy >= paddleY + paddleHeight) {
      if (x >= paddleX && x <= paddleX + paddleWidth) {
        // Delta-X controls
        var deltaX = x - (paddleWidth + paddleX / 2);
        dx = deltaX * 0.1;
        // change made dx =-dx for stablity of angles, unsure if working
        dy = -dy;
        dx = -dx;
      } else {
        lives--;
        if (!lives) {
          alert("Game Over!");
          document.location.reload(true);
        } else {
          restart();
        }
      }
    }

    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx;
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }
    //Ball Movement
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
  }

  draw();

  function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "RGB(16, 169, 77)";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function restart() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 5;
    dy = -5;
    paddleX = (canvas.width - paddleWidth) / 2;
  }

  function restartFull() {
    drawBricks();
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 5;
    dy = -5;
    paddleX = (canvas.width - paddleWidth) / 2;
  }

  function drawScore() {
    ctx.font = "16px Orbitron";
    ctx.fillStyle = "#fff";
    ctx.fillText("Score: " + score, 30, 20);
  }

  function keyDownHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = true;
    } else if (e.keyCode == 37) {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = false;
    } else if (e.keyCode == 37) {
      leftPressed = false;
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(
      paddleX,
      canvas.height - 5 - paddleHeight,
      paddleWidth,
      paddleHeight
    );
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
  }

  function collisionDetect() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
        if (b.status == 1) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = 0;
            score++;

            if (score == brickRowCount * brickColumnCount) {
              alert("Congratulations! You Win!");
              document.location.reload(true);
            }
          }
        }
      }
    }
  }

  function drawLives() {
    ctx.font = "16px orbitron";
    ctx.fillStyle = "#fff";
    ctx.fillText("Lives: " + lives, canvas.width - 101, 20);
  }

  //Mouse controls
  document.addEventListener("mousemove", mouseMoveHandler);

  function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (
      relativeX > 0 + paddleWidth / 2 &&
      relativeX < canvas.width - paddleWidth / 2
    ) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }
}
