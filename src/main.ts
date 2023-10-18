import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Drawing Simulation!";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.background = "blue";
canvas.style.boxShadow = "grey 1rem 1rem 20px";
canvas.style.border = "6px solid black";
canvas.style.cursor = "none";
const ctx = canvas.getContext("2d");

ctx!.fillStyle = "white";

ctx!.fillRect(0, 0, 256, 256);

app.append(canvas);
app.append(header);
