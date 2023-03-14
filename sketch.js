let canvasSize = 800;
let nodeSize   = 50;
let radius     = 200;

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
    var avg = calcAverage();
    for (i in nodes) {
        fill(255, 255, 255);
        ellipse(nodes[i].x, nodes[i].y, 5, 5);
    }
    if (heldNode !== "none") {
        nodes[heldNode].dragged();
    }
    if (keyIsPressed) {
        drawEllipse();
        

    }
}

function mouseClicked() {
    if (heldNode !== "none") {
        return;
    }
    console.log("new node at "+[mouseX, mouseY]);
    nodes.push(new Node(mouseX, mouseY, nodeSize));
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

function calcDistance(x, y) {
    var sum = 0;
    for (i in nodes) {
        sum += dist(nodes[i].x, nodes[i].y, x, y);
    }
    return sum;
}

function calcAverage() {
    var sumx = 0;
    var sumy = 0;
    for (i in nodes) {
        sumx += nodes[i].x;
        sumy += nodes[i].y;
    }
    return [sumx/nodes.length, sumy/nodes.length];
}

function checkRadius(theta, center, shapeRadius, prevRad) {
    var rad = prevRad;
    var testx;
    var testy;
    var distance;
    var newradius = shapeRadius * nodes.length;

    while (rad < newradius) {
        testx = center[0] + rad * cos(theta);
        testy = center[1] + rad * sin(theta);
        distance = calcDistance(testx, testy);
        if (abs(distance - newradius) < (0.01 * newradius)) {
            curveNodes.push([testx, testy]);
            return (rad * 0.9);
        }
        rad += 1
    }
}

function drawEllipse() {
    for (var indRad = 0; indRad < radius; indRad += radius/20) {
    var theta = 0;
    
    let thetaStep = 1;
    let thetaStop = 400;
    var center = calcAverage();
    
    var prevRad = 0;
    curveNodes = [];

    noFill();
    
    while (theta <= thetaStop) {
        prevRad = checkRadius(theta, center, indRad, prevRad);
        theta += thetaStep;
    }
    
    beginShape();
    for (i in curveNodes) {
        curveVertex(curveNodes[i][0], curveNodes[i][1]);
    }
    endShape();
    }
    console.log("done");
}
