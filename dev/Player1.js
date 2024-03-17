// Player.js
class Player {
    constructor(app, resources) {
        this.app = app; // Reference to the PIXI application
        this.resources = resources; // Loaded resources
        this.sprite = null; // The player's sprite
        this.lives = config.game.initialLives; // Player lives from the config
        this.speed = 5; // Player speed, adjustable as needed
        this.initializeSprite();
    }

    initializeSprite() {
        this.sprite = new PIXI.Sprite(this.resources.playerSprite.texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.app.screen.width / 2;
        this.sprite.y = this.app.screen.height / 2;
        this.sprite.scale.set(0.05); // Adjust the scale as needed
        this.app.stage.addChild(this.sprite);
    }

    move() {
        const keys = {}; // Object to keep track of pressed keys

        // Event listeners for key down and key up events
        window.addEventListener("keydown", (e) => keys[e.code] = true);
        window.addEventListener("keyup", (e) => keys[e.code] = false);

        // Add a ticker to handle continuous movement based on pressed keys
        this.app.ticker.add(() => {
            if (keys["ArrowLeft"]) this.sprite.x -= this.speed;
            if (keys["ArrowRight"]) this.sprite.x += this.speed;
            if (keys["ArrowUp"]) this.sprite.y -= this.speed;
            if (keys["ArrowDown"]) this.sprite.y += this.speed;

            // Ensure the player stays within the bounds of the game area, adjusted for the UI area
            this.sprite.x = Math.max(this.sprite.width / 2, Math.min(this.app.screen.width - this.sprite.width / 2, this.sprite.x));
            this.sprite.y = Math.max(config.ui.uiAreaHeight + this.sprite.height / 2, Math.min(this.app.screen.height - this.sprite.height / 2, this.sprite.y));
        });
    }
}
