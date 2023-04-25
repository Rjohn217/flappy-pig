const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const flyingPig = new Image();
flyingPig.src = 'flyingpig.png';

const barColor = '#00AA00'; // Green bar color

// Ensure images are loaded before starting the game loop
flyingPig.onload = () => {
    loop();
};

// Game variables
const gravity = 0.0075;
const pigFlapPower = 1.1;
const barGap = 250;
const barSpawnInterval = 2500;
let score = 0;

let pig = {
    x: 50,
    y: canvas.height / 2,
    velocity: 0
};

let bars = [];

function createBar() {
    const minY = 50; // Minimum distance from the top of the canvas for the gap
    const maxY = canvas.height - barGap - minY; // Maximum distance from the top of the canvas for the gap
    const gapY = Math.random() * (maxY - minY) + minY;

    const topBar = { x: canvas.width, y: 0, height: gapY, top: true };
    const bottomBar = { x: canvas.width, y: gapY + barGap, height: canvas.height - (gapY + barGap), top: false };

    bars.push(topBar);
    bars.push(bottomBar);
}



const barWidth = 52; // Adjust the width as needed
const barHeight = 320; // Adjust the height as needed

function drawBar(b) {
    const barWidth = 52; // Adjust the width as needed

    ctx.fillStyle = barColor;
    ctx.fillRect(b.x, b.y, barWidth, b.height);
}


function moveBars() {
    for (let i = 0; i < bars.length; i++) {
        bars[i].x -= 1;
        if (bars[i].x + barWidth < 0) {
            bars.splice(i, 1);
            i--;
        } else if (bars[i].x + barWidth < pig.x && !bars[i].passed) {
            score += 0.5;
            bars[i].passed = true;
        }
    }
}


function collisionDetection() {
    const pigRect = { x: pig.x, y: pig.y, width: 75, height: 75 }; // Use the same dimensions as in the draw function

    // Check if the pig touches the grass
    const grassHeight = 25;
    if (pigRect.y + pigRect.height > canvas.height - grassHeight) {
        return true;
    }

    for (let b of bars) {
        let barRect = { x: b.x, y: b.y, width: 52, height: b.height }; // Use the same dimensions as in the drawBar function

        if (pigRect.x < barRect.x + barRect.width &&
            pigRect.x + pigRect.width > barRect.x &&
            pigRect.y < barRect.y + barRect.height &&
            pigRect.height + pigRect.y > barRect.y) {
            return true;
        }
    }
    return false;
}


function update() {
    // Update pig position
    pig.y += pig.velocity;
    pig.velocity += gravity;

    // Move bars
    moveBars();

    // Collision detection
    if (collisionDetection()) {
        // Reset game
        pig.y = canvas.height / 2;
        pig.velocity = 0;
        bars = [];
    }
}

const oinkSound = new Audio('oinkeffect.mp3');
const flapSound = new Audio('flap.mp3')

canvas.addEventListener('click', () => {
    oinkSound.currentTime = 0;
    oinkSound.play();
    flapSound.play();
    flapSound.playbackRate = 1.5;
    oinkSound.playbackRate = 2;
    pig.velocity = -pigFlapPower;
});





function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grass
    ctx.fillStyle = '#008000';
    ctx.fillRect(0, canvas.height - 25, canvas.width, 25);

    // Draw bars
    for (let b of bars) {
        drawBar(b);
    }

    // Draw pig
    const pigWidth = 100;
    const pigHeight = 100;
    ctx.drawImage(flyingPig, pig.x, pig.y, pigWidth, pigHeight);

    // Draw score
    ctx.fillStyle = 'pink';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

    
    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }
    
    canvas.addEventListener('click', () => {
        pig.velocity = -pigFlapPower;
    });
    
    setInterval(createBar, barSpawnInterval);
    loop();
    
