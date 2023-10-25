import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Drawing Simulation!";

document.title = gameName;

const header = document.createElement("h1");
const div1 = document.createElement("div");
const div2 = document.createElement("div");
const div3 = document.createElement("div");

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
let ctx = canvas.getContext("2d")!;

ctx.fillStyle = "white";
ctx.fillRect(rectXorigin, rectYorigin, canvasWidth, canvasHeight);

class Color {
  color: HTMLInputElement;
  constructor() {
    this.color = document.createElement("input");
    this.color.type = "color";
  }
  get() {
    return this.color.value;
  }
  random() {
    const white = 16777215;
    this.color.value = "#" + Math.floor(Math.random() * white).toString(16);
  }
}

function createButton(name: string) {
  const b = document.createElement("button");
  b.innerHTML = name;
  div1.appendChild(b);
  return b;
}

const clearButton = createButton("clear!");
const undoButton = createButton("undo");
const redoButton = createButton("redo");
const thinMarker = createButton("thin marker");
const thickMarker = createButton("thick marker");
const customSticker = createButton("custom sticker...");
const exportButton = createButton("export");

const STICKERS = [
  { name: "witch", emoji: "🧙‍♀️" },
  { name: "throwup", emoji: "🤢" },
  { name: "pumpkin", emoji: "🎃" },
];

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
    const EMOJI_WIDTH = 50;
    ctx.fillText(this.stickerName, this.x, this.y, EMOJI_WIDTH);
  }
  drag(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class HoldersofLines {
  markerLines: MarkerLine[] = [];

  displaylines(ctx: CanvasRenderingContext2D) {
    for (const line of lineHolder.markerLines) {
      if (line.length() > 0) {
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
  color: string;
  constructor(thickness: string, color: string) {
    this.lineW = thickness;
    this.color = color;
  }

  lineW: string;
  line: { x: number; y: number }[] = [];

  display(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.color;
    if (this.lineW == "thin") {
      ctx.lineWidth = thinLineWidth;
      this.drawCircle(ctx, thinRadius);
    } else if (this.lineW == "thick") {
      ctx.lineWidth = thickLineWidth;
      this.drawCircle(ctx, thickRadius);
    }
    const { x, y } = this.line[0];
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (const { x, y } of this.line) {
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  drawCircle(ctx: CanvasRenderingContext2D, radius: number) {
    const manyPoints = 2;
    const noPoints = 0;
    if (this.line.length <= manyPoints && this.line.length > noPoints) {
      const { x, y } = this.line[0];
      const reduceLineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.fillStyle = this.color;
      if (radius == thickRadius) {
        ctx.lineWidth = radius - reduceLineWidth;
      }

      ctx.fill();
      ctx.stroke();
    }
  }
  drag(x: number, y: number) {
    this.line.push({ x, y });
    dispatchEvent(drawingChanged);
  }
  length() {
    return this.line.length;
  }
}

const thinLineWidth = 1;
const thickLineWidth = 7;
const thickRadius = thickLineWidth / 2;
const thinRadius = thinLineWidth / 2;
const startAngle = 0;
const endAngle = 10;

let thickness = "thin";

const lineHolder = new HoldersofLines();
const redoLines = new HoldersofLines();
const allStickers = new StickerSet();

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
    dispatchEvent(drawingChanged);
    ctx.fillStyle = colorVar.get();
    ctx.beginPath();
    if (thickness == "thick") {
      ctx.arc(this.x, this.y, thickRadius, startAngle, endAngle, false);
    } else if (thickness == "thin") {
      ctx.arc(this.x, this.y, thinRadius, startAngle, endAngle, false);
    }
    ctx.fill();
  }
  drawSticker(ctx: CanvasRenderingContext2D) {
    dispatchEvent(drawingChanged);
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    const EMOJI_WIDTH = 50;

    ctx.fillText(cursor.currentSticker, this.x, this.y, EMOJI_WIDTH);
  }
}

function handleDrawing() {
  ctx.clearRect(rectXorigin, rectYorigin, canvasWidth, canvasHeight);
  ctx.fillStyle = "white";
  ctx.fillRect(rectXorigin, rectYorigin, canvasWidth, canvasHeight);
  lineHolder.displaylines(ctx);
  allStickers.displayStickers(ctx);
}

const INITAL_MOUSE_POSITION = 0;

const cursor = new CursorInformation(
  false,
  false,
  "null",
  thickness,
  INITAL_MOUSE_POSITION,
  INITAL_MOUSE_POSITION
);

const colorVar = new Color();
let newSticker: Sticker;
let line: MarkerLine;

canvas.addEventListener("mousedown", (mouseInfo) => {
  cursor.active = true;
  if (cursor.isSticker) {
    newSticker = new Sticker(cursor.currentSticker, cursor.x, cursor.y);
    allStickers.push(newSticker);
  } else {
    line = new MarkerLine(thickness, colorVar.get());
    lineHolder.push(line);
    line.drag(cursor.x, cursor.y);
  }
  cursor.updateCoords(mouseInfo.offsetX, mouseInfo.offsetY);
  dispatchEvent(toolMoved);
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
    cursor.drawSticker(ctx);
  } else {
    cursor.draw(ctx);
  }
}

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
  dispatchEvent(drawingChanged);
  dispatchEvent(toolMoved);
});

canvas.addEventListener("mouseleave", () => {
  cursor.active = false;
});

clearButton.addEventListener("click", () => {
  ctx.clearRect(rectXorigin, rectYorigin, canvasWidth, canvasHeight);
  lineHolder.clear();
  redoLines.clear();
  allStickers.clear();
});

undoButton.addEventListener("click", () => {
  if (lineHolder.length()) {
    redoLines.push(lineHolder.pop()!);
    dispatchEvent(drawingChanged);
  }
});

redoButton.addEventListener("click", () => {
  if (redoLines.length()) {
    lineHolder.push(redoLines.pop()!);
    dispatchEvent(drawingChanged);
  }
});

thickMarker.addEventListener("click", () => {
  cursor.isSticker = false;
  thickness = "thick";
  cursor.lineThickness = thickness;
  colorVar.random();
  dispatchEvent(toolMoved);
});

thinMarker.addEventListener("click", () => {
  cursor.isSticker = false;
  thickness = "thin";
  cursor.lineThickness = thickness;
  colorVar.random();
  dispatchEvent(toolMoved);
});

const exportCanvasW = 1024;
const exportCanvasH = 1024;
const exportCanvasScale = 4;

exportButton.addEventListener("click", () => {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = exportCanvasW;
  exportCanvas.height = exportCanvasH;
  ctx = exportCanvas.getContext("2d")!;
  ctx.scale(exportCanvasScale, exportCanvasScale);
  dispatchEvent(drawingChanged);
  const anchor = document.createElement("a");
  anchor.href = exportCanvas.toDataURL("image/png");
  anchor.download = "heya.png";
  anchor.click();
  ctx = canvas.getContext("2d")!;
});
app.append(header);
app.append(canvas);
app.append(div1);
app.append(div2);
app.append(div3);

customSticker.addEventListener("click", () => {
  const text = prompt("Custom sticker text", "🧽");
  if (text != null) {
    const createdSticker = document.createElement("button");
    createdSticker.innerHTML = text;
    createdSticker.addEventListener("click", () => {
      cursor.currentSticker = createdSticker.innerHTML;
      cursor.isSticker = true;
      dispatchEvent(toolMoved);
    });
    div2.append(createdSticker);
  }
});

STICKERS.forEach((element) => {
  const generalSticker = document.createElement("button");
  generalSticker.innerHTML = element.emoji;
  generalSticker.addEventListener("click", () => {
    cursor.currentSticker = generalSticker.innerHTML;
    cursor.isSticker = true;
    dispatchEvent(toolMoved);
  });
  div2.appendChild(generalSticker);
});

div3.append(colorVar.color);
