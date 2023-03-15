let canvasSize = 800;
let nodeSize   = 50;

var heldNode = "none";
var curveNodes = [];

var nodes = [];


function setup() {
    createCanvas(canvasSize, canvasSize);
    textSize(32);
    textAlign(CENTER,CENTER);
    angleMode(DEGREES);
    strokeWeight(3);
    stroke(255, 0, 0);
}

function draw() {
    background(0, 0, 0);

    // draw each node/focus
    for (i in nodes) {
        fill(255, 255, 255);
        ellipse(nodes[i].x, nodes[i].y, 5, 5);
    }

    // if holding a node, change its x and y to mouse
    if (heldNode !== "none") {
        nodes[heldNode].dragged();
    }

    drawEllipse();
}

function mousePressed() {
    // exit conditions if hovering over a node or a node is already held
    for (i in nodes) {
        if (nodes[i].hovering()) {
            return;
        }
    }
    if (heldNode !== "none") {
        return;
    }
    
    // creates a new node
    if (mouseX >= 0 && mouseX <= canvasSize
     && mouseY >= 0 && mouseY <= canvasSize) {
        console.log("new node at "+[mouseX, mouseY]);
        nodes.push(new Node(mouseX, mouseY, nodeSize));
    }
}

function mouseDragged() {
    if (heldNode !== "none") {
        return;
    }

    for (i in nodes) {
        if (nodes[i].hovering()) {
            heldNode = i;
            break;
        }
    }
}

function mouseReleased() {
    heldNode = "none";
}

function mouseMoved() {
    for (i in nodes) {
        if (nodes[i].hovering()) {
            cursor(HAND);
            return;
        }
    }
    cursor(ARROW);
}

// sum of the distance from a point to each of the foci
function sumDistance(x, y) {
    var sum = 0;
    for (i in nodes) {
        sum += dist(nodes[i].x, nodes[i].y, x, y);
    }
    return sum;
}

// product fo the distance from a point to each of the foci
function multiplyDistance(x, y) {
    var prod = 1;
    for (i in nodes) {
        prod *= dist(nodes[i].x, nodes[i].y, x, y);
    }
    return prod;
}

// average position of the foci. used as the origin of the polar graph of the ellipse
function calcAverage() {
    var sumx = 0;
    var sumy = 0;
    for (i in nodes) {
        sumx += nodes[i].x;
        sumy += nodes[i].y;
    }
    return [sumx/nodes.length, sumy/nodes.length];
}

// draws an ellipse of the points whose sum of the distance to each focus is a constant
function sumCheckRadius(theta, center, accuracy, shapeRadius, prevRad) {
    var rad = prevRad;
    var testx;
    var testy;
    var distance;
    var error;
    var newradius = shapeRadius * nodes.length;
    var lowBoundMet = false;
    var lowBoundRad;

    while (rad < newradius) {
        // test each point at a given angle theta
        testx = center[0] + rad * cos(theta);
        testy = center[1] + rad * sin(theta);
        distance = sumDistance(testx, testy);

        error = abs(distance - newradius);
        // if the error is within the margin of error, add the point to the set
        if (error < (accuracy * newradius)) {
            curveNodes.push([testx, testy]);
            lowBoundRad = rad;
            // the curve is continuous, the starting point of search for the next angle should be similar
            return (lowBoundRad * 0.9), error;
        }
        rad += 1
    }
}

// draws an ellipse of the points whose product of the distance to each focus is a constant
function prodCheckRadius(theta, center, accuracy, shapeRadius, prevRad) {
    var rad = prevRad;
    var testx;
    var testy;
    var distance;
    var error;
    var newradius = pow(shapeRadius, nodes.length);
    var lowBoundMet = false;
    var lowBoundRad;

    while (rad < newradius) {
        testx = center[0] + rad * cos(theta);
        testy = center[1] + rad * sin(theta);
        distance = multiplyDistance(testx, testy);
        
        error = abs(distance - newradius);
        if (error < (accuracy * newradius)) {
            curveNodes.push([testx, testy]);
            lowBoundRad = rad;
            return (lowBoundRad * 0.9), error;
        }
        rad += 1
        if ((rad + 5) > newradius) {
            return newradius, error;
        }
    }
}

function drawEllipse() {
    var radius = parseInt(document.getElementById("radius").value);
    var thetaStep = parseInt(document.getElementById("thetaStep").value);
    var accuracy = parseInt(document.getElementById("accuracy").value)/1000;
    var lines = parseInt(document.getElementById("lines").value);

    var theta = 0;
    let thetaStop = 400;
    var prevRad;
    var error;

    for (var indRad = 0; indRad <= radius; indRad += radius/lines) {
        theta = 0;
        center = calcAverage();
        error = 0;
        prevRad = 0;
        curveNodes = [];

        noFill();

        var operationRadios = document.getElementsByName("operation");
        var selectedOperation;
        
        for (var i = 0; i < operationRadios.length; i++) {
            if (operationRadios[i].checked) {
                selectedOperation = operationRadios[i].value;
                break;
            }
        }
    
        // searches each theta for a matching radius with minimal error
        do {
            if (selectedOperation === "sum") {
                prevRad, error = sumCheckRadius(theta, center, accuracy, indRad, prevRad);
            } else if (selectedOperation === "product") {
                prevRad, error = prodCheckRadius(theta, center, accuracy, indRad, prevRad);
            }
            theta += thetaStep;
        } while (theta <= thetaStop);

        // draws the shape from the set of collected points
        beginShape();
            for (i in curveNodes) {
                curveVertex(curveNodes[i][0], curveNodes[i][1]);
            }
        endShape();
    }
}
