class Game {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight - 5;
        document.body.appendChild(this.canvas);
        this.init();
    }

    init() {
        this.background = new Image();
        this.background.src = './assets/images/background.png';
        this.background.onload = () => {
            this.ctx.drawImage(this.background, 0, 0);
            this.anim();
        };
        this.spreadSheet = new SpriteSheet('assets/images/runner.png', 6, 4);
        this.playerAnim = new Animation(this.spreadSheet, 4, this.ctx);
    };

    anim() {
        const animation = () => {
            console.log(this);
            this.ctx.clearRect(0,0, 400,400);
            this.playerAnim.draw();
            requestAnimationFrame(animation);
        };
        animation();
    };
}

class SpriteSheet {

    constructor(path, columns, rows) {
        this.image = new Image();
        this.image.src = path;
        this.columns = columns;
        this.rows = rows;
        this.size = rows * columns;

        this.image.onload = () => {
            this.frameHeight = this.image.naturalHeight / rows;
            this.frameWidth = this.image.naturalWidth / columns;
        };
    };

}

class Animation {

    constructor(spritesheet, frameSpeed, ctx) {
        this.spritesheet = spritesheet;
        this.frameSpeed = frameSpeed;
        this.currentFrame = 0;
        this.ctx = ctx;
    }

    draw() {
        const row = Math.floor(this.currentFrame / this.spritesheet.columns);
        const column = this.currentFrame % this.spritesheet.columns;
        this.ctx.drawImage(
            this.spritesheet.image,
            column * this.spritesheet.frameWidth,
            row * this.spritesheet.frameHeight,
            this.spritesheet.frameWidth,
            this.spritesheet.frameHeight,
            40, 40,
            this.spritesheet.frameWidth,
            this.spritesheet.frameHeight
        );
        this.currentFrame++;
        this.currentFrame = this.currentFrame % this.spritesheet.size;
    }

}


new Game();
