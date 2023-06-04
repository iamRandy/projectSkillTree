// const addBut = document.getElementById("addButton");
// const friends = document.getElementById("friends");
// const newElements = document.getElementsByClassName("newElements");
var container = document.getElementById('newElements');
var addButton = document.getElementById('addButton');
var numCircles = 0; 

addButton.addEventListener('click', function() { // adding functionality to the add button so it creates a "node" 

    var multiplier = parseInt(prompt("Size of Circle:"));
    console.log('Button clicked!');

    const newCircle = document.createElement("div");
    newCircle.className = "circle";

    newCircle.id = "circle" + numCircles;
    numCircles++;

    var size = multiplier * 50;

    newCircle.style.width = size + "px";
    newCircle.style.height = size + "px";

    var randomValues = getRandom();
    var minX = randomValues[0];
    var maxX = randomValues[1];
    var minY = randomValues[2];
    var maxY = randomValues[3];

    newCircle.style.position = 'absolute';
    newCircle.style.top = getRandomValue(minY, maxY) + 'px';
    newCircle.style.left = getRandomValue(minX, maxX) + 'px';

    container.append(newCircle);
    
});

function checkCollision(circle1, circle2) { 
    var x1 = circle1.offsetLeft + circle1.offsetWidth / 2; // getting center of circle
    var y1 = circle1.offsetTop + circle1.offsetHeight / 2;
    var x2 = circle2.offsetLeft + circle2.offsetWidth / 2;
    var y2 = circle2.offsetTop + circle2.offsetHeight / 2;

    var radius1 = circle1.offsetWidth / 2;
    var radius2 = circle2.offsetWidth / 2;

    var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    return distance <= radius1 + radius2;
}


function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandom() {
    var minY = 0;
    var maxY = Math.ceil(container.clientHeight);
    var minX = 0;
    var maxX = Math.floor(container.clientWidth);

    var randomValues = [];
    randomValues.push(minX, maxX, minY, maxY);
    return randomValues;
}