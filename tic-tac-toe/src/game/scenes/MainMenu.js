import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x0a0a3c);
        
        this.add.image(512, 384, 'background').setAlpha(0.3);

        this.add.image(512, 200, 'logo');

        // Main Title
        this.add.text(512, 320, 'Phaser Playground', {
            fontFamily: 'Arial Black', 
            fontSize: 64, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(512, 390, 'Tic-Tac-Toe', {
            fontFamily: 'Arial Black', 
            fontSize: 36, 
            color: '#ffff00',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Create play button
        const playButton = this.add.text(512, 500, 'Play Game', {
            fontFamily: 'Arial Black', 
            fontSize: 32, 
            color: '#ffffff',
            backgroundColor: '#222222',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setInteractive();

        // Button effects
        playButton.on('pointerover', () => {
            playButton.setStyle({ backgroundColor: '#444444' });
        });

        playButton.on('pointerout', () => {
            playButton.setStyle({ backgroundColor: '#222222' });
        });

        playButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Display X and O symbols
        if (this.textures.exists('x')) {
            const xSymbol = this.add.image(400, 600, 'x').setScale(0.8);
            this.tweens.add({
                targets: xSymbol,
                y: 590,
                duration: 1500,
                yoyo: true,
                repeat: -1
            });
        }

        if (this.textures.exists('o')) {
            const oSymbol = this.add.image(624, 600, 'o').setScale(0.8);
            this.tweens.add({
                targets: oSymbol,
                y: 590,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                delay: 750
            });
        }
    }
}
