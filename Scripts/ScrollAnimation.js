class ScrollAnimation {
    constructor(image, ctx, speed) {
        this.image = image;
        this.ctx = ctx;
        this.speed = speed;
        this.x = 0;
    }


    draw() {
        //Z każdą klatką przesuwamy o podany parametr speed
        this.x -= this.speed;
        //Rysujemy obrazek
        this.ctx.drawImage(this.image, this.x, 0);
        //Jednoczesnie od razu za nim rysujemy drugi obrazek zeby bylo plynne przejscie
        //jak widzisz drugi parametr this.x + this.image.width to po to zeby byl po prawej
        this.ctx.drawImage(this.image, this.x + this.image.width, 0);
        //Sprawdzamy czy x jest wieksze niz szeroko obrazka ( dlatego takie dziwne bo jak widzisz  w pierwszej linijce x jest
        //zawsze ujemne
        if (this.x + this.image.width <= 0) {
            this.x = 0;
        }
    }
}

