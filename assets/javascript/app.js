var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width;
var ch = canvas.height;

// define your barchart as a data-array of javascript objects
var bars = [
  { x: 50, y: ch, width: 20, height: 125, color: "green" },
  { x: 80, y: ch, width: 20, height: 80, color: "red" },
  { x: 110, y: ch, width: 20, height: 225, color: "blue" }
];

// draw the barchart based on the data array
drawBars();

function drawBars() {
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.font = "14px verdana";
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, cw, ch);
  for (var i = 0; i < bars.length; i++) {
    var bar = bars[i];
    ctx.fillStyle = bar.color;
    ctx.fillRect(bar.x, bar.y - 20, bar.width, -bar.height);
    ctx.fill();
    ctx.strokeStyle = "lightgray";
    ctx.strokeRect(bar.x, bar.y - 20, bar.width, -bar.height);
    ctx.fillStyle = "white";
    ctx.fillText(bar.height, bar.x + bar.width / 2, ch - 3);
  }
}
