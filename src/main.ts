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
redoButton.innerHTML = "Redo.";
undoButton.innerHTML = "Undo.";
clearButton.innerHTML = "clear!";

const num1 = 1;
const num0 = 0;
const event = new Event("drawing-changed");
const cursor = { active: false, x: 0, y: 0 };
let arraysOfCurrentLines: { x: number; y: number }[][] = [];
const redoLines: { x: number; y: number }[][] = [];

let line: { x: number; y: number }[] = [];

canvas.addEventListener("mousedown", (mouseInfo) => {
  cursor.active = true;
  cursor.x = mouseInfo.offsetX;
  cursor.y = mouseInfo.offsetY;
  line = [];
  arraysOfCurrentLines.push(line);
  line.push({ x: cursor.x, y: cursor.y });
});

canvas.addEventListener("mousemove", (mouseInfo) => {
  if (cursor.active) {
    cursor.x = mouseInfo.offsetX;
    cursor.y = mouseInfo.offsetY;
    line.push({ x: cursor.x, y: cursor.y });

    dispatchEvent(event);
  }
});

addEventListener("drawing-changed", handleDrawing);
function handleDrawing() {
  ctx!.clearRect(rectXorigin, rectYorigin, canvasWidth, canvasHeight);
  for (const line of arraysOfCurrentLines) {
    if (line.length > num1) {
      ctx!.beginPath();
      const { x, y } = line[num0];
      ctx!.moveTo(x, y);
      for (const { x, y } of line) {
        ctx!.lineTo(x, y);
      }
      ctx!.stroke();
    }
  }
}

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
});

canvas.addEventListener("mouseleave", () => {
  cursor.active = false;
});

clearButton.addEventListener("click", () => {
  ctx!.clearRect(rectXorigin, rectYorigin, canvasWidth, canvasHeight);
  arraysOfCurrentLines = [];
});

undoButton.addEventListener("click", () => {
  if (arraysOfCurrentLines.length > num0) {
    redoLines.push(arraysOfCurrentLines.pop()!);
    dispatchEvent(event);
  }
});

redoButton.addEventListener("click", () => {
  if (redoLines.length > num0) {
    arraysOfCurrentLines.push(redoLines.pop()!);
    dispatchEvent(event);
  }
});
app.append(canvas);
app.append(header);
app.append(clearButton);
app.append(undoButton);
app.append(redoButton);
