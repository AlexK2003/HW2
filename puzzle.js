let canvasElem;
let clickFlag = false;
let clickedpiece = -1;
let rectSize = 20;
let gridSize = 3;
let image;


class slot { //a slot is a rectangle that can be used to place a piece, will store a correctId, a size, and a position, additionally, it will have an activation box, slightly smaller than the slot
    constructor(x, y, width, height, correctId) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.correctId = correctId;
        this.storedPiece = null;
    }


    //are the given coordinates inside the slot
    isInside(x, y) {
        if(x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
            return true;
        }
        return false;
    }

    //draw the slot on the canvas
    draw(ctx) {
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2; // optional, makes the border more visible
        ctx.strokeRect(this.x, this.y, this.width, this.height);

    }
    //get the current cords of the slot
    getPosition() {
        return [this.x, this.y];
    }

    //get current bounds of the slot
    getBounds() {
        return [this.x, this.y, this.width, this.height];
    }
    //get the correctId of the slot
    getCorrectId() {
        return this.correctId;
    }
}

class piece { 
    constructor(x, y, width, height, id, image, sx, sy, sWidth, sHeight) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id;

        this.image = image;
        this.sx = sx;
        this.sy = sy;
        this.sWidth = sWidth;
        this.sHeight = sHeight;
    }

    isInside(x, y) {
        return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.sx, this.sy, this.sWidth, this.sHeight, // source crop
            this.x, this.y, this.width, this.height       // destination
        );
    }

    getPosition() { return [this.x, this.y]; }
    getBounds() { return [this.x, this.y, this.width, this.height]; }
}

let pieces = [];
let slots = [];

//check if each slot has a piece with the correct id
function checkComplete() {
    let complete = true;
    for(let i = 0; i < slots.length; i++) {
        if(slots[i].correctId != slots[i].storedPiece) {
            complete = false;
            break;
        }
    }

    if(complete) {
        document.getElementById("puzzleStatus").innerText = "Puzzle Status: Complete"
    }
    else {
        document.getElementById("puzzleStatus").innerText = "Puzzle Status: Incomplete"
    }
    return complete;
}

function drawBoard() {
    let ctx = canvasElem.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    slots.forEach(function (slot) {
        slot.draw(ctx);
    });
    pieces.forEach(function (piece) { 
        piece.draw(ctx);
    });
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return [x, y];
}

function resetPuzzle(newGridSize) {
    gridSize = newGridSize;
    pieces = [];
    slots = [];

    const ctx = canvasElem.getContext("2d");

    const pieceWidth = image.width / gridSize;
    const pieceHeight = image.height / gridSize;
    rectSize = pieceWidth;

    let id = 0;

    // Create shuffled pieces
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let px = Math.random() * (canvasElem.width - pieceWidth);
            let py = Math.random() * (canvasElem.height - pieceHeight);

            pieces.push(new piece(
                px, py,
                pieceWidth, pieceHeight,
                id,
                image,
                col * pieceWidth, row * pieceHeight,
                pieceWidth, pieceHeight
            ));
            id++;
        }
    }

    // Create slots in a grid layout
    const totalGridWidth = pieceWidth * gridSize;
    const totalGridHeight = pieceHeight * gridSize;

    const startX = (canvasElem.width - totalGridWidth) / 2;
    const startY = (canvasElem.height - totalGridHeight) / 2;

    id = 0;
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let sx = startX + col * pieceWidth;
            let sy = startY + row * pieceHeight;

            slots.push(new slot(sx, sy, pieceWidth, pieceHeight, id));
            id++;
        }
    }
    drawBoard();
}

window.onload = function () {
    image = new Image();
    image.src = 'dog.jpg';
    image.onerror = function () {
        console.error("Failed to load image.");
    };
    canvasElem = document.getElementById("canvas");
    console.log(canvasElem);

    canvasElem.addEventListener("mousedown", function (e) {
        console.log("piece:" + pieces[0].getPosition());
        console.log("mouse:" + getMousePosition(canvasElem, e));
        console.log("bounds:" + pieces[0].getBounds());
        console.log(pieces[0].isInside(getMousePosition(canvasElem, e)[0], getMousePosition(canvasElem, e)[1]));
    }); 

    image.onload = function () {
        console.log("image loaded");
        const ctx = canvasElem.getContext("2d");
        const pieceWidth = image.width / gridSize;
        const pieceHeight = image.height / gridSize;
        rectSize = pieceWidth;

        // Create pieces with correct slices
        let id = 0;
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                let px = Math.random() * (canvasElem.width - pieceWidth);
                let py = Math.random() * (canvasElem.height - pieceHeight);

                pieces.push(new piece(px, py, pieceWidth, pieceHeight, id, image, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight ));
                id++;
            }
        }

        // Create matching slots
        const totalGridWidth = pieceWidth * gridSize;
        const totalGridHeight = pieceHeight * gridSize;

        const startX = (canvasElem.width - totalGridWidth) / 2;
        const startY = (canvasElem.height - totalGridHeight) / 2;

        id = 0;
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                let sx = startX + col * pieceWidth;
                let sy = startY + row * pieceHeight;

                slots.push(new slot(sx, sy, pieceWidth, pieceHeight, id));
                id++;
            }
        }
        drawBoard();
    };

    canvasElem.addEventListener("mousedown", function (e) {
        clickFlag = true;
        //if a piece started inside a slot remove it as the stored peice
        slots.forEach(function (slot) {
            if(slot.isInside(getMousePosition(canvasElem, e)[0], getMousePosition(canvasElem, e)[1])) {
                slot.storedPiece = null;
            }
        });

        for(let i = 0; i < pieces.length; i++) {
            //if a piece is clicked store its index
            if(pieces[i].isInside(getMousePosition(canvasElem, e)[0], getMousePosition(canvasElem, e)[1])) {
                clickedpiece = i;

                break;
            }
            
        }
    });
    canvasElem.addEventListener("mouseup", function (e) {
        clickFlag = false;

        //if the clicked piece is inside of a slot, snap it to the slot
        for (let i = 0; i < slots.length; i++) {
            if (slots[i].isInside(getMousePosition(canvasElem, e)[0], getMousePosition(canvasElem, e)[1])) {                
                pieces[clickedpiece].x = slots[i].x;
                pieces[clickedpiece].y = slots[i].y;
                drawBoard();

                slots[i].storedPiece = clickedpiece;
                break;
            }
        }


        clickedpiece = -1;

        console.log(checkComplete());

    });
    canvasElem.addEventListener("mousemove", function (e) {
        if (clickFlag) {
            ctx = canvasElem.getContext("2d");
            //if a piece is clicked, move it
            if(clickedpiece != -1) {
                pieces[clickedpiece].x = getMousePosition(canvasElem, e)[0] - rectSize/2;
                pieces[clickedpiece].y = getMousePosition(canvasElem, e)[1] - rectSize/2;

                drawBoard();
            }
        }
    });
}