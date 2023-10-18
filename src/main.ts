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
clearButton.innerHTML = "clear!";

const cursor = { active: false, x: 0, y: 0 };

canvas.addEventListener("mousedown", (mouseInfo) => {
  cursor.active = true;
  cursor.x = mouseInfo.offsetX;
  cursor.y = mouseInfo.offsetY;
});

canvas.addEventListener("mousemove", (mouseInfo) => {
  //mouse has to be down before this script can run
  if (cursor.active) {
    ctx!.beginPath();
    //moves ctx to original cursor position set in mouse down
    ctx!.moveTo(cursor.x, cursor.y);
    //creates a line from there to where the mouse is now
    ctx!.lineTo(mouseInfo.offsetX, mouseInfo.offsetY);
    ctx!.stroke();
    //resets cursors position to correct position
    cursor.x = mouseInfo.offsetX;
    cursor.y = mouseInfo.offsetY;
    //repeats very frequently if mousemove is running.
  }
});

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
});

canvas.addEventListener("mouseleave", () => {
  cursor.active = false;
});

clearButton.addEventListener("click", () => {
  ctx!.reset();
});
app.append(canvas);
app.append(header);
app.append(clearButton);
