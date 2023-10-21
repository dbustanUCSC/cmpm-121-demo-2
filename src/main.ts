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
const ctx = canvas.getContext("2d");

ctx!.fillStyle = "white";
ctx!.fillRect(rectXorigin, rectYorigin, canvasWidth, canvasHeight);

const clearButton = document.createElement("button");
const undoButton = document.createElement("button");
const redoButton = document.createElement("button");
const thinMarker = document.createElement("button");
const thickMarker = document.createElement("button");
redoButton.innerHTML = "Redo.";
undoButton.innerHTML = "Undo.";
clearButton.innerHTML = "clear!";
thinMarker.innerHTML = "thin marker";
thickMarker.innerHTML = "THICK marker";

const thinLineWidth = 1;
const thickLineWidth = 7;
const thickRadius = thickLineWidth / 2;
const thinRadius = thinLineWidth + 0.5;
const startAngle = 0;
const endAngle = 10;
let thickness = "thin";

class HoldersofLines {
  markerLines: MarkerLine[];
  constructor() {
    this.markerLines = [];
  }
  displayAll(ctx: CanvasRenderingContext2D) {
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

  drag(x:number, y: number) {
    this.line.push({ x, y });
    dispatchEvent(drawingChanged);
  }
  length() {
    return this.line.length;
  }
  
}


const lineHolder = new HoldersofLines;
const redoLines = new HoldersofLines;
const num1 = 1;
const num0 = 0;
const drawingChanged = new Event("drawing-changed");
const toolMoved = new Event("tool-moved");



class CursorInformation {
  active: boolean;
  lineThickness: string;
  x: number;
  y: number;
  constructor(active: boolean, lineThickness: string, x: number, y: number) {
    this.active = active;
    this.lineThickness = lineThickness;
    this.x = x;
    this.y = y;
  }
  
  updateCoords(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  draw(ctx: CanvasRenderingContext2D) {
   
    lineHolder.displayAll(ctx);
    ctx.fillStyle = "black";
    ctx.beginPath();
    if (thickness == "thick") {
      ctx.arc(this.x, this.y, thickRadius, startAngle, endAngle, false);
    } else if (thickness == "thin") {
      ctx.arc(this.x, this.y, thinRadius, startAngle, endAngle, false);
    }
    ctx.fill();
  }
  
}

const cursor = new CursorInformation(false, thickness, 0, 0);
let line: MarkerLine;

function handleDrawing() {
  
  lineHolder.displayAll(ctx!);
  
}


canvas.addEventListener("mousedown", (mouseInfo) => {
  cursor.active = true;
  cursor.updateCoords(mouseInfo.offsetX, mouseInfo.offsetY);
  line = new MarkerLine(thickness);
  lineHolder.push(line);
  line.drag(cursor.x, cursor.y);
});

canvas.addEventListener("mousemove", (mouseInfo) => {
  cursor.updateCoords(mouseInfo.offsetX, mouseInfo.offsetY);
  dispatchEvent(toolMoved);
  if (cursor.active) {
    line.drag(cursor.x, cursor.y);  
  }
});

addEventListener("drawing-changed", handleDrawing);
addEventListener("tool-moved", toolUpdate);


function toolUpdate() {
  cursor.draw(ctx!);
}

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
});

canvas.addEventListener("mouseleave", () => {
  cursor.active = false;
});

clearButton.addEventListener("click", () => {
  ctx!.clearRect(rectXorigin, rectYorigin, canvasWidth, canvasHeight);
  lineHolder.clear();
  redoLines.clear();
});


undoButton.addEventListener("click", () => {
  if (lineHolder.length() > num0) {
    redoLines.push(lineHolder.pop()!);
    dispatchEvent(drawingChanged);
  }
});

redoButton.addEventListener("click", () => { 
  if (redoLines.length () > num0) {
    lineHolder.push(redoLines.pop()!);
    dispatchEvent(drawingChanged);
  }
});


thickMarker.addEventListener("click", () => {
  thickness = "thick";
  cursor.lineThickness = thickness;
  dispatchEvent(toolMoved);
});

thinMarker.addEventListener("click", () => {
  thickness = "thin";
  cursor.lineThickness = thickness;
  dispatchEvent(toolMoved);
});




app.append(canvas);
app.append(header);
app.append(clearButton);
app.append(undoButton);
app.append(redoButton);
app.append(thinMarker);
app.append(thickMarker);
