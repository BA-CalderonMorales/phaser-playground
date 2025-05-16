import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x0a0a3c);

        this.add.image(512, 384, 'background').setAlpha(0.3);

        this.add.text(512, 220, 'Phaser Playground', {
            fontFamily: 'Arial Black', 
            fontSize: 36, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        this.add.text(512, 280, 'Game Over', {
            fontFamily: 'Arial Black', 
            fontSize: 50, 
            color: '#ffff00',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Create buttons
        const playAgainButton = this.add.text(512, 400, 'Play Again', {
            fontFamily: 'Arial Black', 
            fontSize: 32, 
            color: '#ffffff',
            backgroundColor: '#222222',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setInteractive();

        const mainMenuButton = this.add.text(512, 500, 'Main Menu', {
            fontFamily: 'Arial Black', 
            fontSize: 32, 
            color: '#ffffff',
            backgroundColor: '#222222',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setInteractive();

        // Button effects
        playAgainButton.on('pointerover', () => {
            playAgainButton.setStyle({ backgroundColor: '#444444' });
        });

        playAgainButton.on('pointerout', () => {
            playAgainButton.setStyle({ backgroundColor: '#222222' });
        });

        mainMenuButton.on('pointerover', () => {
            mainMenuButton.setStyle({ backgroundColor: '#444444' });
        });

        mainMenuButton.on('pointerout', () => {
            mainMenuButton.setStyle({ backgroundColor: '#222222' });
        });

        // Button actions
        playAgainButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        mainMenuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        // Display X and O symbols
        if (this.textures.exists('x')) {
            const xSymbol = this.add.image(400, 600, 'x').setScale(0.6).setAlpha(0.7);
        }

        if (this.textures.exists('o')) {
            const oSymbol = this.add.image(624, 600, 'o').setScale(0.6).setAlpha(0.7);
        }
    }
}
