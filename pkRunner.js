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
        };
        this.player = {};
        this.player.width  = 60;
        this.player.height = 96;
        this.player.speed  = 6;
        this.player.sheet  = new SpriteSheet('assets/images/runner.png', player.width, player.height);
        this.player.anim   = new Animation(player.sheet, 4, 0, 15);
    };


}

new Game();

class SpriteSheet {

    constructor(path, frameWidth, frameHeight) {
        this.image = new Image();
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        this.image.onload = () => {
            this.framesPerRow = Math.floor(this.image.width / this.frameWidth);
        };

        this.image.src = path;
    };

}

class Animation {

    constructor(spritesheet, frameSpeed, startFrame, endFrame){
        
    }
}