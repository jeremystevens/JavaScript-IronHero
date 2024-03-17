// Game.js
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
        this.player = new Player(this.app, resources);
        this.uiManager = new UIManager(this.app);

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
            this.app.stage.removeChild(titleScreen);
            this.app.stage.removeChild(startButton);
            this.startLevel1();
        });

        this.app.stage.addChild(startButton);
    }

    startLevel1() {
        const spaceBg = new PIXI.TilingSprite(this.app.loader.resources.spaceBackground.texture, this.app.screen.width, this.app.screen.height);
        this.app.stage.addChild(spaceBg);
        this.app.stage.addChild(this.player.sprite);
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
            if (keys["ArrowUp"]) this.player.move('up');
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
