let canvas = document.getElementById("metaballsCanvas");
let ctx = canvas.getContext("2d");
let blobs = [];

function randint(a, b){
    return Math.random() * (b - a) + a;
}

function clamp(x, a, b){
    if(x < a) return a;
    if(x > b) return b;
    return x;
}

function randomChoice(arr){
    return arr[Math.floor(arr.length * Math.random())];
}

function HSBtoRGB(h, s, b){
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [Math.floor(255 * f(5)), Math.floor(255 * f(3)), Math.floor(255 * f(1))];
}

class Blob {
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
        let angle = Math.random() * 2 * Math.PI;
        this.xspeed = randint(1, 4) * Math.cos(angle);
        this.yspeed = randint(1, 4) * Math.sin(angle);
        this.r = randint(120, 240);
    }
    update(){
        this.x += this.xspeed;
        this.y += this.yspeed;
        if(this.x > canvas.width || this.x < 0) this.xspeed *= -1;
        if(this.y > canvas.height || this.y < 0) this.yspeed *= -1;
    }
    show(){
        ctx.beginPath();
        ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

function setup(){
    blobs = [];
    for(i = 0; i < 6; i++) { 
        let color = randomChoice([[255, 0, 0], [0, 255, 0], [0, 0, 255]]);
        blobs.push(new Blob(randint(0, canvas.width), randint(0, canvas.height), color));
    }
}
    
function draw(){
    //ctx.fillStyle = "#999999";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    let imageData = ctx.createImageData(canvas.width, canvas.height);
    let pixels = imageData.data;
    for(x = 0; x < canvas.width; x++){
        for(y = 0; y < canvas.width; y++){
            let idx = (y * canvas.width + x) * 4;
            let sum = 0;
            for(i = 0; i < blobs.length; i++){
                let xdif = x - blobs[i].x;
                let ydif = y - blobs[i].y;
                let dist = Math.sqrt((xdif * xdif) + (ydif * ydif));
                sum += 20 * blobs[i].r / dist;
            }
            sum = clamp(sum, 0, 255);
            let [r, g, b] = HSBtoRGB(sum, 100, 100);
            pixels[idx] = r;
            pixels[idx + 1] = g;
            pixels[idx + 2] = b;
            pixels[idx + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);

    for(i = 0; i < blobs.length; i++)
        blobs[i].update();
}

let started = false;
let paused = true;
let interval = null;
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
startButton.addEventListener("click", function(){
    setup();
    interval = setInterval(draw, 10);
    started = true;
    paused = false;
});
pauseButton.addEventListener("click", function(){
    if(!started) return;
    if(paused) interval = setInterval(draw, 10);
    else clearInterval(interval);
    paused = !paused;
});

