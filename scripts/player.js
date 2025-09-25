export class Player {
    constructor(x,y,radius) {
        this.accelerationSpeed = 0.1;
        this.x = x;
        this.y = y;
        this.dy = 0;
        this.dx = 0;

        this.radius = radius
        this.image = new Image();
        this.image.src = "./images/player.png";

        
        this.weapons = [
            {type:"normal",damage:5},
            {type:"machine-gun",damage:2}
        ]
        this.weapon = 0
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        ctx.fillStyle = "rgb(0,0,10)"
        ctx.fill()
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius)
    }
    update(ctx,keys) {
        if (keys.indexOf('ArrowLeft') > -1 || keys.indexOf('a') > -1) this.dx -= this.accelerationSpeed;
        if (keys.indexOf('ArrowRight') > -1 || keys.indexOf('d') > -1) this.dx += this.accelerationSpeed;
        if (keys.indexOf('ArrowUp') > -1 || keys.indexOf('w') > -1) this.dy -= this.accelerationSpeed;
        if (keys.indexOf('ArrowDown') > -1 || keys.indexOf('s') > -1) this.dy += this.accelerationSpeed;

        this.x += this.dx
        this.y += this.dy
        this.draw(ctx)
    }
}
