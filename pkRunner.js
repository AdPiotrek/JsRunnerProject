const platformWidth = 100;
let platformBase;
const platformSpacer = 100;

class Game {

    constructor() {
        this.canvas = document.createElement('canvas');
        this.sound = new Audio('./assets/sound/background.mp3');
        this.sound.play();
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight - 5;
        document.body.appendChild(this.canvas);
        platformBase = this.canvas.height - platformWidth;
        this.frame = 0;
        this.lifes = 0;
        this.points = 0;
        this.gapeLength = 0;
        this.platformLength = 0;
        this.background = new Image();
        this.background.src = './assets/images/background.png';
        this.background.onload = () => {
            this.ctx.drawImage(this.background, 0, 0);
            this.anim();
        };
        this.init();

    }

    init() {
        this.ground = [];
        this.hearths = [];
        this.frame = 0;
        this.zombies = [];

        if (this.lifes === -1) {
            this.points = 0;
            this.lifes = 0;
        }
        this.spreadSheet = new SpriteSheet('assets/images/runner.png', 8, 1);
        this.player = new Player();
        this.player.anim = new Animation(this.spreadSheet, this.ctx);
        this.bgAnim = new ScrollAnimation(this.background, this.ctx, 5);
        this.isGameRunning = true;
        this.initGround();
    };

    initGround() {
        for (let i = 0; i < 6 + this.platformLength; i++) {
            this.ground.push(
                new Block(i * platformWidth, platformBase - platformSpacer, '', this.player, this.ctx)
            )
        }

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

        for (let i = 0; i < this.hearths.length; i++) {
            this.hearths[i].update();
            this.hearths[i].draw();
        }

        for(let i = 0; i< this.zombies.length; i++){
            this.zombies[i].update();
            this.zombies[i].draw();
        }

        // remove ground that have gone off screen
        if (this.ground[0] && this.ground[0].x < -platformWidth) {
            this.ground.splice(0, 1);
        }
    }

    anim() {
        let animFrame = 0;
        const animation = () => {
            if (this.isGameRunning) {
                this.frame++;
                if (this.frame % 50 === 0) {
                    this.points++;
                    this.frame = 0;
                }
                animFrame++;
                this.drawPoints();
                this.drawLifes();
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.bgAnim.draw();
                this.player.update();
                this.player.anim.draw(animFrame, this.player.x, this.player.y);
                this.updateGround();
                this.lifes = this.player.checkCollisionWithHearth(this.hearths) === true ? this.lifes = this.lifes + 1 : this.lifes;
                this.player.checkCollisionWithEnemies(this.zombies) ? this.gameOver(true) : null;
                if (this.ground.length < 5000) {
                    this.spawnBlock();
                }
                this.gameOver();

            }
            requestAnimationFrame(animation);

        };
        animation();
    };

    spawnBlock() {
        const level = Math.floor(Math.random() * 3);
        this.platformLength = Math.floor(Math.random() * 4) + 2;
        const arrLeng = this.ground.length + 1;
        this.gapeLength = Math.floor(Math.random() * 2 + 1) + 2;
        let hearthAdded = false;
        let zombieAdded = false;
        for (let i = arrLeng; i < arrLeng + this.platformLength; i++) {
            const hearthRandom = Math.floor(Math.random() * 100);
            this.ground.push(
                new Block((this.gapeLength + i) * platformWidth, platformBase - platformSpacer * level, '', this.player, this.ctx)
            );
            if (hearthRandom % 60 === 0 && !hearthAdded) {
                hearthAdded = true;
                this.hearths.push(new Hearth((this.gapeLength + i) * platformWidth + 32, platformBase - platformSpacer * (level + 1) + 25, '', this.player, this.ctx))
            }

            if (hearthRandom % 10 === 0 && !hearthAdded  &&  !zombieAdded && i!==arrLeng) {
                console.log('zombieSpawned');
                zombieAdded = true;
                this.zombies.push(new Zombie((this.gapeLength + i) * platformWidth + 32, platformBase - platformSpacer * (level + 1) + 25, '', this.player, this.ctx))
            }


        }


        for (let i = 0; i < this.gapeLength; i++) {
            this.ground.push(
                new Block(-1000, 1000, '', this.player, this.ctx)
            )
        }

    }

    gameOver(bool) {
        if (this.player.y > this.canvas.height || bool ===true) {
            this.lifes--;
            if (this.lifes >= 0) {
                return this.init();
            }
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.isGameRunning = false;


            const btn = document.getElementById('gameOverButton');
            const result = document.getElementById('result');
            const score = document.getElementById('score');
            const lifes = document.getElementById('lifes');
            score.style.visibility = 'hidden';
            btn.style.visibility = 'visible';
            result.style.color = 'Red';
            lifes.style.color = 'Red';
            result.innerHTML = "Your score: " + this.points.toString();
            lifes.innerHTML = this.lifes === -1 ? "Lifes: " + 0 : "Lifes: " + this.lifes.toString();
            result.style.visibility = 'visible';
            lifes.style.visibility = 'visible';

            btn.addEventListener('click', () => {
                score.style.visibility = 'visible';
                btn.style.visibility = 'hidden';
                result.style.visibility = 'hidden';
                this.init();
            })


        }
    }

    drawPoints() {
        const score = document.getElementById('score');
        score.style.left = 0 + "px";
        score.style.top = 0 + "px";
        score.style.color = 'Red';
        score.innerHTML = "Actual score: " + this.points.toString();
    }

    drawLifes() {
        const score = document.getElementById('lifes');
        score.style.left = 400 + "px";
        score.style.top = 0 + "px";
        score.style.color = 'Red';
        score.innerHTML = "Lifes: " + this.lifes.toString();
    }
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

        const properWidth = (playerStartX <= blockStartX && playerEndX >= blockStartX && playerEndX <= blockEndX ||
            playerStartX >= blockStartX && playerEndX <= blockEndX ||
            playerStartX <= blockEndX && playerEndX >= blockEndX);
        const isAbove = (playerBottom <= blockTop && !(playerBottom <= blockTop - 10));


        return properWidth && isAbove;

    }

}


class Player extends Vectors {
    constructor() {
        super(64, 250);
        this.gravity = 1;
        this.dy = 0;
        this.jumpDy = -15;
        this.isFalling = false;
        this.isJumping = false;
        this.jumpCounter = 0;
        this.speed = 10;
        this.height = 100;
        this.width = 90;
    }

    //dziedzicząca z vektor

    update() {
        if (KEY_STATUS.space && this.dy === 0 && !this.isJumping) {
            this.isJumping = true;
            this.dy = this.jumpDy;
            this.jumpCounter = 12;
        }

        if (KEY_STATUS.space && this.jumpCounter) {
            this.dy = this.jumpDy;
        }

        this.jumpCounter = Math.max(this.jumpCounter - 1, 0);

        this.advance();
        if (this.isFalling || this.isJumping) {
            this.dy = Math.min(this.dy + 1, 10);
        }
    }

    checkCollisionWithHearth(hearths) {
        const playerLeft = this.x;
        const playerRight = this.x + this.width;
        const playerTop = this.y;
        const playerBottom = this.y + this.height;
        for (let i = 0; i < hearths.length; i++) {
            const hearthLeft = hearths[i].x;
            const hearthRight = hearths[i].x + hearths[i].width;
            const hearthTop = hearths[i].y;
            const hearthBottom = hearths[i].y + hearths[i].height;
            if (!(hearthLeft > playerRight || hearthRight < playerLeft ||
                hearthTop > playerBottom || hearthBottom < playerTop)) {
                this.sound = new Audio('./assets/sound/coin.mp3');
                this.sound.play();
                hearths.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    checkCollisionWithEnemies(hearths) {
        const playerLeft = this.x;
        const playerRight = this.x + this.width;
        const playerTop = this.y;
        const playerBottom = this.y + this.height;
        for (let i = 0; i < hearths.length; i++) {
            const hearthLeft = hearths[i].x;
            const hearthRight = hearths[i].x + hearths[i].width;
            const hearthTop = hearths[i].y;
            const hearthBottom = hearths[i].y + hearths[i].height;
            if (!(hearthLeft > playerRight || hearthRight < playerLeft ||
                hearthTop > playerBottom || hearthBottom < playerTop)) {
                console.log('zombie');
                return true;
            }
        }
        return false;
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
        this.height = platformSpacer;
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

class Hearth extends Vectors {
    constructor(x, y, type, relativePlayer, ctx) {
        super(x, y);
        this.width = platformWidth;
        this.height = platformSpacer;
        this.player = relativePlayer;
        this.ctx = ctx;
        this.newImg();
    }

    newImg() {
        this.image = new Image();
        this.image.src = 'assets/images/hearth.png'
    }

    update() {
        this.dx = -this.player.speed;
        this.advance();
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, 40, 40);
    }


}

class Zombie extends Vectors {
    constructor(x, y, type, relativePlayer, ctx) {
        super(x, y);
        this.width = 40;
        this.height = 40;
        this.player = relativePlayer;
        this.ctx = ctx;
        this.newImg();
    }

    newImg() {
        this.image = new Image();
        this.image.src = 'assets/images/zombie.png'
    }

    update() {
        this.dx = -this.player.speed;
        this.advance();
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, 60, 60);
    }
}

class Audio {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
    }

    play() {
        this.sound.play();
    }

    stop() {
        this.sound.pause();
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
ACTIVE_GAME = new Game();

//block width = 64,2
//block height = 64.5
