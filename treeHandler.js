var container = document.getElementById('newElements');
var addButton = document.getElementById('addButton');
var numCircles = 0; 
var curCircles = []; // List of all the current trees on the screen

addButton.addEventListener('click', function() { // adding functionality to the add button so it creates a "node" 
    var circleCreated = false; // Flag will be set to true when a new circle has been created that does not collide with any other circle in the scene
    var newCircle = null; // Temp variable for return statement

    while(!circleCreated){ // While a new circle has not been created yet...
        if(curCircles.length>0){ // Check if there are any circles in the space
            newCircle = createCircle(); // Create a new circle
            for (let cir of curCircles) { // Loop through all the current circles in the space
                if (checkCollision(cir, newCircle)) { // Check for collision with the new circle and all circles in the space (TODO)
                    console.log("collision detected!");
                    circleCreated = true;
                    break; // Exit the loop early if a collision is detected
                } else {
                    circleCreated = true;
                }
            }
            
        } else { // If this is the first circle being created
            newCircle = createCircle();
            circleCreated = true;
        }
    }

    if (newCircle) {
        container.append(newCircle);
    } else {
        console.warn("New Circle Could Not Be Created.");
    }
    
});

function createCircle() {

    const newCircle = document.createElement("div");
    newCircle.className = "circle";

    newCircle.id = "circle" + numCircles;
    numCircles++;

    var size = 100;

    newCircle.style.width = size + "px";
    newCircle.style.height = size + "px";

    var randomValues = getRandom();
    
    var offset = 30;
    var minX = randomValues[0];
    var maxX = randomValues[1];
    var minY = randomValues[2];
    var maxY = randomValues[3];

    newCircle.style.position = 'absolute';
    newCircle.style.top = getRandomValue(minY + offset, maxY - offset) + 'px';
    newCircle.style.left = getRandomValue(minX + offset, maxX - offset) + 'px';
    newCircle.classList.add("buttonEffect")
    
    curCircles.push(newCircle); // Pushes the new circle to the array of current circles to keep track
    container.append(newCircle); // Append the circle element to the container

    var startPosX = newCircle.offsetLeft;
    var startPosY = newCircle.offsetTop;
    var targetPosX = (window.innerWidth - size) / 2;
    var targetPosY = (window.innerHeight - size) / 2;
    var duration = 2000; // Animation duration in milliseconds
    var startTime = null;

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var newPosLeft = startPosX + (targetPosX - startPosX) * progress;
        var newPosTop = startPosY + (targetPosY - startPosY) * progress;
        
        // Check for collisions with other bubbles
        var hasCollision = false;
        for (var i = 0; i < curCircles.length; i++) {
          if (newCircle !== curCircles[i] && checkCollision(newCircle, curCircles[i])) {
            hasCollision = true;
            return;
          }
        }
        
        if (hasCollision) {
          // Handle collision by slightly adjusting the position
          newPosLeft += getRandomValue(-10, 10);
          newPosTop += getRandomValue(-10, 10);
        }
        
        newCircle.style.left = newPosLeft + "px";
        newCircle.style.top = newPosTop + "px";
    
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }
    
      requestAnimationFrame(animate);
    
      return newCircle;

}

function checkCollision(circle1, circle2) { 
    var spacing = 10;
    var x1 = circle1.offsetLeft + circle1.offsetWidth / 2; // getting center of circle
    var y1 = circle1.offsetTop + circle1.offsetHeight / 2;
    var x2 = circle2.offsetLeft + circle2.offsetWidth / 2;
    var y2 = circle2.offsetTop + circle2.offsetHeight / 2;

    var radius1 = circle1.offsetWidth / 2;
    var radius2 = circle2.offsetWidth / 2;

    var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // console.log(curCircles);

    // console.log(`Circle1: ${circle1.offsetLeft} .. ${circle1.offsetWidth}`);
    // console.log(`Circle2: ${circle2.offsetLeft} .. ${circle2.offsetWidth}`);
    // console.log(`X1: ${x1} y1: ${y1} x2: ${x2} y2: ${y2}`);
    return distance <= radius1 + radius2 + spacing;
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