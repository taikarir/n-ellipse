class Node {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.r = size/2;
    }
    hovering() {
        if (dist(mouseX, mouseY, this.x, this.y) <= this.r) {
            return true;
        } else {
            return false;
        }
    }
}
