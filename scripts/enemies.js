export class Enemy {
  constructor (x, y, health, color, velocity, angle) {
    this.x = x
    this.y = y
    this.health = health
    this.radius = 16
    this.color = color
    this.velocity = velocity
    this.angle = angle
    this.dx = Math.cos(this.angle)*velocity
    this.dy = Math.sin(this.angle)*velocity
    this.image = new Image();
    this.image.src = "./images/enemy-ship.png";
  }
  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
    ctx.fillStyle = this.color
    ctx.fill()
    
    
    ctx.translate(this.x,this.y);
    ctx.rotate(this.angle);
    ctx.translate(-this.x,-this.y);

    ctx.drawImage(this.image, this.x-this.radius, this.y-this.radius)   

    // untranslate and unrotate
    ctx.translate(this.x, this.y);
    ctx.rotate(-(this.angle));
    ctx.translate(-this.x,-this.y);
  }
  update(ctx, player) {
    this.angle = Math.atan2(player.y-this.y,player.x-this.x)
    this.dx = Math.cos(this.angle)*this.velocity
    this.dy = Math.sin(this.angle)*this.velocity

    this.x = this.x + this.dx
    this.y = this.y + this.dy
    this.color = `hsl(0, 100%, ${this.health}%)`
    
    this.draw(ctx)
  }
}

export class SnakeEnemy {
  constructor (x, y, health, color, velocity, angle) {
    this.x = x
    this.y = y
    this.health = health
    this.radius = 16
    this.color = color
    this.velocity = velocity
    this.angle = angle
    this.dx = Math.cos(this.angle)*velocity
    this.dy = Math.sin(this.angle)*velocity
  }
  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
    ctx.fillStyle = this.color
    ctx.fill()
    
    this.image = new Image(); // Create new img element
    this.image.src = "./images/snake-head.png"; // Set source path
    
    ctx.translate(this.x,this.y);
    ctx.rotate(this.angle);//
    ctx.translate(-this.x,-this.y);

    ctx.drawImage(this.image, this.x-this.radius, this.y-this.radius)   

    // untranslate and unrotate
    ctx.translate(this.x, this.y);
    ctx.rotate(-(this.angle));//
    ctx.translate(-this.x,-this.y);
  }
  update(ctx, player) {
    this.angle = Math.atan2(player.y-this.y,player.x-this.x)
    this.dx = Math.cos(this.angle)*this.velocity
    this.dy = Math.sin(this.angle)*this.velocity

    this.x = this.x + this.dx
    this.y = this.y + this.dy
    this.color = `hsl(0, 100%, ${this.health}%)`
    
    this.draw(ctx)
  }
}
