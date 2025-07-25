const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

// Game Parameters
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const BALL_SPEED = 5;
const PLAYER_X = 24;
const AI_X = canvas.width - 24 - PADDLE_WIDTH;

// Paddle Properties
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;

// Ball Properties
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = BALL_SPEED * (Math.random() * 0.6 + 0.7) * (Math.random() < 0.5 ? 1 : -1);

// Score
let playerScore = 0;
let aiScore = 0;

// Mouse Control
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within canvas
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collisions with top/bottom
    if (ballY < 0) {
        ballY = 0;
        ballSpeedY *= -1;
    }
    if (ballY + BALL_SIZE > canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballSpeedY *= -1;
    }

    // Ball collision with player paddle
    if (
        ballX < PLAYER_X + PADDLE_WIDTH &&
        ballX + BALL_SIZE > PLAYER_X &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH; // Prevent sticking
        ballSpeedX *= -1;

        // Add some angle based on hit position
        let hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = hitPos * 0.18;
    }

    // Ball collision with AI paddle
    if (
        ballX + BALL_SIZE > AI_X &&
        ballX < AI_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_SIZE; // Prevent sticking
        ballSpeedX *= -1;

        // Add some angle based on hit position
        let hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = hitPos * 0.18;
    }

    // Score check
    if (ballX < 0) {
        aiScore++;
        resetBall(-1);
    }
    if (ballX > canvas.width - BALL_SIZE) {
        playerScore++;
        resetBall(1);
    }

    // AI paddle movement (basic tracking)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    let ballCenter = ballY + BALL_SIZE / 2;
    if (aiCenter < ballCenter - 12) aiY += 5;
    else if (aiCenter > ballCenter + 12) aiY -= 5;
    // Clamp AI paddle
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

function resetBall(direction) {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = BALL_SPEED * direction;
    ballSpeedY = BALL_SPEED * (Math.random() * 0.6 + 0.7) * (Math.random() < 0.5 ? 1 : -1);
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Draw scores
    ctx.font = '48px Arial';
    ctx.fillText(playerScore, canvas.width / 2 - 80, 60);
    ctx.fillText(aiScore, canvas.width / 2 + 50, 60);
}

// Start
gameLoop();
