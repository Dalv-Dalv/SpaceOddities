const DEG2RAD = 0.0174532925;
var timescale = 1.0;
var maxTimestep = 0.05;

var player = {
    posX: 0.0,
    posY: 0.0,
    rot: 0,
    throttle: 0,
    thrustForce: 0.005,
    speedX: 0,
    speedY: 0,
    mass: 1,
    grade: "n", // Differentiates between prograde, retrograde, radial in, radial out, and normal controls
    gradeOffs: 0,
    increaseThrottle: function(amount){
        if(Math.abs(amount) < 0.1) return;

        this.throttle = Math.min(Math.max(0, this.throttle + amount), 100);

        const event = new CustomEvent("onThrottleChanged", {
            detail:{value:this.throttle}
        });
        document.dispatchEvent(event);
    },
    setGrade: function(grade){
        this.grade = grade;
        switch(grade){
            case "n":
                this.gradeOffs = 0;
                break;
            case "p":
                this.gradeOffs = 0;
                break;
            case "r":
                this.gradeOffs = 180;
                break;
            case "o":
                this.gradeOffs = 90;
                break;
            case "i":
                this.gradeOffs = 270;
                break;
        }
    },
    setThrottle: function(to){
        this.throttle = to;

        const event = new CustomEvent("onThrottleChanged", {
            detail:{value:this.throttle}
        });
        document.dispatchEvent(event);
    },
    move: function(x, y){
        this.posX += x;
        this.posY += y;
    },
    addForce: function(force, deltaTime = 1) {
        this.speedX += (force[0] / this.mass) * deltaTime;
        this.speedY += (force[1] / this.mass) * deltaTime;
    },
    rotate: function(angle){
        this.rot = (this.rot + angle) % 360;
    },
    update: function(deltaTime){
        if (this.grade != "n"){
            var magn = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
            var velDir = [this.speedX / magn, this.speedY / magn];
            var angle = (Math.atan2(velDir[1], velDir[0]) * 180) / Math.PI + 90;
            angle += this.gradeOffs;

            this.rot = angle;
        }

        var heading = [Math.cos((this.rot - 90) * DEG2RAD), Math.sin((this.rot - 90) * DEG2RAD)]; // heading vector

        var force = ((this.throttle / 100) * this.thrustForce / this.mass) * deltaTime;

        var thrust = [heading[0] * force, heading[1] * force];

        this.speedX = this.speedX + thrust[0];
        this.speedY = this.speedY + thrust[1];

        this.move(this.speedX * deltaTime, this.speedY * deltaTime);
    }
}

var planets = [
    { x: 104, y: 341, r:50, mass: 100000, color: "#00FF70" },
    { x: 1100, y: 341, r:10, mass: 50000, color: "#CCCCCC" },
];

var ui = {
    throttleRangeFill: undefined,
    distElem: undefined,
    timescaleElem: undefined,
    initialize: function(){
        this.throttleRangeFill = document.getElementById("ui_throttleSliderFill");
        this.timescaleElem = document.getElementById("timeScale");
        this.distElem = document.getElementById("distanceToNearestPlanet");
        this.throttleRangeFill.style.height = `0%`;
        const updateThrottle = this.updateThrottleRange.bind(this);
        document.addEventListener('onThrottleChanged', updateThrottle);
    },
    updateThrottleRange: function(fill){
        fill = fill.detail.value;
        this.throttleRangeFill.style.height = `${fill}%`;
    },
    update: function(){
        this.timescaleElem.textContent = `Timescale ${timescale}x`;
        var dist = 1000000000;
        for(let i = 0; i < planets.length; i++){
            var dir = [player.posX - planets[i].x, player.posY - planets[i].y]
            let sqrDist = dir[0] * dir[0] + dir[1] * dir[1];
            if (sqrDist < dist){
                dist = sqrDist;
            }
        }
        dist = Math.sqrt(dist);
        this.distElem.textContent = `Distance to nearest planet ${Math.round(dist * 10) / 10}`;
    }
}

var canvas = {
    element: undefined,
    ctx: undefined,
    offsetX: 0,
    offsetY: 0,
    prevOffsetX: 0,
    prevOffsetY: 0,
    zoom: 1,
    isPanning: false,
    initialize: function() {
        this.element = document.getElementById("gameCanvas"); 
        var gameView = document.getElementById("gameView");
        this.element.width = gameView.offsetWidth;
        this.element.height = gameView.offsetHeight;
        this.ctx = this.element.getContext("2d");

        document.addEventListener("mousedown", (e) => {
            this.isPanning = true;
            this.prevOffsetX = e.offsetX;
            this.prevOffsetY = e.offsetY;
        });

        document.addEventListener("mousemove", (e) => {
            if (this.isPanning) {
                this.offsetX += (e.offsetX - this.prevOffsetX) * (1 / this.zoom);
                this.offsetY += (e.offsetY - this.prevOffsetY) * (1 / this.zoom);
                this.prevOffsetX = e.offsetX;
                this.prevOffsetY = e.offsetY;
            }
        });
        document.addEventListener("mouseup", (e) => {
            this.isPanning = false;
        });
        document.addEventListener("wheel", (e) => {
            e.preventDefault();
            this.zoom -= e.deltaY * 0.005;   
            this.zoom = Math.max(this.zoom, 0.1);
            console.log(this.zoom);
        });
    },
    update: function(timestamp){
        this.ctx.save();

        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
        
        const invZoom = 1 / this.zoom;
        this.ctx.translate(this.element.width / 2, this.element.height / 2);
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.translate(-this.element.width / 2 + this.offsetX, -this.element.height / 2 + this.offsetY);

        this.ctx.save();
        var predictionPoints = simulateAhead(0.694, 5000, 30);
        this.ctx.strokeStyle = "rgba(255,220,0, 0.3)";
        this.ctx.lineWidth = 2 * invZoom;
        path = new Path2D();
        path.moveTo(player.posX + 25, player.posY + 25);
        
        for (let i = 1; i < predictionPoints.length; i++) {
            path.lineTo(predictionPoints[i][0] + 25, predictionPoints[i][1] + 25);
        }

        this.ctx.stroke(path);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(player.posX + 25, player.posY + 25);
        this.ctx.rotate(player.rot * DEG2RAD);

        this.ctx.fillStyle = "white";

        var path = new Path2D();
        var size = 0.3 * invZoom;
        path.moveTo(-25 * size, 25 * size);
        path.lineTo(0, -50 * size);
        path.lineTo(25 * size, 25 * size);
        this.ctx.fill(path);

        this.ctx.translate(-player.posX - 25, -player.posY - 25);
        this.ctx.restore();

        for (let i = 0; i < planets.length; i++) {
            const circle = new Path2D();
            this.ctx.fillStyle = planets[i].color;
            circle.arc(planets[i].x + 25, planets[i].y + 25, planets[i].r, 0, 2 * Math.PI);
            this.ctx.fill(circle);
        }

        this.ctx.restore();
    }
};

window.addEventListener("load", main);
function main() {
    canvas.initialize();

    ui.initialize();

    var closePanel =  document.getElementById("closePanel");
    closePanel.onclick = () => {
        requestAnimationFrame(gameLoop);
        document.getElementById("introPanel").classList.add("hide");
    };

    document.body.onkeydown = handlePlayerInputsDown;
    document.body.onkeyup = handlePlayerInputsUp;

    // Put player in a stable circular orbit
    player.posX = planets[0].x;
    player.posY = planets[0].y + 100;

    player.speedX = 0.825;
}

function calculateGForce(x, y, mass){
    var res = [0, 0];
    const G = 0.00000667;
    for(let i = 0; i < planets.length; i++){
        var dir = [planets[i].x - x, planets[i].y - y];
        
        let dist = (dir[0] * dir[0]) + (dir[1] * dir[1]);
        let force = G * mass * planets[i].mass / dist;

        dir[0] *= force;
        dir[1] *= force;

        res[0] += dir[0];
        res[1] += dir[1];
    }

    return res;
}

function simulateAhead(timestep, steps, saveEveryOtherXstep) {
    var points = [];
    var simPlayer = Object.assign({}, player);
    simPlayer.throttle = 0;

    var saveStep = 0;
    var time = 0;
    while(steps > 0){
        var gforce = calculateGForce(simPlayer.posX, simPlayer.posY, simPlayer.mass);
        simPlayer.addForce(gforce, timestep);

        simPlayer.update(timestep);

        time += timestep;

        if(saveStep == 0){
            var pos = [simPlayer.posX, simPlayer.posY];
            points.push(pos);
        }
        steps--;
        saveStep = (saveStep + 1) % saveEveryOtherXstep;
    }
    return points;
}

var inputs = [0, 0, 0, 0]; /* up, down, left, right */
var lastTime = 0;
function gameLoop(timestamp) {
    var deltaTime = timestamp - lastTime;
    deltaTime *= 0.1 * timescale;
    lastTime = timestamp;

    if(isNaN(deltaTime)) requestAnimationFrame(gameLoop);
    
    canvas.update();
    ui.update();

    // Normalize inputs:
    let dir = [0, 0]; /* x, y */
    dir[0] = inputs[3] - inputs[2];
    dir[1] = inputs[0] - inputs[1];

    player.rotate(dir[0] * 2);

    player.increaseThrottle(dir[1]);

    var timeLeftToSimulate = deltaTime;
    while(timeLeftToSimulate > 0) {
        var dt = Math.min(timeLeftToSimulate, maxTimestep);
        var gforce = calculateGForce(player.posX, player.posY, player.mass);
        player.addForce(gforce, dt);

        player.update(dt);

        timeLeftToSimulate -= maxTimestep;
    }
    
    requestAnimationFrame(gameLoop);
}

function handlePlayerInputsDown(event) {
    switch(event.key){
        case "ArrowUp":
            if(inputs[0] != 0) break;
            inputs[0] = 1;
            break;
        case "ArrowDown":
            if(inputs[1] != 0) break;
            inputs[1] = 1;
            break;
        case "ArrowLeft":
            if(inputs[2] != 0) break;
            inputs[2] = 1;
            break;
        case "ArrowRight":
            if(inputs[3] != 0) break;
            inputs[3] = 1;
            break;
        case "e":
            player.setThrottle(100);
            break;
        case "q":
            player.setThrottle(0);
            break;
        case "p":
            player.setGrade("p");
            break;
        case "r":
            player.setGrade("r");
            break;
        case "o":
            player.setGrade("o");
            break;
        case "i":
            player.setGrade("i");
            break;
        case "n":
            player.setGrade("n");
            break;
        case ".":
            timescale *= 2;
            break;
        case ",":
            timescale /= 2;
            break;
        default:
            break;
    }
}
function handlePlayerInputsUp(event) {
    switch(event.key){
        case "ArrowUp":
            inputs[0] = 0;
            break;
        case "ArrowDown":
            inputs[1] = 0;
            break;
        case "ArrowLeft":
            inputs[2] = 0;
            break;
        case "ArrowRight":
            inputs[3] = 0;
            break;
        default:
            break;
    }
}