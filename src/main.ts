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
const thickLineWidth  = 7;
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
    dispatchEvent(event);
  }
  length() {
    return this.line.length;
  }
  
}


const lineHolder = new HoldersofLines;
const redoLines = new HoldersofLines;
const num1 = 1;
const num0 = 0;
const event = new Event("drawing-changed");
const cursor = { active: false, x: 0, y: 0 };
let line: MarkerLine;

function handleDrawing() {
  
  lineHolder.displayAll(ctx!);
  
}


canvas.addEventListener("mousedown", (mouseInfo) => {
  cursor.active = true;
  cursor.x = mouseInfo.offsetX;
  cursor.y = mouseInfo.offsetY;
  line = new MarkerLine(thickness);
  lineHolder.push(line);
  line.drag(cursor.x, cursor.y);
});

canvas.addEventListener("mousemove", (mouseInfo) => {
  if (cursor.active) {
    cursor.x = mouseInfo.offsetX;
    cursor.y = mouseInfo.offsetY;
    line.drag(cursor.x, cursor.y);  
  }
});

addEventListener("drawing-changed", handleDrawing);


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
    dispatchEvent(event);
  }
});

redoButton.addEventListener("click", () => {
  if (redoLines.length () > num0) {
    lineHolder.push(redoLines.pop()!);
    dispatchEvent(event);
  }
});
let thickness = "thin";
thickMarker.addEventListener("click", () => {
  thickness = "thick";
  
});

thinMarker.addEventListener("click", () => {
  thickness = "thin";
  
});




app.append(canvas);
app.append(header);
app.append(clearButton);
app.append(undoButton);
app.append(redoButton);
app.append(thinMarker);
app.append(thickMarker);
