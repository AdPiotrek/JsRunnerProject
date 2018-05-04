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
        this.player = new Player();
        this.player.anim =  new Animation(this.spreadSheet, this.ctx);
        this.bgAnim = new ScrollAnimation(this.background, this.ctx, 5);
    };

    anim() {
        let animFrame = 0;
        const animation = () => {
            animFrame++;
            this.ctx.clearRect(0, 0, 400, 400);
            this.bgAnim.draw();
            this.player.update();
            this.player.anim.draw(animFrame,this.player.x, this.player.y);
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

    draw(animFrame,width,height) {
        const row = Math.floor(this.currentFrame / this.spritesheet.columns);
        const column = this.currentFrame % this.spritesheet.columns;
        this.ctx.drawImage(
            this.spritesheet.image,
            column * this.spritesheet.frameWidth,
            row * this.spritesheet.frameHeight,
            this.spritesheet.frameWidth,
            this.spritesheet.frameHeight,
            width,height,
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

class Vectors {
    constructor(x, y, dx, dy) {
        // position
        this.x = x || 0;
        this.y = y || 0;
        // direction
        this.dx = dx || 0;
        this.dy = dy || 0;
    }

    advance() {
        this.x += this.dx;
        this.y += this.dy;
    }

    minDist(vector) {
        let minDist = Infinity;
        var max = Math.max(Math.abs(this.dx), Math.abs(this.dy),
            Math.abs(vec.dx), Math.abs(vec.dy));
        var slice = 1 / max;
        var x, y, distSquared;
        // get the middle of each vector
        var vec1 = {}, vec2 = {};
        vec1.x = this.x + this.width / 2;
        vec1.y = this.y + this.height / 2;
        vec2.x = vec.x + vec.width / 2;
        vec2.y = vec.y + vec.height / 2;
        for (var percent = 0; percent < 1; percent += slice) {
            x = (vec1.x + this.dx * percent) - (vec2.x + vec.dx * percent);
            y = (vec1.y + this.dy * percent) - (vec2.y + vec.dy * percent);
            distSquared = x * x + y * y;

            minDist = Math.min(minDist, distSquared);
        }

        return Math.sqrt(minDist);

    }
}


class Player extends Vectors{
    constructor(){
        super();
        this.gravity = 1;
        this.dy = 0;
        this.jumpDy = -10;
        this.isFalling = false;
        this.isJumping = false;
        this.jumpCounter = 0;
    }

    update() {

        if (KEY_STATUS.space && this.dy === 0 && !this.isJumping) {
            this.isJumping = true;
            this.dy = this.jumpDy;
            this.jumpCounter = 12;
            console.log('spacja wcisnieta')
        }

        // jump higher if the space bar is continually pressed
        if (KEY_STATUS.space && this.jumpCounter) {
            this.dy = this.jumpDy;
            console.log('spacja trzymana')
        }

        this.jumpCounter = Math.max(this.jumpCounter-1, 0);

        console.log(this.jumpCounter);
        this.advance();

        // add gravity
        if (this.isFalling || this.isJumping) {
            this.dy += this.gravity;
        }
    }

}


var KEY_CODES = {
    32: 'space'
};
var KEY_STATUS = {};
for (var code in KEY_CODES) {
    if (KEY_CODES.hasOwnProperty(code)) {
        KEY_STATUS[KEY_CODES[code]] = false;
    }
}
document.onkeydown = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
};
document.onkeyup = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
};
new Game ();
