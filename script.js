const court = document.getElementById("court");
const ctx = court.getContext("2d");

const COURT_WIDTH = 800;
const COURT_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PADDLE_SPEED = 5;
const BALL_SPEED_X = 5;
const BALL_SPEED_Y = 2;


let player = {
    x: 50,
    y: COURT_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    dy: 0,
};

let computer = {
    x: COURT_WIDTH - PADDLE_WIDTH - 5,
    y: COURT_HEIGHT / 2 - PADDLE_HEIGHT / 2,
};

let ball = {
    x: COURT_WIDTH / 2,
    y: COURT_HEIGHT / 2,
    dx: BALL_SPEED_X,
    dy: BALL_SPEED_Y,
};

function drawPaddle(x, y) {
    ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function drawBall(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, COURT_WIDTH, COURT_HEIGHT);

    drawPaddle(player.x, player.y);
    drawPaddle(computer.x, computer.y);
    drawBall(ball.x, ball.y);

    player.y += player.dy;

    // AI for computer paddle
    let computerPaddleCenter = computer.y + PADDLE_HEIGHT / 2;
    if (computerPaddleCenter < ball.y - PADDLE_HEIGHT / 4) {
        computer.y += PADDLE_SPEED;
    } else if (computerPaddleCenter > ball.y + PADDLE_HEIGHT / 4) {
        computer.y -= PADDLE_SPEED;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y - BALL_RADIUS <= 0 || ball.y + BALL_RADIUS >= COURT_HEIGHT) {
        ball.dy *= -1;
    }

    // Ball collision with paddles
    if (
        (ball.x - BALL_RADIUS <= player.x + PADDLE_WIDTH &&
            ball.y >= player.y &&
            ball.y <= player.y + PADDLE_HEIGHT) ||
        (ball.x + BALL_RADIUS >= computer.x &&
            ball.y >= computer.y &&
            ball.y <= computer.y + PADDLE_HEIGHT)
    ) {
        ball.dx *= -1;
    }

    // Ball out of bounds (scoring)
    if (ball.x - BALL_RADIUS <= 0) {
        alert("Computer wins!");
        resetBall();
    } else if (ball.x + BALL_RADIUS >= COURT_WIDTH) {
        alert("Player wins!");
        resetBall();
    }

    requestAnimationFrame(draw);
}



function resetBall() {
    ball.x = COURT_WIDTH / 2;
    ball.y = COURT_HEIGHT / 2;
    ball.dx = BALL_SPEED_X;
    ball.dy = BALL_SPEED_Y;
}

court.addEventListener("mousemove", (e) => {
    let rect = court.getBoundingClientRect();
    player.y = e.clientY - rect.top - PADDLE_HEIGHT / 2;

    // Keep the paddle within the bounds of the court
    if (player.y < 0) {
        player.y = 0;
    } else if (player.y > COURT_HEIGHT - PADDLE_HEIGHT) {
        player.y = COURT_HEIGHT - PADDLE_HEIGHT;
    }
});

draw();
