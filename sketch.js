let canvasSize = 800;
let nodeSize   = 50;
let radius     = 400;

var heldNode = "none";
var curveNodes = [];

var nodes = [];


function setup() {
    createCanvas(canvasSize, canvasSize);
    textSize(32);
    textAlign(CENTER,CENTER);
    strokeWeight(3);
}

function draw() {
    background(0, 0, 0);
    var avg = calcAverage();
    point(avg[0], avg[1]);
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

function checkRadius(theta, center, prevRad) {
    // console.log(theta);
    var rad = prevRad;
    var testx;
    var testy;
    var distance;
    var newradius = radius * nodes.length;

    while (rad < newradius) {
        testx = center[0] + rad * cos(theta);
        testy = center[1] + rad * sin(theta);
        console.log(testx, testy);
        distance = calcDistance(testx, testy);
        if (abs(distance - newradius) < (0.01 * newradius)) {
            curveNodes.push([testx, testy]);
            return (rad * 0.9);
        }
        rad += 1
    }
}

function drawEllipse() {
    var theta = 0;
    
    let thetaStep = 1;
    let thetaStop = 360;
    var center = calcAverage();
    
    var prevRad = 0;
    curveNodes = [];

    noFill();
    stroke(255, 0, 0);

    while (theta <= thetaStop) {
        prevRad = checkRadius(theta, center, prevRad);
        theta += thetaStep;
    }
    
    beginShape();
    for (i in curveNodes) {
        curveVertex(curveNodes[i][0], curveNodes[i][1]);
    }
    endShape();
    console.log("done");
}
