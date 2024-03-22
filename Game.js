// Game.js
// Version 5 - Hit Detection and Scoring (Game5.js)
// This version adds hit detection between player bullets and enemies, and scoring when enemies are destroyed.
// It also includes a method to check for collisions between two rectangles.
class Game {
    constructor() {
        this.app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x000000 }); // Start with a black canvas
        document.body.appendChild(this.app.view);
        this.currentLevel = 1; // Initialize the level variable
        this.enemies = []; // Array to hold enemies
        this.maxEnemies = 3; // Maximum number of enemies on screen
        this.app.ticker.add(() => {
            this.updateGame();
        });
        this.loadAssets();
    }

    loadAssets() {
        this.app.loader
            .add('titleScreen', 'assets/images/title_screen.png')
            .add('titleMusic', 'assets/audio/title_screen.wav')
            .add('level1Music', 'assets/audio/level1.mp3') // level 1 music
            .add('spaceBackground', 'assets/images/space_background.png')
            .add('playerSprite', 'assets/images/player_sprite.png')
            .add('bulletSprite', 'assets/images/bullet_sprite.png')
            .add('playerBulletSound', 'assets/audio/player_bullet_sound.ogg')
            .add('level1_enemy', 'assets/images/level1_enemy.png')
            .add('enemyBulletSound', 'assets/audio/player_bullet_sound.ogg')
            .load(this.onAssetsLoaded.bind(this));
    }

    onAssetsLoaded(loader, resources) {
        this.resources = resources; // Store loaded resources for later use
        this.showClickToEnter(); // Show "Click to Enter" instead of directly setting up the title screen
        this.spawnEnemiesIfNeeded(); // Make sure this is called after resources are loaded
    }

    showClickToEnter() {
        const clickToEnterText = new PIXI.Text('Click to Enter', {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: '#ffffff'
        });
        clickToEnterText.x = (this.app.screen.width - clickToEnterText.width) / 2;
        clickToEnterText.y = (this.app.screen.height - clickToEnterText.height) / 2;
        clickToEnterText.interactive = true;
        clickToEnterText.buttonMode = true;

        clickToEnterText.on('pointerdown', () => {
            this.app.stage.removeChild(clickToEnterText); // Remove "Click to Enter" text
            this.initializeGame(); // Proceed with game initialization
        });

        this.app.stage.addChild(clickToEnterText);
    }

    initializeGame() {
        // Initialize and play music here (ensure it's compliant with browser policies)
        this.titleMusic = new Audio(this.resources.titleMusic.url); // Set this.titleMusic
        this.titleMusic.loop = true;
        this.titleMusic.play().catch(e => console.error("Music play error", e));
    
        // Initialize the player and UI manager
        this.player = new Player(this.app, this.resources);
        this.uiManager = new UIManager(this.app);
    
        // Setup the title screen and input handlers
        this.setupTitleScreen();
        this.setupInputHandlers();
    }    

    setupTitleScreen() {
        const titleScreen = new PIXI.Sprite(this.app.loader.resources.titleScreen.texture);
        this.app.stage.addChild(titleScreen);
    
        const startButton = new PIXI.Text('Start', { fontFamily: 'Arial', fontSize: 24, fill: '#ffffff' });
        startButton.x = this.app.screen.width / 2 - startButton.width / 2;
        startButton.y = this.app.screen.height * 0.75 - startButton.height / 2;
        startButton.interactive = true;
        startButton.buttonMode = true;
    
        startButton.on('pointerdown', () => {
            // Stop the title music right when "Start" is clicked
            if (this.titleMusic) {
                this.titleMusic.pause();
                this.titleMusic.currentTime = 0;
            }
    
            this.app.stage.removeChild(titleScreen);
            this.app.stage.removeChild(startButton);
            this.startLevel1();
        });
    
        this.app.stage.addChild(startButton);
    }
    
    updateGame() {
        // Check for collisions and update enemies
        this.checkCollisions();
        this.enemies.forEach((enemy, index) => {
            if (enemy.isDestroyed) {
                this.app.stage.removeChild(enemy.sprite);
                this.enemies.splice(index, 1);
            } else if (typeof enemy.update === 'function') {
                enemy.update();
            }
        });

        // After updating all enemies and handling destruction, spawn new enemies if needed
        this.spawnEnemiesIfNeeded();
    }
    
    spawnEnemy() {
        if (this.enemies.length < this.maxEnemies) {
            let enemy = new Enemy(this.app, this.resources, this.currentLevel, 40);
            this.enemies.push(enemy);
            this.app.stage.addChild(enemy.sprite);
        }
    }
    generateEnemies() {
        while (this.enemies.length < this.maxEnemies) {
            let enemy = new Enemy(this.app, this.resources, this.currentLevel, 40, this.player);
            this.enemies.push(enemy);
            this.app.stage.addChild(enemy.sprite);
            // Additional setup for movement, hit detection, etc.
        }
    }
    // check collision
    checkCollisions() {
        if (!this.player || !this.player.bullets) return;
        this.enemies.forEach((enemy, enemyIndex) => {
            if (enemy.isDestroyed) return; // Skip destroyed enemies

            this.player.bullets.forEach((bullet, bulletIndex) => {
                if (enemy.checkCollisionWithBullet(bullet)) {
                    // Collision detected, handle it
                    //console.log('Collision detected between enemy and bullet');
                    enemy.takeHit(); // Example method to damage the enemy
                    if (enemy.isDestroyed) {
                        // Remove enemy if it's destroyed
                        this.app.stage.removeChild(enemy.sprite);
                        this.enemies.splice(enemyIndex, 1);
                        // Increase score when enemy is destroyed
                        this.uiManager.updateScore(this.uiManager.score + 100);
                    }
                    // Remove the bullet
                    this.app.stage.removeChild(bullet);
                    this.player.bullets.splice(bulletIndex, 1);
                }
            });
        });
    }
    

     spawnEnemiesIfNeeded() {
        while (this.enemies.length < this.maxEnemies) {
            // Generate a new enemy and set its initial position off-screen to the right
            let enemy = new Enemy(this.app, this.resources, this.currentLevel, 40, this.player);
            enemy.sprite.x = this.app.screen.width + enemy.sprite.width; // Start off-screen to the right
            enemy.sprite.y = Math.random() * (this.app.screen.height - enemy.uiAreaHeight - enemy.sprite.height) + enemy.uiAreaHeight;
    
            this.enemies.push(enemy);
            this.app.stage.addChild(enemy.sprite);
        }
    }
    
    // check collision
    hitTestRectangle(r1, r2) {
        return r1.x < r2.x + r2.width &&
               r1.x + r1.width > r2.x &&
               r1.y < r2.y + r2.height &&
               r1.height + r1.y > r2.y;
    }

    startLevel1() {
        // Stop the title music
        if (this.titleMusic) {
            this.titleMusic.pause();
            this.titleMusic.currentTime = 0;
        }
    
        // Clear the stage for the countdown
        this.app.stage.removeChildren();
    
        let countdownValue = 5; // Starting value for the countdown
        const countdownText = new PIXI.Text(countdownValue.toString(), {
            fontFamily: 'Arial',
            fontSize: 60,
            fill: '#ffffff'
        });
    
        countdownText.x = (this.app.screen.width - countdownText.width) / 2;
        countdownText.y = (this.app.screen.height - countdownText.height) / 2;
        this.app.stage.addChild(countdownText);
    
        // Play the initial countdown sound
        let countdownAudio = new Audio(`assets/audio/${countdownValue}.mp3`);
        countdownAudio.play().catch(e => console.error("Countdown audio error:", e));
    
        const countdownInterval = setInterval(() => {
            countdownValue -= 1;
    
            if (countdownValue >= 1) {
                countdownText.text = countdownValue.toString();
    
                // Play countdown sound for the next number
                countdownAudio.src = `assets/audio/${countdownValue}.mp3`;
                countdownAudio.play().catch(e => console.error("Countdown audio error:", e));
            }
    
            if (countdownValue < 1) {
                clearInterval(countdownInterval);
                this.app.stage.removeChild(countdownText); // Remove countdown text
    
                // Silence the last countdown audio
                countdownAudio.pause();
                countdownAudio.currentTime = 0;
    
                // Display "Level: X" text
                const levelText = new PIXI.Text(`Level: ${this.currentLevel}`, {
                    fontFamily: 'Arial',
                    fontSize: 48,
                    fill: '#ffffff'
                });
    
                levelText.x = (this.app.screen.width - levelText.width) / 2;
                levelText.y = (this.app.screen.height - levelText.height) / 2;
                this.app.stage.addChild(levelText);
    
                // Remove "Level: X" text after a few seconds and then start the actual Level 1
                setTimeout(() => {
                    this.app.stage.removeChild(levelText);
    
                    // Initialize the Top UI for lives and score
                    this.uiManager.initUI();
    
                    // Start the actual Level 1 content here
                    const spaceBg = new PIXI.TilingSprite(this.app.loader.resources.spaceBackground.texture, this.app.screen.width, this.app.screen.height - this.uiManager.uiAreaHeight);
                    spaceBg.y = this.uiManager.uiAreaHeight; // Start the background just below the UI area
                    this.app.stage.addChild(spaceBg);
    
                    // Ensure the background scrolls from right to left
                    this.app.ticker.add(() => {
                        spaceBg.tilePosition.x -= 2; // Adjust the scroll speed as needed
                    });
    
                    // Position the player for Level 1
                    this.player.sprite.x = this.app.screen.width / 2;
                    this.player.sprite.y = this.app.screen.height - this.player.sprite.height / 2 - 20; // Positioned above the bottom edge
                    this.app.stage.addChild(this.player.sprite);
                    // add inital enemies 
                    this.enemies.forEach((enemy, index) => {
                        if (enemy.isDestroyed) {
                            this.app.stage.removeChild(enemy.sprite); // Remove enemy sprite from stage
                            this.enemies.splice(index, 1); // Remove enemy from array
                            this.generateEnemies(); // Generate new enemy to maintain max count
                        }
                    });
                    
                    // Start level 1 music
                    this.level1Music = new Audio('assets/audio/level1.mp3');
                    this.level1Music.loop = true;
                    this.level1Music.play().catch(e => console.error("Level 1 music error:", e));
                    this.generateEnemies(); // Call this after the level setup is complete
                }, 2000); // Display "Level: X" text for 2 seconds
            }
        }, 1000); // Update the countdown every second
    }

    setupInputHandlers() {
        const keys = {};

        window.addEventListener("keydown", (e) => {
            keys[e.code] = true;
        });

        window.addEventListener("keyup", (e) => {
            keys[e.code] = false;
        });

        this.app.ticker.add(() => {
            if (keys["ArrowLeft"]) this.player.move('left');
            if (keys["ArrowRight"]) this.player.move('right');
            if (keys["ArrowUp"]) {
                // Check if moving up would put the player into the UI area
                const newYPosition = this.player.sprite.y - this.player.speed;
                if (newYPosition > this.uiManager.uiAreaHeight) { // Ensure uiManager and uiAreaHeight are accessible here
                    this.player.move('up');
                }
            }
            if (keys["ArrowDown"]) this.player.move('down');
            if (keys["Space"] && !this.player.shooting) {
                this.player.shoot();
                this.player.shooting = true;
            }
            if (!keys["Space"]) this.player.shooting = false; // Reset shooting flag when spacebar is released
        });
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const game = new Game();
});
