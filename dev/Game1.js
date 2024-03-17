class Game {
    constructor() {
        this.app = new PIXI.Application({ width: 800, height: 600 });
        document.body.appendChild(this.app.view);

        this.loadAssets();
    }

    loadAssets() {
        this.app.loader
            .add('titleScreen', 'assets/images/title_screen.png')
            .add('titleMusic', 'assets/audio/title_screen.wav')
            .add('spaceBackground', 'assets/images/space_background.png')
            .add('playerSprite', 'assets/images/player_sprite.png')
            .add('bulletSprite', 'assets/images/bullet_sprite.png')
            .add('playerBulletSound', 'assets/audio/player_bullet_sound.ogg')
            .load(this.onAssetsLoaded.bind(this));
    }

    onAssetsLoaded(loader, resources) {
        this.resources = resources;
        this.setupTitleScreen();
    }

    setupTitleScreen() {
        const titleScreen = new PIXI.Sprite(this.resources.titleScreen.texture);
        this.app.stage.addChild(titleScreen);

        const startButton = new PIXI.Text('Start', new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#ffffff',
            stroke: '#4a1850',
            strokeThickness: 5,
        }));
        startButton.x = this.app.screen.width / 2 - startButton.width / 2;
        startButton.y = this.app.screen.height * 0.75 - startButton.height / 2;
        startButton.interactive = true;
        startButton.buttonMode = true;
        startButton.on('pointerdown', () => this.startLevel1());
        this.app.stage.addChild(startButton);
    }

    startLevel1() {
        this.app.stage.removeChildren();

        this.player = new Player(this.app, this.resources);
        this.uiManager = new UIManager(this.app);

        // Background music for Level 1
        this.music = new Audio(this.resources.titleMusic.url);
        this.music.loop = true;
        this.music.play().catch(e => console.error("Music play error", e));

        // Set up space background
        this.spaceBg = new PIXI.TilingSprite(this.resources.spaceBackground.texture, this.app.screen.width, this.app.screen.height);
        this.app.stage.addChild(this.spaceBg);

        // Set up UI
        this.uiManager.updateScore(0);  // Reset score
        this.uiManager.updateLives(this.player.lives);  // Update lives display

        // Handle player input
        this.setupInputHandlers();
    }

    setupInputHandlers() {
        const keys = {};
        window.addEventListener("keydown", (e) => keys[e.code] = true);
        window.addEventListener("keyup", (e) => keys[e.code] = false);

        this.app.ticker.add(() => {
            if (keys["ArrowLeft"]) this.player.move("left");
            if (keys["ArrowRight"]) this.player.move("right");
            if (keys["ArrowUp"]) this.player.move("up");
            if (keys["ArrowDown"]) this.player.move("down");
            // Implement shooting logic in Player class and call here if "Space" is pressed
            // if (keys["Space"]) this.player.shoot();
        });
    }

    // Additional game methods...
}

const game = new Game();
