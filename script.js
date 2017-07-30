var jsonText = [];
// [
//   {
//     "letter" : "ayn",
//     "points" : [
//       [
//           {"x": 174, "y": 57},
//           {"x": 150, "y": 55},
//           {"x": 134, "y": 69},
//           {"x": 137, "y": 98},
//
//           {"x": 159, "y": 116}
//       ],
//       [
//           {"x": 186, "y": 107},
//
//           {"x": 159, "y": 116},
//
//           {"x": 130, "y": 133},
//           {"x": 111, "y": 157},
//           {"x": 117, "y": 189},
//           {"x": 146, "y": 207},
//           {"x": 180, "y": 204},
//           {"x": 206, "y": 182}
//       ]
//     ]
//   },
//   {
//     "letter" : "sample",
//     "points" : [
//       [
//           {"x": 174, "y": 57},
//           {"x": 150, "y": 55},
//           {"x": 134, "y": 69},
//           {"x": 137, "y": 98},
//
//           {"x": 159, "y": 116}
//       ],
//       [
//           {"x": 186, "y": 107},
//
//           {"x": 159, "y": 116}
//       ]
//     ]
//   }
// ];

var letter = 0;

var canvasSmall = document.getElementById('canvas-small');
var canvasBig = document.getElementById('canvas-big');

var contextSmall = canvasSmall.getContext('2d');
var contextBig = canvasBig.getContext('2d');

contextSmall.strokeStyle = 'blue';
contextBig.strokeStyle = 'blue';

function drawPoint(x, y, context) {
  var radius = 6;
  context.globalAlpha = 1;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = 'blue';
  context.fill();
  context.lineWidth = 5;
  context.strokeStyle = 'blue';
  context.stroke();
  context.closePath();
}

function strokePoints(prevX, prevY, x, y, context) {
  context.lineWidth = 22;
  context.globalAlpha = 0.5;

  context.beginPath();
  context.moveTo(x, y);

  var xc = (prevX + x) / 2;
  var yc = (prevY + y) / 2;

  context.quadraticCurveTo(prevX, prevY, xc, yc);
  context.stroke();
  context.closePath();
}

function plot() {

  // NOTE: multipliers are scaled to 30% less than actual (on mobile) to match html sizes

  // smaller dpi screen       // bigger dpi screen
  // orginal multiplier: 1    // orginal multiplier: 2.5
  var smallMultiplier = .7;   var bigMultiplier = 1.75;
  var smallDPI = 216;         var bigDPI = 401;
  var DENSITY_HIGH = 240;     var DENSITY_XHIGH = 320;

  var smallDensity = smallDPI / DENSITY_HIGH;  var bigDensity = bigDPI / DENSITY_XHIGH;


  var points = jsonText[letter].points;

  document.getElementById("letter").value = 'letter: ' + jsonText[letter].letter;

  for (segment = 0; segment < points.length; segment++) {

    var prev = points[segment][0];

    for (pair = 1; pair < points[segment].length; pair++) {

      console.log(points[segment][pair]);

      var smallPrevX = (prev.x / smallDensity) * smallMultiplier;
      var smallPrevY = (prev.y / smallDensity) * smallMultiplier;
      var smallX = (points[segment][pair].x / smallDensity) * smallMultiplier;
      var smallY = (points[segment][pair].y / smallDensity) * smallMultiplier;

      strokePoints(smallPrevX, smallPrevY, smallX, smallY, contextSmall);
      drawPoint(smallX, smallY, contextSmall);


      var bigPrevX = (prev.x / bigDensity) * bigMultiplier;
      var bigPrevY = (prev.y / bigDensity) * bigMultiplier;
      var bigX = (points[segment][pair].x / bigDensity) * bigMultiplier;
      var bigY = (points[segment][pair].y / bigDensity) * bigMultiplier;

      strokePoints(bigPrevX, bigPrevY, bigX, bigY, contextBig);
      drawPoint(bigX, bigY, contextBig);

      prev = points[segment][pair];
    }
  }
}

document.getElementById('prev').onclick = function() {
  letter--;
  if (letter == -1) {
    letter = jsonText.length - 1;
  }
  contextSmall.clearRect(0, 0, canvasBig.width, canvasBig.height);
  contextSmall.beginPath();

  contextBig.clearRect(0, 0, canvasBig.width, canvasBig.height);
  contextBig.beginPath();

  console.log(letter);
  document.getElementById("letter").value = 'letter: ' + jsonText[letter].letter;
  plot();
};

document.getElementById('next').onclick = function() {
  letter++;
  if (letter == jsonText.length) {
    letter = 0;
  }
  contextSmall.clearRect(0, 0, canvasBig.width, canvasBig.height);
  contextSmall.beginPath();

  contextBig.clearRect(0, 0, canvasBig.width, canvasBig.height);
  contextBig.beginPath();

  console.log(letter);
  document.getElementById("letter").value = 'letter: ' + jsonText[letter].letter;
  plot();
};

document.getElementById('upload').onclick = function() {
  var files = document.getElementById('fileChooser').files;
  console.log(files);
  if (files.length <= 0) {
    return false;
  }

  var reader = new FileReader();

  reader.onload = function(e) {
    console.log(e);
    var result = JSON.parse(e.target.result);
    var formatted = JSON.stringify(result, null, 2);
    document.getElementById('result').value = formatted;
  }

  reader.readAsText(files.item(0));

  setTimeout(function() {
    console.log(document.getElementById('result').value);
    jsonText = JSON.parse(document.getElementById('result').value);
    console.log(jsonText);
    plot();
  }, 2000);
};
