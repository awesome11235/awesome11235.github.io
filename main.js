// imports
import { Player } from "./scripts/player.js";
import { Enemy, SnakeEnemy } from "./scripts/enemies.js";
// import { Input } from "./scripts/input.js";

let explosionSound = new Audio();
explosionSound.src = "../music/explosion-01.mp3";
explosionSound.addEventListener('playing', function() {
    console.log("audio working?");
});


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
// c.webkitImageSmoothingEnabled=true;

const scoreCounter = document.querySelector("#scoreCounter");
let score = 0;
const startGameBtn = document.querySelector("#startGameBtn");
const startScreen = document.querySelector("#startScreen");
const finalScoreDislplay = document.querySelector("#finalScoreDislplay");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('load', function() {
    startScreen.style.display = "flex";
});
let screenShake = 0;

class Projectile {
    constructor (x, y, radius, color, velocity, damage, type) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.damage = damage
        this.type = type
    }
    draw() {
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
        this.image = new Image(); // Create new img element
        if (this.type == "normal") {
            this.image.src = "./images/big-projectile.png";
        } else {
            this.image.src = "./images/projectile.png"; // Set source path
        }
        c.drawImage(this.image, this.x-this.radius, this.y-this.radius)
    }
    update() {
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.draw()
    }
}


class Particle {
    constructor (x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }
    update() {
        this.velocity.x *= 1-0.01
        this.velocity.y *= 1-0.01
        
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        
        this.alpha -= 0.01
        this.draw()
    }
}


const x = canvas.width / 2
const y = canvas.height / 2

// let input = new Input();

let player = new Player(x,y,30)
let projectiles = []
let enemies = []
let particles = []

function init() {
    player = new Player(x,y,32)
    projectiles = []
    enemies = []
    score = 0
    scoreCounter.innerHTML = score
}

function spawnEnemies() {
    setInterval(() => {
        const spawnAngle = Math.random() * 2 * Math.PI
        const x = Math.cos(spawnAngle) * Math.hypot(canvas.width, canvas.height)+30
        const y = Math.sin(spawnAngle) * Math.hypot(canvas.width, canvas.height)+30
        const radius = 16
        
        const health = 10
        const color = `hsl(0, 100%, ${health}%)`
        
        const angle = Math.atan2(canvas.height/2-y,canvas.width/2-x)
        const velocity = 2
        enemies.push(new Enemy(x,y,health,color,velocity,angle))
    },1500)
    setInterval(() => {
        const spawnAngle = Math.random() * 2 * Math.PI
        const x = Math.cos(spawnAngle) * Math.hypot(canvas.width, canvas.height)+30
        const y = Math.sin(spawnAngle) * Math.hypot(canvas.width, canvas.height)+30
        const radius = 16
        
        const health = 20
        const color = `hsl(0, 100%, ${health}%)`
        
        const angle = Math.atan2(canvas.height/2-y,canvas.width/2-x)
        const velocity = 1
        enemies.push(new SnakeEnemy(x,y,health,color,velocity,angle))
    },3000)
}

function animate() {
    let animationId = requestAnimationFrame(animate)
    c.fillStyle = "rgba(0,0,0,0.2)"
    c.fillRect(0,0,canvas.width,canvas.height)

    

    // draw everything
    particles.forEach((particle,index) => {
        if (particle.alpha <= 0) {
            particles.splice(index,1)
        } else {
            particle.update()
        }
    })
    projectiles.forEach((projectile, index) => {
        projectile.update()
        
        // Remove projectiles that go out of view
        if (projectile.x - projectile.radius < 0 || projectile.x + projectile.radius > canvas.width || projectile.y - projectile.radius < 0 || projectile.y + projectile.radius > canvas.height) {
            projectiles.splice(index,1)
        }
    })
    player.update(c,keys)
    enemies.forEach((enemy, index) => {
        enemy.update(c, player)
        
        // If an enemy hits the player, game over, show start screen with score
        const dist = Math.hypot(player.x-enemy.x, player.y - enemy.y)
        if (dist - enemy.radius - player.radius < -5) {
            cancelAnimationFrame(animationId)
            canvas.style.filter = "blur(1px)";
            startScreen.style.display = "flex"
            finalScoreDislplay.innerHTML = score
        }
        
        // If an enemy is hit by a projectile { remove both }
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x-enemy.x, projectile.y - enemy.y)
            // If an enemy is hit by a projectile
            if (dist - enemy.radius - projectile.radius < 1) {
                enemy.x += projectile.velocity.x;
                enemy.y += projectile.velocity.y
                // Explosion
                explosionSound.play();
                const particleColor = `hsl(${Math.random()*30},100%,50%)`
                for (let i=0; i<enemy.radius; i++) {
                    const particleAngle = Math.random()*2*Math.PI
                    const particleVelocity = Math.random()*2.5
                    particles.push(
                        new Particle(projectile.x,projectile.y, Math.random() * 3, particleColor, {
                            x: Math.cos(particleAngle) * particleVelocity, 
                            y: Math.sin(particleAngle) * particleVelocity
                        })
                    )
                }
                // If an enemy is strong, make it weaker
                if (enemy.health > 1) {
                    // Increase score counter
                    score += projectile.damage*10
                    scoreCounter.innerHTML = score
                    gsap.to(enemy, {
                        health: enemy.health-projectile.damage
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                } else { // If an enemy is weak, make it disappear
                    // Increase score counter
                    
                    score += 100
                    scoreCounter.innerHTML = score
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }
            }
        })
        
    })

    // screenshake
    let amp = 5
    canvas.style.filter = "blur(" + screenShake + "px)";
    if (screenShake > 0) {
        screenShake -= 0.05;
        let screenAngle = (Math.random() * 2) * screenShake
        let screenX = (Math.random() * amp * 2 - amp) * screenShake; // random position, bias on x
        let screenY = (Math.random() * amp - amp*0.5) * screenShake;
        canvas.style.transform = "rotate(" + screenAngle + "deg) translate(" + screenX + "px," + screenY + "px)"
    } else {
        canvas.style.transform = "matrix(1,0,0,1,0,0)";
    }
}

window.addEventListener('click', (event) => {
    screenShake = 1;
    // shake(canvas, 5);
    let angle = Math.atan2(event.clientY-player.y,event.clientX-player.x)
    let speed = 5
    if (player.weapons[player.weapon].type == "machine-gun") {
        speed = 7
    }
    player.dx -= Math.cos(angle)*.1
    player.dy -= Math.sin(angle)*.1
    let radius = 5
    projectiles.push(
        new Projectile(
        player.x + Math.cos(angle)*(player.radius-radius), 
        player.y + Math.sin(angle)*(player.radius-radius), 
        radius, 
        'blue', 
        {
            x:Math.cos(angle)*speed+player.dx,
            y:Math.sin(angle)*speed+player.dy
        },
        player.weapons[player.weapon].damage,
        player.weapons[player.weapon].type
    ))
    if (player.weapons[player.weapon].type == "machine-gun") {
        projectiles.push(
            new Projectile(
            player.x + Math.cos(angle)*(player.radius-radius), 
            player.y + Math.sin(angle)*(player.radius-radius), 
            radius, 
            'blue', 
            {
                x:Math.cos(angle+Math.PI/12)*speed+player.dx,
                y:Math.sin(angle+Math.PI/12)*speed+player.dy
            },
            player.weapons[player.weapon].damage,
            player.weapons[player.weapon].type
        ));
        projectiles.push(
            new Projectile(
            player.x + Math.cos(angle)*(player.radius-radius), 
            player.y + Math.sin(angle)*(player.radius-radius), 
            radius, 
            'blue', 
            {
                x:Math.cos(angle-Math.PI/12)*speed+player.dx,
                y:Math.sin(angle-Math.PI/12)*speed+player.dy
            },
            player.weapons[player.weapon].damage,
            player.weapons[player.weapon].type
        ));
    }
})

startGameBtn.addEventListener("click", () => {
    init()
    animate()
    spawnEnemies()
    
    startScreen.style.display = "none"
})


// window.addEventListener('keydown', (event) => {
//     let key = event.key
//     if (key == "ArrowUp" || key == "w") {
//         player.dy -= 1
//     }
//     if (key == "ArrowDown" || key == "s") {
//         player.dy += 1
//     }
//     if (key == "ArrowLeft" || key == "a") {
//         player.dx -= 1
//     }
//     if (key == "ArrowRight" || key == "d") {
//         player.dx += 1
//     }
//     if (key == " ") {
//         player.weapon += 1
//         if (player.weapon >= player.weapons.length) {
//             player.weapon = 0;
//         }
//     }
// })
let keys = [];
window.addEventListener('keydown', e => {
    if (keys.indexOf(e.key) ===  -1) {keys.push(e.key);}
    if (e.key == " ") {
        player.weapon += 1
        if (player.weapon >= player.weapons.length) {
            player.weapon = 0;
        }
    }
});
window.addEventListener('keyup', e => {
    const index = keys.indexOf(e.key);
    if (index > -1) {keys.splice(index)}
});
