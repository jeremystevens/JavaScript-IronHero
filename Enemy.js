class Enemy {
    constructor(app, resources, level, uiAreaHeight, player) {
        this.app = app;
        this.resources = resources;
        this.level = level;
        this.uiAreaHeight = uiAreaHeight; // Height of the UI area to avoid
        this.hp = 1; // Example for level 1 enemy
        this.sprite = new PIXI.Sprite(resources[`level${level}_enemy`].texture);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.55); // Adjusted scale
        this.movementSpeed = 1; // Same as player for simplicity
        this.bulletSpeed = 5; // Same as player for simplicity
        this.bullets = []; // Initialize the bullets array
        this.shootingInterval = 7000; // One bullet per second
        this.lastShot = 0;
        this.player = player; // Store the player reference
        this.isDestroyed = false; // Flag to track destruction
        // enemy hitbox
        this.hitbox = new PIXI.Rectangle(
            this.sprite.x - this.sprite.width / 2,
            this.sprite.y - this.sprite.height / 2,
            this.sprite.width,
            this.sprite.height
        );
        this.initialize();
    }

    checkCollisionWithBullet(bullet) {
        // Get the bounding boxes of the enemy and the bullet
        const enemyBounds = this.sprite.getBounds();
        const bulletBounds = bullet.getBounds();

        // Check for AABB collision
        if (enemyBounds.x < bulletBounds.x + bulletBounds.width &&
            enemyBounds.x + enemyBounds.width > bulletBounds.x &&
            enemyBounds.y < bulletBounds.y + bulletBounds.height &&
            enemyBounds.y + enemyBounds.height > bulletBounds.y) {
            // Collision detected
            return true;
        }
        return false;
    }

    initialize() {
        this.resetPosition();
        this.moveTowardsPlayer();
        this.shoot();
    }

    update() {
         // Make sure player and player.sprite are defined
         if (!this.isDestroyed) {
            // Update hitbox position to follow the sprite
            //
            this.hitbox.x = this.sprite.x - this.sprite.width / 2;
            this.hitbox.y = this.sprite.y - this.sprite.height / 2;
            // write to console
            //console.log(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
        }
         if (!this.player || !this.player.sprite) return;
        const playerPosition = { x: this.player.sprite.x, y: this.player.sprite.y }; // Assuming you pass the player object to the enemy
        const dx = playerPosition.x - this.sprite.x;
        const dy = playerPosition.y - this.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance > 0) {
            const dirX = dx / distance;
            const dirY = dy / distance;
    
            this.sprite.x += dirX * this.movementSpeed;
            this.sprite.y += dirY * this.movementSpeed;
        }
    
        // Keep the enemy within the playable area and not in the UI area
        this.sprite.y = Math.max(this.uiAreaHeight + this.sprite.height / 2, this.sprite.y);
        // Check if it's time to shoot a bullet
    const currentTime = Date.now();
    if (currentTime - this.lastShot > this.shootingInterval) {
        this.shoot();
        this.lastShot = currentTime;
    }
    }

    resetPosition() {
        // Reset position slightly off the right side of the screen
        this.sprite.x = this.app.screen.width + this.sprite.width;
        this.sprite.y = Math.random() * (this.app.screen.height - this.uiAreaHeight - this.sprite.height) + this.uiAreaHeight;
        this.app.stage.addChild(this.sprite);
    }

    moveTowardsPlayer() {
        const movement = () => {
            if (!this.player || this.isDestroyed) {
                this.app.ticker.remove(movement);
                return;
            }
    
            const playerPosition = { x: this.player.sprite.x, y: this.player.sprite.y };
            const dx = playerPosition.x - this.sprite.x;
            const dy = playerPosition.y - this.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance > 0) { // Ensure distance is not zero to avoid division by zero
                const dirX = (dx / distance) * 0.9;
                const dirY = (dy / distance) * 0.9;
    
                this.sprite.x += dirX * this.movementSpeed;
                this.sprite.y += dirY * this.movementSpeed;
            }
    
            this.sprite.y = Math.max(this.sprite.y, this.uiAreaHeight + this.sprite.height / 2);
    
            // Debugging: Log current position
           // console.log(`Enemy position: x=${this.sprite.x}, y=${this.sprite.y}`);
    
            // Adjust position if off-screen (for debugging, respawn in view)
            if (this.sprite.x < 0 || this.sprite.x > this.app.screen.width) {
                this.sprite.x = this.app.screen.width - 50; // Start just off the right side
            }
        };
    
        this.app.ticker.add(movement);
    }
    
    
    fadeOut() {
        // fade-out logic
        const fadeOutInterval = setInterval(() => {
            this.sprite.alpha -= 0.1;
            if (this.sprite.alpha <= 0) {
                clearInterval(fadeOutInterval);
                this.app.stage.removeChild(this.sprite);
            }
        }, 50);
    }
    // Method to handle being hit by a bullet
    takeHit() {
        this.hp -= 1;
        if (this.hp <= 0) {
            this.destroy();
        }
    }

    destroy() {
        // Handle destruction, fade out, etc.
        this.isDestroyed = true;
    }
   
    removeBullet(bulletIndex) {
        let bullet = this.bullets[bulletIndex];
        if (bullet) {
            this.app.stage.removeChild(bullet.sprite);
            this.bullets.splice(bulletIndex, 1);
        }
    }
    shoot() {
        // Check if the enemy is on the screen (considering its width)
        if (this.sprite.x > 0 && this.sprite.x < this.app.screen.width) {
            const bullet = new PIXI.Sprite(this.resources.bulletSprite.texture);
            bullet.anchor.set(0.5);
            bullet.x = this.sprite.x;
            bullet.y = this.sprite.y;
            bullet.scale.set(0.1);
            this.app.stage.addChild(bullet);
            this.bullets.push(bullet);
    
            // Adjust bullet movement to the left
            this.app.ticker.add(() => {
                bullet.x -= this.bulletSpeed;
                if (bullet.x < 0) {
                    this.app.stage.removeChild(bullet); // Remove bullet when off-screen
                }
            });
    
            // Play bullet sound
            new Audio('assets/audio/player_bullet_sound.ogg').play().catch(e => console.error("Bullet sound error", e));
    
            // Update the last shot time
            this.lastShot = Date.now();
        }
    }
}     
