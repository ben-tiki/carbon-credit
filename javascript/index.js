// ------------------------------------ CANVAS ------------------------------------ 
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var nav = document.getElementById('nav');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// ------------------------------------ BALLS -------------------------------------
var x_pos = 100,
    y_pos = canvas.height - 225,
    x_vel = -2.5,
    y_vel = -2.5,
    radius = 5,
    mass = 1,
    color = '#ff745c';

// get factory png dimensions
var factory = document.getElementById('factory'),
    factory_x = factory.getBoundingClientRect().left,
    factory_y = factory.getBoundingClientRect().top,
    factory_width = factory.getBoundingClientRect().width,
    factory_height = factory.getBoundingClientRect().height;

var tree = document.getElementById('renewable'),
    tree_x = tree.getBoundingClientRect().left,
    tree_y = tree.getBoundingClientRect().top,
    tree_width = tree.getBoundingClientRect().width,
    tree_height = tree.getBoundingClientRect().height;

class Ball {
    constructor(x, y, radius, x_vel, y_vel, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.x_vel = x_vel;
        this.y_vel = y_vel;
        this.mass = mass;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.draw();
        this.bounceWall();
        this.bounceFactory();
        this.collideBall();
        if (!hideRenewable) {this.absorbBall();}
        this.x += this.x_vel;
        this.y += this.y_vel;
    }

    bounceWall() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.x_vel = -this.x_vel;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < nav.offsetHeight) {
            this.y_vel = -this.y_vel;
        }
    }

    collideBall() {
        for (let i = 0; i < balls.length; i++) {
            for (let j = i; j < balls.length; j++) {
                if (i !== j) {

                    let x_vel = balls[i].x - balls[j].x;
                    let y_vel = balls[i].y - balls[j].y;

                    let distance = Math.sqrt(x_vel ** 2 + y_vel ** 2);

                    if (distance < balls[i].radius + balls[j].radius) {

                        let angle = Math.atan2(y_vel, x_vel);

                        let magnitude1 = Math.sqrt(balls[i].x_vel ** 2 + balls[i].y_vel ** 2);
                        let magnitude2 = Math.sqrt(balls[j].x_vel ** 2 + balls[j].y_vel ** 2);

                        let direction1 = Math.atan2(balls[i].y_vel, balls[i].x_vel);
                        let direction2 = Math.atan2(balls[j].y_vel, balls[j].x_vel);

                        let velocityX1 = magnitude1 * Math.cos(direction1 - angle);
                        let velocityY1 = magnitude1 * Math.sin(direction1 - angle);
                        let velocityX2 = magnitude2 * Math.cos(direction2 - angle);
                        let velocityY2 = magnitude2 * Math.sin(direction2 - angle);

                        balls[i].x_vel = Math.cos(angle) * velocityX2 + Math.cos(angle + Math.PI / 2) * velocityY1;
                        balls[i].y_vel = Math.sin(angle) * velocityX2 + Math.sin(angle + Math.PI / 2) * velocityY1;
                        balls[j].x_vel = Math.cos(angle) * velocityX1 + Math.cos(angle + Math.PI / 2) * velocityY2;
                        balls[j].y_vel = Math.sin(angle) * velocityX1 + Math.sin(angle + Math.PI / 2) * velocityY2;

                    }
                }
            }
        }
    }

    bounceFactory() {

        if (this.x + this.radius > factory_x && this.x - this.radius < factory_x + factory_width) {
            if (this.y + this.radius > factory_y && this.y - this.radius < factory_y + factory_height) {
                this.y_vel = -this.y_vel;
            }
        }

        if (this.x + this.radius > factory_x && this.x - this.radius < factory_x + factory_width) {
            if (this.y + this.radius > factory_y && this.y - this.radius < factory_y + factory_height) {
                this.x_vel = -this.x_vel;
            }
        }
    }

    absorbBall() {

        if (this.x + this.radius > tree_x && this.x - this.radius < tree_x + tree_width) {
            if (this.y + this.radius > tree_y && this.y - this.radius < tree_y + tree_height) {
                balls.splice(balls.indexOf(this), 1);
                ++nettedTons;
            }
        }
    }
}
                            
// -------------------------------- PAGE CONTEXT ----------------------------------
var tonnsElement = document.getElementById('tonns');
var periodNumberElement = document.getElementById('periodNumber');
var nettedElement = document.getElementById('netted');

var periodNumber = 1;
var nettedTons = 0;

// ----------------------------- BALL INSTANTIATION --------------------------------
// create balls at random time intervals
balls = [];
var baseMiliSeconds= 500;
var constantMiliSeconds = 500;
function doSomething() {}

(function loop() {
    var rand = Math.round(Math.random() * (baseMiliSeconds)) + constantMiliSeconds;
    setTimeout(function () {
        balls.push(new Ball(x_pos, y_pos, radius, x_vel, y_vel, color));
        loop();
    }, rand);
})();

// every 5 seconds increase period number
setInterval(() => {
    periodNumber++;
    periodNumberElement.innerHTML = periodNumber;
    tonnsElement.innerHTML = balls.length;
    nettedElement.innerHTML = nettedTons;
}, 500);

// ---------------------------------- ANIMATION -----------------------------------
function animate() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball) => {
        ball.update();
    });
    requestAnimationFrame(animate);
}

animate();