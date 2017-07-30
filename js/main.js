var robot;
var robotPath;

function init() {
    robot = new Component(30, 30, "./img/robot.png", 250, 250, "image"); 
	robotPath = new Path(80);
    mainArea.start();
}

setTimeout(function() {
    robot.update();
}, 100);  
   
var mainArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.getElementById('mainBox').appendChild(this.canvas);
        this.interval = setInterval(updateMainArea, 20);
		// Отслеживание нажатий клавиш 
			window.addEventListener('keydown', function (e) {
            e.preventDefault();
            mainArea.keys = (mainArea.keys || []);
            mainArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            mainArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop : function() {
        clearInterval(this.interval);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function Component(width, height, color, x, y, type) {
	this.type = type;
	 if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = mainArea.context;
		ctx.save();
        ctx.translate(this.x, this.y); 
        ctx.rotate(this.angle);
		if (type == "image") {
            ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
        } else {
           ctx.fillStyle = color;
		   ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height); 
        }   
    ctx.restore(); 
    }
	this.newPos = function() {
		document.getElementById("xCoordinate").innerHTML = Math.floor(robot.x);
		document.getElementById("yCoordinate").innerHTML = Math.floor(robot.y);
    }
}


function updateMainArea() {

    if (mainArea.keys && mainArea.keys[37]) { rotateRight(1);}
    if (mainArea.keys && mainArea.keys[39]) { rotateLeft(1);}
    if (mainArea.keys && mainArea.keys[38]) { moveup(1);}
    if (mainArea.keys && mainArea.keys[40]) { movedown(1);}
	
	// Столкновение с границами 
	if (robot.x < 0 + robot.width/2) {robot.x = robot.width/2}
	if (robot.x > mainArea.canvas.width - robot.width/2) {robot.x = mainArea.canvas.width - robot.width/2}
	if (robot.y < 0 + robot.height/2) {robot.y = robot.height/2}
	if (robot.y > mainArea.canvas.height - robot.height/2) {robot.y = mainArea.canvas.height - robot.height/2}
	
    robot.newPos(); 
}

function degreesToRadians(degrees) {
        return (degrees * Math.PI)/180;
}

function radiansToDegrees(radians) {
        return (radians * 180)/Math.PI;
}

function moveup(steps) {
	mainArea.clear(); 
	robot.x += steps * Math.sin(robot.angle); 
	robot.y -= steps * Math.cos(robot.angle);
	robot.update();
}

function movedown(steps) {
	mainArea.clear(); 
	robot.x -= steps * Math.sin(robot.angle); 
	robot.y += steps * Math.cos(robot.angle);
	robot.update();
}

function rotateRight(degrees) {
	mainArea.clear(); 
	robot.angle -= degreesToRadians(degrees);
	robot.update();
}

function rotateLeft(degrees) {
	mainArea.clear(); 
	robot.angle += degreesToRadians(degrees);
	robot.update();
}


 
 function drawRay() {
	 var currentRayLength = 0;
	 setInterval(function() {
		if (currentRayLength < Math.sqrt(2) * mainArea.canvas.width ){ 
			ctx.beginPath();
			ctx.moveTo(robot.x , robot.y);
			ctx.lineTo(robot.x + currentRayLength * Math.sin(robot.angle), robot.y - currentRayLength * Math.cos(robot.angle));
			ctx.strokeStyle = 'red';
			ctx.closePath();
			ctx.stroke();
			currentRayLength += 1;
		}
	 }, 1);
}

 
 function Path(length){
    this.height = length;
    this.update = function() {
	    ctx = mainArea.context;
		ctx.save();
		this.width = robot.width;
	    this.angle = robot.angle;
		this.x = robot.x + this.height * Math.sin(robot.angle) + (Math.sqrt(Math.pow(robot.width,2) + Math.pow(robot.height,2)) / 2) * Math.sin(robot.angle - Math.atan(robot.width / robot.height));
		this.y = robot.y - this.height * Math.cos(robot.angle) - (Math.sqrt(Math.pow(robot.width,2) + Math.pow(robot.height,2)) / 2) * Math.cos(robot.angle - Math.atan(robot.width / robot.height));
		ctx.fillStyle = "rgba(241, 60, 47, 0.59)";
		ctx.translate(this.x, this.y); 
		ctx.rotate(this.angle);
		ctx.fillRect(0, 0, this.width, this.height); 
		ctx.restore(); 
    }
 }

var slider1 = new Slider('#ex1');
var slider2 = new Slider('#ex2');

slider1.on("slide", robotDimensionsUpdate);
slider2.on("slide", robotDimensionsUpdate);

var slider3 = new Slider('#ex3');
var slider4 = new Slider('#ex4');

slider4.on("slide", robotDrawPath);

function robotDimensionsUpdate() {
	mainArea.clear(); 
	var slider1Value = document.getElementById("ex1").getAttribute('value');
	var slider2Value = document.getElementById("ex2").getAttribute('value');
	robot.width = slider1Value;
	robot.height = slider2Value;
	robot.update();
}

function robotDrawPath() { 
	mainArea.clear();
	var slider4Value = document.getElementById("ex4").getAttribute('value');
	robotPath.height = slider4Value;
	robot.update();
	robotPath.update();
}


function robotMove(){
	var userAngle = document.getElementById("ex3").getAttribute('value');
	var currentRotate = 0;
	
	var userMoveSteps = document.getElementById("ex4").getAttribute('value');
	var currentStepsMade = 0;
	
	var animationDelay = 50;
	
    if (userAngle > 0 ) {
		setInterval(function() {
			if (currentRotate < userAngle){ 
				rotateLeft(1);
				robotPath.update();
				currentRotate++;
			}
		}, animationDelay); 
	 }
	 else if (userAngle < 0 ) {
		 setInterval(function() {
			if (currentRotate > userAngle){ 
				rotateRight(1);
				robotPath.update();
				currentRotate--;
			}
		}, animationDelay); 
	 }
	 
	setTimeout(function() {
		setInterval(function() {
			if (currentStepsMade < userMoveSteps){ 
				moveup(1);
				robotPath.height-=1;
				robotPath.update();
				currentStepsMade++;
				
			}
		}, animationDelay); 
	}, Math.abs(userAngle) * animationDelay);

}