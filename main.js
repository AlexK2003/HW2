let canvasElem;
let clickFlag = false;
let rectSize = 20;


class piece { //class that repersents a puzzle piece, since we cant store objects on a canvas, we will store the bounding box of the piece, and include a function to check if a point is inside the bounding box
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    isInside(x, y) {
        if(x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
            return true;
        }
        return false;
    }

    //draw the piece on the canvas
    draw(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    //get the current cords of the piece
    getPosition() {
        return [this.x, this.y];
    }

    //get current bounds of the piece
    getBounds() {
        return [this.x, this.y, this.width, this.height];
    }


}

let pieces = [];
//pieces.push(new piece(100, 100));


function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return [x, y];
}

window.onload = function () {
    canvasElem = document.getElementById("canvas");
    console.log(canvasElem);
    canvasElem.addEventListener("mousedown", function (e) {
        console.log("piece:" + pieces[0].getPosition());
        console.log("mouse:" + getMousePosition(canvasElem, e));
        console.log("bounds:" + pieces[0].getBounds());
    }); 

    //create a piece
    let ctx = canvasElem.getContext("2d");
    pieces.push(new piece(100, 100, rectSize, rectSize));
    pieces.push(new piece(200, 200, rectSize, rectSize));
    pieces.push(new piece(300, 300, rectSize, rectSize));
    pieces.push(new piece(400, 400, rectSize, rectSize));

    pieces.forEach(function (piece) {
        piece.draw(ctx);
    });

    canvasElem.addEventListener("mousedown", function (e) {
        //console.log(getMousePosition(canvasElem, e));
        clickFlag = true;
    });
    canvasElem.addEventListener("mouseup", function (e) {
        //console.log(getMousePosition(canvasElem, e));
        clickFlag = false;
    });
    canvasElem.addEventListener("mousemove", function (e) {
        if (clickFlag) {
            //console.log(getMousePosition(canvasElem, e));
            ctx = canvasElem.getContext("2d");

            //first we check if the click is inside the piece
            for (let i = 0; i < pieces.length; i++) {
                if (pieces[i].isInside(getMousePosition(canvasElem, e)[0], getMousePosition(canvasElem, e)[1])) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    //if it is, we move the piece to the new position
                    pieces[i].x = getMousePosition(canvasElem, e)[0] - rectSize/2;
                    pieces[i].y = getMousePosition(canvasElem, e)[1] - rectSize/2;
                    pieces[i].draw(ctx);
                    console.log(pieces[i].getPosition());

                    pieces.forEach(function (piece) {    
                        piece.draw(ctx);
                    });
                    break;
                }
            }

            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            //ctx.fillRect(getMousePosition(canvasElem, e)[0] - rectSize/2, getMousePosition(canvasElem, e)[1] - rectSize/2, rectSize, rectSize );
        }
    });
}