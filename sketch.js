let canvasSize = 800;
let nodeSize   = 50;

var heldNode;

var nodes = [];


function setup() {
    createCanvas(canvasSize, canvasSize);
    textSize(32);
    textAlign(CENTER,CENTER);
    strokeWeight(3);
}

function draw() {
    background(0, 0, 0);
    for (i in nodes) {
        fill(255, 255, 255);
        ellipse(nodes[i].x, nodes[i].y, 50, 50);
    }
}

function mouseClicked() {
    console.log("new node at "+[mouseX, mouseY]);
    nodes.push(new Node(mouseX, mouseY, nodeSize));
}

function mouseDragged() {
    for (i in nodes) {
        if (nodes[i].hovering()) {

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
