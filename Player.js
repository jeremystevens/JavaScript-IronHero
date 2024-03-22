// Player.js
class Player {
    constructor(app, resources) {
        this.app = app;
        this.resources = resources;
        this.bullets = []; // Array to store active bullets
        // Initialize player sprite
        this.sprite = new PIXI.Sprite(this.resources.playerSprite.texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.app.screen.width / 2;
        this.sprite.y = this.app.screen.height / 2;
        this.sprite.scale.set(0.05);
        this.app.stage.addChild(this.sprite);
        this.speed = 5;
        this.canShoot = true;
        this.bulletCooldown = 500;
    }

    move(direction) {
        switch (direction) {
            case 'left': this.sprite.x -= this.speed; break;
            case 'right': this.sprite.x += this.speed; break;
            case 'up': this.sprite.y -= this.speed; break;
            case 'down': this.sprite.y += this.speed; break;
        }

        // Keep the player within the bounds
        this.sprite.x = Math.max(this.sprite.width / 2, Math.min(this.app.screen.width - this.sprite.width / 2, this.sprite.x));
        this.sprite.y = Math.max(this.sprite.height / 2, Math.min(this.app.screen.height - this.sprite.height / 2, this.sprite.y));
    }
    takeHit() {
        this.lives -= 1;
        if (this.uiManager) { // Assuming you have a reference to UIManager in your Player class
            this.uiManager.updateLives(this.lives);
        }
        if (this.lives <= 0) {
            // Optional: Additional logic for when the player's lives reach 0, such as stopping the game
            this.app.stop();
            // write game over to console for now will add other logic later
            console.log("Game Over");
        }
    }

    shoot() {
        if (!this.canShoot) return;
        const bullet = new PIXI.Sprite(this.resources.bulletSprite.texture);
        bullet.anchor.set(0.5);
        bullet.x = this.sprite.x + this.sprite.width / 2;
        bullet.y = this.sprite.y;
        bullet.scale.set(0.1);
        this.app.stage.addChild(bullet);
        this.bullets.push(bullet);
        //console.log(this.bullets);

        new Audio(this.resources.playerBulletSound.url).play().catch(e => console.error("Bullet sound error", e));

        this.app.ticker.add(() => {
            bullet.x += 10; // Adjust bullet speed
            if (bullet.x > this.app.screen.width) this.app.stage.removeChild(bullet);
        });

        this.canShoot = false;
        setTimeout(() => this.canShoot = true, this.bulletCooldown);
    }
    removeBullet(index) {
        // Method to remove a bullet
        if (index >= 0 && index < this.bullets.length) {
            this.app.stage.removeChild(this.bullets[index]); // Remove from stage
            this.bullets.splice(index, 1); // Remove from bullets array
        }
    }
}
