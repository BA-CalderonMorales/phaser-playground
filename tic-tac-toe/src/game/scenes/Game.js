import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');

        this.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        
        this.currentPlayer = 1; // 1 for X, 2 for O
        this.gameOver = false;
        this.boardCells = [];
        this.boardSize = 3;
        this.cellSize = 120;
        this.winningLine = null;
        this.particles = null;
    }

    create ()
    {
        // Reset the game state whenever the scene is created
        this.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        this.currentPlayer = 1;
        this.gameOver = false;
        
        this.cameras.main.setBackgroundColor(0x0a0a3c);

        this.add.image(512, 384, 'background').setAlpha(0.3);

        // Game title
        this.add.text(512, 70, 'Phaser Playground', {
            fontFamily: 'Arial Black', 
            fontSize: 36, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        // Game subtitle
        this.add.text(512, 120, 'Tic-Tac-Toe', {
            fontFamily: 'Arial Black', 
            fontSize: 28, 
            color: '#ffff00',
            stroke: '#000000', 
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        // Status text
        this.statusText = this.add.text(512, 180, 'Player X Turn', {
            fontFamily: 'Arial Black', 
            fontSize: 32, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Create the game board
        this.createBoard();
    }

    createBoard() {
        // Clear any existing board elements
        if (this.boardCells.length > 0) {
            this.boardCells.forEach(row => {
                row.forEach(cell => {
                    cell.destroy();
                });
            });
            this.boardCells = [];
        }

        // Board background
        const boardBg = this.add.rectangle(512, 384, this.cellSize * 3 + 20, this.cellSize * 3 + 20, 0x000000, 0.5);
        
        // Calculate the starting position for the top-left cell
        const startX = 512 - (this.cellSize * 1.5) + (this.cellSize / 2);
        const startY = 384 - (this.cellSize * 1.5) + (this.cellSize / 2);

        // Create grid lines
        for (let i = 1; i < this.boardSize; i++) {
            // Vertical lines
            this.add.line(
                0, 0,
                startX + (this.cellSize * i) - (this.cellSize / 2), startY - (this.cellSize / 2),
                startX + (this.cellSize * i) - (this.cellSize / 2), startY + (this.cellSize * 2) + (this.cellSize / 2),
                0xffffff, 0.8
            ).setOrigin(0);
            
            // Horizontal lines
            this.add.line(
                0, 0,
                startX - (this.cellSize / 2), startY + (this.cellSize * i) - (this.cellSize / 2),
                startX + (this.cellSize * 2) + (this.cellSize / 2), startY + (this.cellSize * i) - (this.cellSize / 2),
                0xffffff, 0.8
            ).setOrigin(0);
        }

        // Create the cells for interaction
        for (let row = 0; row < this.boardSize; row++) {
            this.boardCells[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                const cellX = startX + (col * this.cellSize);
                const cellY = startY + (row * this.cellSize);
                
                const cell = this.add.rectangle(cellX, cellY, this.cellSize - 10, this.cellSize - 10, 0xffffff, 0.1)
                    .setInteractive()
                    .setData('row', row)
                    .setData('col', col);
                
                cell.on('pointerover', () => {
                    if (!this.gameOver && this.board[row][col] === 0) {
                        cell.setFillStyle(0xffffff, 0.3);
                    }
                });
                
                cell.on('pointerout', () => {
                    if (!this.gameOver) {
                        cell.setFillStyle(0xffffff, 0.1);
                    }
                });
                
                cell.on('pointerdown', () => {
                    this.makeMove(row, col, cell);
                });
                
                this.boardCells[row][col] = cell;
                
                // Place existing markers if board already has moves
                if (this.board[row][col] === 1) {
                    this.placeMarker(cellX, cellY, 'x');
                } else if (this.board[row][col] === 2) {
                    this.placeMarker(cellX, cellY, 'o');
                }
            }
        }
    }

    makeMove(row, col, cell) {
        // Check if the move is valid
        if (this.gameOver || this.board[row][col] !== 0) {
            return;
        }
        
        // Update the game board
        this.board[row][col] = this.currentPlayer;
        
        // Place the marker
        const cellX = cell.x;
        const cellY = cell.y;
        
        if (this.currentPlayer === 1) {
            this.placeMarker(cellX, cellY, 'x');
        } else {
            this.placeMarker(cellX, cellY, 'o');
        }
        
        // Check for a win
        if (this.checkWin(this.currentPlayer)) {
            this.gameOver = true;
            const winner = this.currentPlayer === 1 ? 'X' : 'O';
            this.statusText.setText(`Player ${winner} Wins!`);
            
            this.showWinningLine(this.getWinningLine(this.currentPlayer));
            this.celebrateWin(winner);
            
            // Allow returning to menu after a delay
            this.time.delayedCall(5000, () => {
                if (this.gameOver) {
                    this.scene.start('GameOver');
                }
            });
            return;
        }
        
        // Check for a draw
        if (this.checkDraw()) {
            this.gameOver = true;
            this.statusText.setText('It\'s a Draw!');
            this.celebrateDraw(); // Celebrate the draw
            
            // Allow returning to menu after a delay
            this.time.delayedCall(5000, () => {
                if (this.gameOver) {
                    this.scene.start('GameOver');
                }
            });
            return;
        }
        
        // Switch player
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        const nextPlayer = this.currentPlayer === 1 ? 'X' : 'O';
        this.statusText.setText(`Player ${nextPlayer} Turn`);
    }
    
    placeMarker(x, y, type) {
        const marker = this.add.image(x, y, type).setScale(0.8);
        
        // Add a nice animation
        this.tweens.add({
            targets: marker,
            scale: 1,
            duration: 200,
            ease: 'Back.easeOut'
        });
    }
    
    checkWin(player) {
        // Check rows
        for (let row = 0; row < 3; row++) {
            if (this.board[row][0] === player && this.board[row][1] === player && this.board[row][2] === player) {
                return true;
            }
        }
        
        // Check columns
        for (let col = 0; col < 3; col++) {
            if (this.board[0][col] === player && this.board[1][col] === player && this.board[2][col] === player) {
                return true;
            }
        }
        
        // Check diagonals
        if (this.board[0][0] === player && this.board[1][1] === player && this.board[2][2] === player) {
            return true;
        }
        if (this.board[0][2] === player && this.board[1][1] === player && this.board[2][0] === player) {
            return true;
        }
        
        return false;
    }
    
    checkDraw() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.board[row][col] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
    
    resetGame() {
        // Reset the game state
        this.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        this.currentPlayer = 1;
        this.gameOver = false;
        this.statusText.setText('Player X Turn');
        
        // Clean up particles and winning line
        if (this.particles) {
            this.particles.destroy();
            this.particles = null;
        }
        
        if (this.winningLine) {
            this.winningLine.destroy();
            this.winningLine = null;
        }
        
        // Clean up celebration text and images
        if (this.winnerText) {
            this.winnerText.destroy();
            this.winnerText = null;
        }
        
        // Clean up draw elements
        if (this.drawText) {
            this.drawText.destroy();
            this.drawText = null;
        }
        
        if (this.drawImage) {
            this.drawImage.destroy();
            this.drawImage = null;
        }
        
        // Recreate the board
        this.createBoard();
    }
    
    showWinningLine(cells) {
        if (this.winningLine) {
            this.winningLine.destroy();
        }
        
        const graphics = this.add.graphics();
        graphics.lineStyle(10, 0xff0000, 1);
        
        // Draw a line between the winning cells
        this.tweens.add({
            targets: graphics,
            alpha: { from: 1, to: 0 },
            duration: 1500,
            ease: 'Linear',
            onComplete: () => {
                graphics.destroy();
            }
        });
        
        const [start, end] = cells;
        graphics.moveTo(start.x, start.y);
        graphics.lineTo(end.x, end.y);
    }
    
    getWinningLine(player) {
        // Check rows
        for (let row = 0; row < 3; row++) {
            if (this.board[row][0] === player && this.board[row][1] === player && this.board[row][2] === player) {
                return [
                    { x: 512 - (this.cellSize * 1.5) + (this.cellSize / 2), y: 384 - (this.cellSize * 1.5) + (this.cellSize / 2) + (row * this.cellSize) },
                    { x: 512 + (this.cellSize * 1.5) - (this.cellSize / 2), y: 384 - (this.cellSize * 1.5) + (this.cellSize / 2) + (row * this.cellSize) }
                ];
            }
        }
        
        // Check columns
        for (let col = 0; col < 3; col++) {
            if (this.board[0][col] === player && this.board[1][col] === player && this.board[2][col] === player) {
                return [
                    { x: 512 - (this.cellSize * 1.5) + (this.cellSize / 2) + (col * this.cellSize), y: 384 - (this.cellSize * 1.5) + (this.cellSize / 2) },
                    { x: 512 - (this.cellSize * 1.5) + (this.cellSize / 2) + (col * this.cellSize), y: 384 + (this.cellSize * 1.5) - (this.cellSize / 2) }
                ];
            }
        }
        
        // Check diagonals
        if (this.board[0][0] === player && this.board[1][1] === player && this.board[2][2] === player) {
            return [
                { x: 512 - (this.cellSize * 1.5) + (this.cellSize / 2), y: 384 - (this.cellSize * 1.5) + (this.cellSize / 2) },
                { x: 512 + (this.cellSize * 1.5) - (this.cellSize / 2), y: 384 + (this.cellSize * 1.5) - (this.cellSize / 2) }
            ];
        }
        if (this.board[0][2] === player && this.board[1][1] === player && this.board[2][0] === player) {
            return [
                { x: 512 + (this.cellSize * 1.5) - (this.cellSize / 2), y: 384 - (this.cellSize * 1.5) + (this.cellSize / 2) },
                { x: 512 - (this.cellSize * 1.5) + (this.cellSize / 2), y: 384 + (this.cellSize * 1.5) - (this.cellSize / 2) }
            ];
        }
        
        return null;
    }
    
    celebrateWin(winner) {
        // Create particle emitter for confetti effect
        this.particles = this.add.particles(0, 0, 'confetti', {
            x: { min: 0, max: this.game.config.width },
            y: -50,
            angle: { min: 0, max: 360 },
            speed: { min: 200, max: 400 },
            gravityY: 300,
            lifespan: 4000,
            quantity: 1,
            scale: { min: 0.1, max: 0.5 },
            rotate: { min: 0, max: 360 },
            tint: [ 0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF ],
            emitting: true
        });
        
        // Display winner animation
        const winnerColor = winner === 'X' ? '#ff4444' : '#44aaff';
        this.winnerText = this.add.text(512, 280, `PLAYER ${winner} WINS!`, {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: winnerColor,
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center',
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 5,
                fill: true
            }
        }).setOrigin(0.5).setAlpha(0);
        
        // Animate the winner text
        this.tweens.add({
            targets: this.winnerText,
            alpha: 1,
            y: 240,
            scale: 1.2,
            duration: 1000,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: this.winnerText,
                    scale: 1,
                    duration: 300,
                    yoyo: true,
                    repeat: 4
                });
            }
        });
        
        // Stop particle emission after a delay
        this.time.delayedCall(3000, () => {
            if (this.particles) {
                this.particles.emitting = false;
            }
        });
    }
    
    celebrateDraw() {
        // Create slow-falling confetti effect for draw
        this.particles = this.add.particles(0, 0, 'confetti', {
            x: { min: 0, max: this.game.config.width },
            y: -50,
            angle: { min: 0, max: 360 },
            speed: { min: 100, max: 200 }, // Slower than win celebration
            gravityY: 100, // Lighter fall than win celebration
            lifespan: 5000,
            quantity: 0.5, // Less particles than win celebration
            scale: { min: 0.1, max: 0.3 },
            rotate: { min: 0, max: 360 },
            tint: [ 0xCCCCCC, 0xFFFFFF, 0x888888, 0xAAAAAA ], // More neutral colors for draw
            emitting: true
        });
        
        // Add handshake animation
        this.drawImage = this.add.image(512, 280, 'handshake').setScale(0).setOrigin(0.5);
        
        // Animate the handshake
        this.tweens.add({
            targets: this.drawImage,
            scale: 0.5, // Scale to appropriate size
            duration: 1000,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Add gentle rocking motion
                this.tweens.add({
                    targets: this.drawImage,
                    angle: { from: -5, to: 5 },
                    duration: 1000,
                    yoyo: true,
                    repeat: 3
                });
            }
        });
        
        // Display draw text
        this.drawText = this.add.text(512, 380, "IT'S A DRAW!", {
            fontFamily: 'Arial Black',
            fontSize: 40,
            color: '#ffcc00',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 5,
                fill: true
            }
        }).setOrigin(0.5).setAlpha(0);
        
        // Animate the draw text
        this.tweens.add({
            targets: this.drawText,
            alpha: 1,
            y: 370,
            duration: 800,
            ease: 'Cubic.easeOut',
            delay: 500
        });
        
        // Stop particle emission after a delay
        this.time.delayedCall(3000, () => {
            if (this.particles) {
                this.particles.emitting = false;
            }
        });
    }
}
