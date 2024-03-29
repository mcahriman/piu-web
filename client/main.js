jquery = require("jquery");
createjs = require("createjs-browserify");
_ = require("lodash");


var canvas, stage;
var drawingCanvas;
var oldPt;
var oldMidPt;
var title;
var color;
var stroke;5212
var colors;
var index;

function init() {
	canvas = document.getElementById("x-control");
	index = 0;
	colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"];

	//check to see if we are running in a browser with touch support
	stage = new createjs.Stage(canvas);
	stage.autoClear = false;
	stage.enableDOMEvents(true);

	createjs.Touch.enable(stage);
	createjs.Ticker.setFPS(24);

	drawingCanvas = new createjs.Shape();

	stage.addEventListener("stagemousedown", handleMouseDown);
	stage.addEventListener("stagemouseup", handleMouseUp);

	title = new createjs.Text("Click and Drag to draw", "36px Arial", "#777777");
	title.x = 300;
	title.y = 200;
	stage.addChild(title);

	stage.addChild(drawingCanvas);
	stage.update();
}

function handleMouseDown(event) {
	if (!event.primary) { return; }
	if (stage.contains(title)) {
		stage.clear();
		stage.removeChild(title);
	}
	color = colors[(index++) % colors.length];
	stroke = 1;
	oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
	oldMidPt = oldPt.clone();
	stage.addEventListener("stagemousemove", handleMouseMove);
  updateCoordinatesDisplay(stage);
  }

function handleMouseMove(event) {
	if (!event.primary) { return; }
	var midPt = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);

	drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

	oldPt.x = stage.mouseX;
	oldPt.y = stage.mouseY;

	oldMidPt.x = midPt.x;
	oldMidPt.y = midPt.y;
  updateCoordinatesDisplay(stage)
	stage.update();
}

var updateCoordinatesDisplay = _.throttle(function() {
	var coords = getRelativeCoordinates(stage.mouseX,stage.mouseY);
	document.getElementById("x-display").innerText = coords.x;
    document.getElementById("y-display").innerText = coords.y;
    jquery.ajax({
        url: "/rotate/" + (180-coords.x) + "-" + coords.y,
    }).done(function(e) { console.log(e);});
},
  30
);
function getRelativeCoordinates(x, y) {
	return {
  	"x": Math.round(x/300*180),
    "y": Math.round(y/300*180)};
}

function handleMouseUp(event) {
	if (!event.primary) { return; }
	stage.removeEventListener("stagemousemove", handleMouseMove);
}

jquery("#lon").on("click", function() {
    jquery.ajax({url: "/lon"});
});


jquery("#loff").on("click", function() {
    jquery.ajax({url: "/loff"});
});

init();