class Game {

    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight - 5;
        document.body.appendChild(canvas);
        this.init();
    }

    init() {
        this.background = new Image();
        this.background.src = './assets/images/background.png';
        this.background.onload = () => {
            this.ctx.drawImage(this.background, 0, 0);
        }
    };


}

new Game();

