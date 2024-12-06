document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 1080;
    canvas.height = 530;
    canvas.style.backgroundColor = "black";

    // Images
    const playerImage = new Image();
    const asteroidImage = new Image();
    playerImage.src = "images/asteroids/playerBlank.png";
    asteroidImage.src = "images/asteroids/robotBlank.png";

    // Game state
    let gameOver = false;
    let gameRunning = true;
    const player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 40,
        height: 40,
        rotation: 0,
        speed: 0,
        maxSpeed: 5,
        lives: 1 // Ajout de vies pour le joueur
    };

    const keys = {
        ArrowUp: false,
        ArrowLeft: false,
        ArrowRight: false,
        Space: false,
    };

    const asteroids = [];
    const bullets = [];
    let score = 0;
    let lastBulletTime = 0;
    const BULLET_COOLDOWN = 250; // Cooldown entre les tirs en millisecondes

    // Create asteroids
    function createAsteroids(count) {
        for (let i = 0; i < count; i++) {
            asteroids.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 50,
                height: 50,
                dx: Math.random() * 4 - 2,
                dy: Math.random() * 4 - 2,
            });
        }
    }

    // Collision detection
    function checkCollision(rect1, rect2) {
        return !(rect1.x > rect2.x + rect2.width ||
                 rect1.x + rect1.width < rect2.x ||
                 rect1.y > rect2.y + rect2.height ||
                 rect1.y + rect1.height < rect2.y);
    }

    // Input handling
    document.addEventListener("keydown", (e) => {
        if (gameOver) return; // Empêche les actions si le jeu est terminé

        if (e.code in keys) keys[e.code] = true;

        // Tir avec un cooldown
        if (e.code === "Space") {
            const currentTime = Date.now();
            if (currentTime - lastBulletTime > BULLET_COOLDOWN) {
                bullets.push({
                    x: player.x + Math.cos(player.rotation) * player.width,
                    y: player.y + Math.sin(player.rotation) * player.width,
                    dx: Math.cos(player.rotation) * 7,
                    dy: Math.sin(player.rotation) * 7,
                    radius: 5,
                    color: "white",
                });
                lastBulletTime = currentTime;
            }
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.code in keys) keys[e.code] = false;
    });


    const NEW_ASTEROID_THRESHOLD = 500;

    // Update game state
    function update() {
        if (gameOver) return;

        if (score > 0 && score % NEW_ASTEROID_THRESHOLD === 0) {
            if (!asteroids.some(ast => ast.addedAtScore === score)) {
                asteroids.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    width: 50,
                    height: 50,
                    dx: Math.random() * 4 - 2,
                    dy: Math.random() * 4 - 2,
                    addedAtScore: score, // Empêche la répétition d’ajout
                });
            }
        }

        if (keys.ArrowUp) {
            player.speed = Math.min(player.speed + 0.2, player.maxSpeed);
        } else {
            player.speed = Math.max(player.speed - 0.1, 0);
        }

        if (keys.ArrowLeft) player.rotation -= 0.05;
        if (keys.ArrowRight) player.rotation += 0.05;

        player.x += Math.cos(player.rotation) * player.speed;
        player.y += Math.sin(player.rotation) * player.speed;

        // Screen wrapping for player
        if (player.x < 0) player.x = canvas.width;
        if (player.x > canvas.width) player.x = 0;
        if (player.y < 0) player.y = canvas.height;
        if (player.y > canvas.height) player.y = 0;

        // Update asteroids
        for (let asteroid of asteroids) {
            asteroid.x += asteroid.dx;
            asteroid.y += asteroid.dy;

            // Screen wrapping for asteroids
            if (asteroid.x < 0) asteroid.x = canvas.width;
            if (asteroid.x > canvas.width) asteroid.x = 0;
            if (asteroid.y < 0) asteroid.y = canvas.height;
            if (asteroid.y > canvas.height) asteroid.y = 0;

            // Collision with player
            if (checkCollision(player, asteroid)) {
                player.lives--;
                if (player.lives <= 0) {
                    gameOver = true;
                    gameRunning = false
                }
                // Supprimer l'astéroïde après collision
                asteroids.splice(asteroids.indexOf(asteroid), 1);
            }
        }

        // Update bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;

            // Remove bullets that go off screen
            if (
                bullet.x < 0 ||
                bullet.x > canvas.width ||
                bullet.y < 0 ||
                bullet.y > canvas.height
            ) {
                bullets.splice(i, 1);
            }

            // Check for collisions with asteroids
            for (let j = asteroids.length - 1; j >= 0; j--) {
                const asteroid = asteroids[j];
                const dist = Math.hypot(bullet.x - asteroid.x, bullet.y - asteroid.y);
                if (dist < asteroid.width / 2) {
                    asteroids.splice(j, 1);
                    bullets.splice(i, 1);
                    score += 100;
                    break;
                }
            }
        }
    }

    // Draw game state
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (gameOver && !gameRunning) {
            // Écran de game over
            ctx.fillStyle = "white";
            ctx.font = "48px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
            ctx.font = "24px Arial";
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
            return;
        }

        // Draw player
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(player.rotation);
        ctx.drawImage(
            playerImage,
            -player.width / 2,
            -player.height / 2,
            player.width,
            player.height
        );
        ctx.restore();

        // Draw asteroids
        for (let asteroid of asteroids) {
            ctx.drawImage(
                asteroidImage,
                asteroid.x - asteroid.width / 2,
                asteroid.y - asteroid.height / 2,
                asteroid.width,
                asteroid.height
            );
        }

        // Draw bullets
        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            ctx.fillStyle = bullet.color || "white";
            ctx.fill();
            ctx.closePath();
        }

        // Draw score and lives
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}`, 10, 20);
        ctx.fillText(`Lives: ${player.lives}`, 10, 50);

        
    }

    // Game loop
    function gameLoop() {
        update();
        draw();

        if (gameOver && !gameRunning) {
            setTimeout(() => {
                window.location.href = `index.php?controller=captcha&methode=index`;
            }, 3000); 
            return;
        }

 
        if(!gameOver && !gameRunning){
            window.location.href = `index.php?controller=corps&methode=index`;
        }

        requestAnimationFrame(gameLoop);
    }

    // Start game
    createAsteroids(5);
    gameLoop();
});