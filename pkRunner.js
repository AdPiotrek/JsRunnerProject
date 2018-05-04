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
        this.spreadSheet = new SpriteSheet('assets/images/runner.png',8, 1);
        this.playerAnim = new Animation(this.spreadSheet, this.ctx);
        this.bgAnim = new ScrollAnimation(this.background, this.ctx, 5);
    };

    anim() {
        let animFrame = 0;
        const animation = () => {
            animFrame++;
            this.ctx.clearRect(0, 0, 400, 400);
            this.bgAnim.draw();
            this.playerAnim.draw(animFrame);
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
            this.frameHeight = this.image.naturalHeight / this.rows;
            this.frameWidth = this.image.naturalWidth / this.columns;
        };
    };

}

class Animation {

    constructor(spritesheet, ctx) {
        this.spritesheet = spritesheet;
        this.currentFrame = 0;
        this.ctx = ctx;
    }

    draw(animFrame) {
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
        if(animFrame % 6 === 0 ){
            this.currentFrame++;
            this.currentFrame = this.currentFrame % this.spritesheet.size;
        }
    }

}

class ScrollAnimation {
    constructor(image, ctx, speed){
        this.image = image;
        this.ctx = ctx;
        this.speed = speed;
        this.x = 0;
    }


    draw () {
        //Z każdą klatką przesuwamy o podany parametr speed
        this.x -= this.speed;
        //Rysujemy obrazek
        this.ctx.drawImage(this.image,this.x,0);
        //Jednoczesnie od razu za nim rysujemy drugi obrazek zeby bylo plynne przejscie
        //jak widzisz drugi parametr this.x + this.image.width to po to zeby byl po prawej
        this.ctx.drawImage(this.image,this.x + this.image.width,0);
        //Sprawdzamy czy x jest wieksze niz szeroko obrazka ( dlatego takie dziwne bo jak widzisz  w pierwszej linijce x jest
        //zawsze ujemne
        if(this.x + this.image.width  <= 0){
            this.x = 0;
        }
    }
}


new Game();
