const platformWidth = 100;
let platformBase;
const platformSpacer = 100;
let platformHeight = 1, platformLength = 15, gapLength;


class Game {

    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight - 5;
        document.body.appendChild(this.canvas);
        platformBase = this.canvas.height - platformWidth;
        this.ground = [];
        this.init();
    }

    init() {
        this.background = new Image();
        this.background.src = './assets/images/background.png';
        this.background.onload = () => {
            this.ctx.drawImage(this.background, 0, 0);
            this.anim();
        };
        this.spreadSheet = new SpriteSheet('assets/images/runner.png', 8, 1);
        this.player = new Player();
        this.initGround();
        this.player.anim = new Animation(this.spreadSheet, this.ctx);
        this.bgAnim = new ScrollAnimation(this.background, this.ctx, 5);
    };

    initGround() {
        for (let i = 0; i < 9999; i++) {
            this.ground[i] = new Block(i * platformWidth, platformBase - platformHeight * platformSpacer, '', this.player, this.ctx)

        }
        this.ground[30] = new Block(this.ground[29].x + 200, platformBase - platformHeight * platformSpacer - 100, '', this.player, this.ctx)
        console.log(this.ground)

    }

    updateGround() {
        // animate ground
        this.player.isFalling = true;
        for (let i = 0; i < this.ground.length; i++) {
            this.ground[i].update();
            this.ground[i].draw();

            if (this.player.shouldFalling(this.ground[i])) {
                this.player.isJumping = false;
                this.player.isFalling = false;
                this.player.dy = 0;
            }
        }

        // remove ground that have gone off screen
        if (this.ground[0] && this.ground[0].x < -platformWidth) {
            this.ground.splice(0, 1);
        }
    }

    anim() {
        let animFrame = 0;
        const animation = () => {
            animFrame++;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.bgAnim.draw();
            this.player.update();
            this.player.anim.draw(animFrame, this.player.x, this.player.y);
            this.updateGround();

            requestAnimationFrame(animation);
        };
        animation();
    };
}


class SpriteSheet {

    constructor(path, columns, rows, frameWidth, frameHeight) {
        this.image = new Image();
        this.image.src = path;
        this.columns = columns;
        this.rows = rows;
        this.size = rows * columns;


        this.image.onload = () => {
            this.frameHeight = frameWidth || this.image.naturalHeight / this.rows;
            this.frameWidth = frameHeight || this.image.naturalWidth / this.columns;
        };
    };

}

class ScrollAnimation {
    constructor(image, ctx, speed) {
        this.image = image;
        this.ctx = ctx;
        this.speed = speed;
        this.x = 0;
    }


    draw() {
        this.x -= this.speed;
        this.ctx.drawImage(this.image, this.x, 0);
        this.ctx.drawImage(this.image, this.x + this.image.width, 0);
        if (this.x + this.image.width <= 0) {
            this.x = 0;
        }
    }
}


class Animation {

    constructor(spritesheet, ctx) {
        this.spritesheet = spritesheet;
        this.currentFrame = 0;
        this.ctx = ctx;
    }

    draw(animFrame, width, height) {
        const row = Math.floor(this.currentFrame / this.spritesheet.columns);
        const column = this.currentFrame % this.spritesheet.columns;
        this.ctx.drawImage(
            this.spritesheet.image,
            column * this.spritesheet.frameWidth,
            row * this.spritesheet.frameHeight,
            this.spritesheet.frameWidth,
            this.spritesheet.frameHeight,
            width, height,
            100, 100
        );
        if (animFrame % 6 === 0) {
            this.currentFrame++;
            this.currentFrame = this.currentFrame % this.spritesheet.size;
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


    shouldFalling(block) {
        const playerStartX = this.x;
        const playerBottom = this.y + this.height;
        const playerEndX = playerStartX + this.width;
        const blockStartX = block.x;
        const blockEndX = blockStartX + block.width;
        const blockTop = block.y;

        const properWidth  = (playerStartX <= blockStartX && playerEndX >= blockStartX && playerEndX <= blockEndX ||
            playerStartX >= blockStartX && playerEndX <= blockEndX ||
            playerStartX <= blockEndX && playerEndX >= blockEndX);
        const isAbove =  ( playerBottom <= blockTop && !(playerBottom <= blockTop -10));


        return properWidth && isAbove;

    }

}


class Player extends Vectors {
    constructor() {
        super(64, 250);
        this.gravity = 1;
        this.dy = 0;
        this.jumpDy = -10;
        this.isFalling = false;
        this.isJumping = false;
        this.jumpCounter = 0;
        this.speed = 6;
        this.height = 100;
        this.width = 100;
    }

    //dziedzicząca z vektor

    update() {
        if (KEY_STATUS.space && this.dy === 0 && !this.isJumping) {
            this.isJumping = true;
            this.dy = this.jumpDy;
            this.jumpCounter = 12;
            console.log("Ustawiam na 12")
        }

        // jesli jest wcisnieta to ustaw dy znów na tyle ile sie powinien podniesc
        if (KEY_STATUS.space && this.jumpCounter) {
            this.dy = this.jumpDy;
            console.log(this.jumpCounter);
        }

        //z kazda klatka sobie odejmujemy z jumpCountera , zawsze bedzie min 0
        this.jumpCounter = Math.max(this.jumpCounter - 1, 0);


        //przypisujemy wartosci z nastepnej klatki do obiektu zeby je narysowac
        this.advance();

        // sprawdzanie czy powinien spadac, jesli tak no to robimy z wysokoscia jak wyzej
        if (this.isFalling || this.isJumping) {
            this.dy = Math.min(this.dy +1 , 10);
        }
    }

    reset() {
        this.x = 64;
        this.y = 250;
    }

}

class Block extends Vectors {
    constructor(x, y, type, relativePlayer, ctx) {
        super(x, y);
        this.width = platformWidth;
        this.height = platformHeight;
        this.player = relativePlayer;
        this.ctx = ctx;
        this.newImg();
    }

    newImg() {
        this.image = new Image();
        this.image.src = 'assets/images/block.png'
    }

    update() {
        this.dx = -this.player.speed;
        this.advance();
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, 100, 100);
    }


}


// skopiowałem żeby działało xD


var KEY_CODES = {
    32: 'space'
};
var KEY_STATUS = {};
for (var code in KEY_CODES) {
    if (KEY_CODES.hasOwnProperty(code)) {
        KEY_STATUS[KEY_CODES[code]] = false;
    }
}
document.onkeydown = function (e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
};
document.onkeyup = function (e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
};
new Game();

//block width = 64,2
//block height = 64.5
