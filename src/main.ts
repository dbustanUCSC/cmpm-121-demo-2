import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Drawing Simulation!";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;

const canvas = document.createElement("canvas");
const canvasWidth = 256;
const canvasHeight = 256;
const rectXorigin = 0;
const rectYorigin = 0;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
canvas.style.background = "white";
canvas.style.boxShadow = "1rem 1rem 20px grey";
canvas.style.border = "10px solid black";
canvas.style.cursor = "none";
const ctx = canvas.getContext("2d");

ctx!.fillStyle = "white";
ctx!.fillRect(rectXorigin, rectYorigin, canvasWidth, canvasHeight);

//buttons
const clearButton = document.createElement("button");
const undoButton = document.createElement("button");
const redoButton = document.createElement("button");
const thinMarker = document.createElement("button");
const thickMarker = document.createElement("button");
const witchSticker = document.createElement("button");
const throwupSticker = document.createElement("button");
const pumpkinSticker = document.createElement("button");

//inner
redoButton.innerHTML = "Redo.";
undoButton.innerHTML = "Undo.";
clearButton.innerHTML = "clear!";
thinMarker.innerHTML = "thin marker";
thickMarker.innerHTML = "THICK marker";
witchSticker.innerHTML = "🧙‍♀️";
throwupSticker.innerHTML = "🤢";
pumpkinSticker.innerHTML = "🎃";

//class to hold stickers
class StickerSet {
  stickers: Sticker[] = [];
  push(sticker: Sticker) {
    allStickers.stickers.push(sticker);
  }
  displayStickers(ctx: CanvasRenderingContext2D) {
    for (const sticker of allStickers.stickers) {
      sticker.draw(ctx);
    }
  }
  clear() {
    this.stickers = [];
  }
}

//sticker properties
class Sticker {
  stickerName: string;
  x: number;
  y: number;
  constructor(stickerName: string, x: number, y: number) {
    this.stickerName = stickerName;
    this.x = x;
    this.y = y;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = "arial";
    ctx.fillStyle = "black";
    ctx.fillText(this.stickerName, this.x, this.y, 50);
  }
  drag(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class HoldersofLines {
  markerLines: MarkerLine[] = [];

  displaylines(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(rectXorigin, rectYorigin, canvasWidth, canvasHeight);
    for (const line of lineHolder.markerLines) {
      if (line.length() > num1) {
        line.display(ctx);
      }
    }
  }

  push(line: MarkerLine) {
    this.markerLines.push(line);
  }
  clear() {
    this.markerLines = [];
  }
  length() {
    return this.markerLines.length;
  }

  pop() {
    return this.markerLines.pop();
  }
}

class MarkerLine {
  constructor(thickness: string) {
    this.lineW = thickness;
  }

  lineW: string;
  line: { x: number; y: number }[] = [];

  display(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    if (this.lineW == "thin") {
      ctx.lineWidth = thinLineWidth;
    } else if (this.lineW == "thick") {
      ctx.lineWidth = thickLineWidth;
    }
    const { x, y } = this.line[num0];
    ctx.moveTo(x, y);
    for (const { x, y } of this.line) {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  drag(x: number, y: number) {
    this.line.push({ x, y });
    dispatchEvent(drawingChanged);
  }
  length() {
    return this.line.length;
  }
}

//button creations

const thinLineWidth = 1;
const thickLineWidth = 7;
const thickRadius = thickLineWidth / 2;
const thinRadius = thinLineWidth + 0.5;
const startAngle = 0;
const endAngle = 10;

let thickness = "thin";

const lineHolder = new HoldersofLines();
const redoLines = new HoldersofLines();
const allStickers = new StickerSet();

const num1 = 1;
const num0 = 0;
const drawingChanged = new Event("drawing-changed");
const toolMoved = new Event("tool-moved");

class CursorInformation {
  active: boolean;
  isSticker: boolean;
  currentSticker: string;
  lineThickness: string;
  x: number;
  y: number;
  constructor(
    active: boolean,
    isSticker: boolean,
    currentSticker: string,
    lineThickness: string,
    x: number,
    y: number
  ) {
    this.active = active;
    this.isSticker = isSticker;
    this.currentSticker = currentSticker;
    this.lineThickness = lineThickness;
    this.x = x;
    this.y = y;
  }

  updateCoords(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  draw(ctx: CanvasRenderingContext2D) {
    lineHolder.displaylines(ctx);
    allStickers.displayStickers(ctx);
    ctx.fillStyle = "black";
    ctx.beginPath();
    if (thickness == "thick") {
      ctx.arc(this.x, this.y, thickRadius, startAngle, endAngle, false);
    } else if (thickness == "thin") {
      ctx.arc(this.x, this.y, thinRadius, startAngle, endAngle, false);
    }
    ctx.fill();
  }
  drawSticker(ctx: CanvasRenderingContext2D) {
    lineHolder.displaylines(ctx);
    allStickers.displayStickers(ctx);
    ctx.font = "30px Arial";
    ctx.fillText(cursor.currentSticker, this.x, this.y, 50);
  }
}

const cursor = new CursorInformation(false, false, "null", thickness, 0, 0);

let newSticker: Sticker;
function handleDrawing() {
  lineHolder.displaylines(ctx!);
  allStickers.displayStickers(ctx!);
}

let line: MarkerLine;

canvas.addEventListener("mousedown", (mouseInfo) => {
  cursor.active = true;
  if (cursor.isSticker) {
    newSticker = new Sticker(cursor.currentSticker, cursor.x, cursor.y);
    allStickers.push(newSticker);
    //dispatchEvent(drawingChanged);
  } else {
    line = new MarkerLine(thickness);
    lineHolder.push(line);
    line.drag(cursor.x, cursor.y);
  }
  cursor.updateCoords(mouseInfo.offsetX, mouseInfo.offsetY);
});

canvas.addEventListener("mousemove", (mouseInfo) => {
  cursor.updateCoords(mouseInfo.offsetX, mouseInfo.offsetY);
  if (cursor.active && cursor.isSticker) {
    newSticker.drag(cursor.x, cursor.y);
  } else if (cursor.active) {
    line.drag(cursor.x, cursor.y);
  }
  dispatchEvent(toolMoved);
});

addEventListener("drawing-changed", handleDrawing);
addEventListener("tool-moved", handleTool);

function handleTool() {
  if (cursor.isSticker) {
    cursor.drawSticker(ctx!);
  } else {
    cursor.draw(ctx!);
  }
}

canvas.addEventListener("mouseup", () => {
  mouseDown = false;
  cursor.active = false;
  dispatchEvent(drawingChanged);
});

canvas.addEventListener("mouseleave", () => {
  cursor.active = false;
});

clearButton.addEventListener("click", () => {
  ctx!.clearRect(rectXorigin, rectYorigin, canvasWidth, canvasHeight);
  lineHolder.clear();
  redoLines.clear();
  allStickers.clear();
});

undoButton.addEventListener("click", () => {
  if (lineHolder.length() > num0) {
    redoLines.push(lineHolder.pop()!);
    dispatchEvent(drawingChanged);
  }
});

redoButton.addEventListener("click", () => {
  if (redoLines.length() > num0) {
    lineHolder.push(redoLines.pop()!);
    dispatchEvent(drawingChanged);
  }
});

thickMarker.addEventListener("click", () => {
  cursor.isSticker = false;
  thickness = "thick";
  cursor.lineThickness = thickness;
  dispatchEvent(toolMoved);
});

thinMarker.addEventListener("click", () => {
  cursor.isSticker = false;
  thickness = "thin";
  cursor.lineThickness = thickness;
  dispatchEvent(toolMoved);
});

witchSticker.addEventListener("click", () => {
  cursor.currentSticker = witchSticker.innerHTML;
  cursor.isSticker = true;
  dispatchEvent(toolMoved);
});

throwupSticker.addEventListener("click", () => {
  cursor.currentSticker = throwupSticker.innerHTML;
  cursor.isSticker = true;
  dispatchEvent(toolMoved);
});

pumpkinSticker.addEventListener("click", () => {
  cursor.currentSticker = pumpkinSticker.innerHTML;
  cursor.isSticker = true;
  dispatchEvent(toolMoved);
});

//Appending
app.append(canvas);
app.append(header);
app.append(clearButton);
app.append(undoButton);
app.append(redoButton);
app.append(thinMarker);
app.append(thickMarker);
app.append(witchSticker);
app.append(throwupSticker);
app.append(pumpkinSticker);
