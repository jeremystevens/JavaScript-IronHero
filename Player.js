// Player.js
class Player {
    constructor(app, resources) {
        this.app = app;
        this.resources = resources;

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

    shoot() {
        if (!this.canShoot) return;

        const bullet = new PIXI.Sprite(this.resources.bulletSprite.texture);
        bullet.anchor.set(0.5);
        bullet.x = this.sprite.x + this.sprite.width / 2;
        bullet.y = this.sprite.y;
        bullet.scale.set(0.1);
        this.app.stage.addChild(bullet);

        new Audio(this.resources.playerBulletSound.url).play().catch(e => console.error("Bullet sound error", e));

        this.app.ticker.add(() => {
            bullet.x += 10; // Adjust bullet speed
            if (bullet.x > this.app.screen.width) this.app.stage.removeChild(bullet);
        });

        this.canShoot = false;
        setTimeout(() => this.canShoot = true, this.bulletCooldown);
    }
}
