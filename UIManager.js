// UIManager.js 
// Version 2 - Updated to keep the score on the screen by adjusting the x position of the scoreText

class UIManager {
    constructor(app) {
        this.app = app;
        this.score = 0; // Initialize score
        this.lives = 3; // Initialize lives
        this.uiAreaHeight = 40; // Define the height of the UI area here

        this.initUI();
    }

    initUI() {
        this.createScoreText();
        this.createLivesDisplay();
    }

    createScoreText() {
        // Remove previous score text if it exists
        const existingScoreText = this.app.stage.getChildByName("scoreText");
        if (existingScoreText) {
            this.app.stage.removeChild(existingScoreText);
        }

        // Create new score text
        this.scoreText = new PIXI.Text('Score: ' + this.score, {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: '#ffffff',
            align: 'right'
        });

        this.scoreText.x = this.app.screen.width - this.scoreText.width - 10;
        this.scoreText.y = this.uiAreaHeight / 2 - this.scoreText.height / 2;
        this.scoreText.name = "scoreText";

        this.app.stage.addChild(this.scoreText);
    }

    createLivesDisplay() {
        // Remove existing lives display if it exists
        this.app.stage.children.forEach(child => {
            if (child.isLifeIcon || child.isLifeText) {
                this.app.stage.removeChild(child);
            }
        });

        // Display "Lives:" text
        const livesText = new PIXI.Text('Lives:    ', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: '#ffffff',
            align: 'left'
        });

        livesText.x = 10;
        livesText.y = this.uiAreaHeight / 2 - livesText.height / 2;
        livesText.isLifeText = true;
        this.app.stage.addChild(livesText);

        // Initial offset for the first life icon from the "Lives:" text
        const initialOffset = 10; // Adjust this value to create more space

        // Display lives icons
        for (let i = 0; i < this.lives; i++) {
            const lifeIcon = new PIXI.Sprite(this.app.loader.resources.playerSprite.texture);
            lifeIcon.anchor.set(0.5);
            // Use the initialOffset for the first icon, then space out subsequent icons with the 45 multiplier
            lifeIcon.x = livesText.x + livesText.width + initialOffset + (45 * i);
            lifeIcon.y = livesText.y + livesText.height / 2;
            lifeIcon.scale.set(0.04); // Icon scale
            lifeIcon.isLifeIcon = true;
            this.app.stage.addChild(lifeIcon);
        }
    }

    updateScore(newScore) {
        this.score = newScore;
        this.scoreText.text = 'Score: ' + this.score;
        // Adjust the x position of the scoreText based on its width to ensure it's always visible
        this.scoreText.x = this.app.screen.width - this.scoreText.width - 10;
    }

    updateLives(newLives) {
        this.lives = newLives;
        // First, remove existing lives display
        this.app.stage.children.forEach(child => {
            if (child.isLifeIcon) {
                this.app.stage.removeChild(child);
            }
        });
        // Then, create new lives display with updated lives count
        this.createLivesDisplay();
    }
}
