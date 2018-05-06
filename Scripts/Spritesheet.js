
class SpriteSheet {

    constructor(path, columns, rows, frameWidth, frameHeight) {
        this.image = new Image();
        this.image.src = path;
        this.columns = columns;
        this.rows = rows;
        this.size = rows * columns;


        this.image.onload = () => {
            //jesli nie ma zdefiniowanego frameWidth to przypisz to rownanie co poprawej
            // ogolnie zobacz sobie jak dziala || na necie
            this.frameHeight = frameWidth || this.image.naturalHeight / this.rows;
            this.frameWidth = frameHeight || this.image.naturalWidth / this.columns;
        };
    };

}
