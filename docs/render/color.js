let script = window.script;

// import Color from "https://colorjs.io/dist/color.js";
import Color from "/js/color.min.js";

function share() {
  parent.postMessage({share:{}}, "*");
}

let currentColor;

/**
 * Return the location of the element (x,y) being relative to the document.
 * 
 * @param {Element} obj Element to be located
 */
 function getElementPosition(obj) {
  var curleft = 0, curtop = 0;
  if (obj.offsetParent) {
      do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return { x: curleft, y: curtop };
  }
  return undefined;
}

/** 
 * return the location of the click (or another mouse event) relative to the given element (to increase accuracy).
 * @param {DOM Object} element A dom element (button,canvas,input etc)
 * @param {DOM Event} event An event generate by an event listener.
 */
 function getEventLocation(element,event){
  // Relies on the getElementPosition function.
  var pos = getElementPosition(element);
  
  return {
    x: (event.pageX - pos.x),
      y: (event.pageY - pos.y)
  };
}
function edit() {
  document.body.classList.toggle("edit");
}
function render() {
  let colors = params.body.substring(2).split(";");
  document.body.style.backgroundColor = colors[0];
  document.body.style.color = colors[1];
  currentColor = colors[0];
  window.lumCanvas = el("canvas#lumCanvas", {width:256, height:256});
  window.hueCanvas = el("canvas#hueCanvas", {width:256, height:16});

  document.body.appendChild(
    el("div", {}, [ 
        el("div#rectangle", window.lumCanvas, window.hueCanvas),
        el("div#info",
          el("div#title", colors[0]),
          el("div#copy", ""),
          el("div#edit",{onclick: edit}, "")
        )
      ]
    )
  )
  window.hueCanvas.addEventListener("pointerdown",update);
  window.hueCanvas.addEventListener("pointermove",update);
  window.lumCanvas.addEventListener("pointerdown",update);
  window.lumCanvas.addEventListener("pointermove",update);
  renderCanvas()
  updateURL()
}

function update (e){
  if (!e.buttons) return;

  let isHue = e.target === window.hueCanvas;
  
  var eventLocation = getEventLocation(this,event);
  var context = e.target.getContext('2d');
  let x = eventLocation.x;
  let y = isHue ? 0 : eventLocation.y;

  x = Math.min(Math.max(0, x),e.target.width);
  y = Math.min(Math.max(0, y),e.target.height);

  var pixelData = context.getImageData(x, y, 1, 1).data; 
  currentColor = `rgb(${pixelData[0]},${pixelData[1]},${pixelData[2]})`;
  document.body.style.backgroundColor = currentColor;

  updateURL();
  if (isHue) renderLumCanvas()
}

let timeout;
function updateURL() {
  clearTimeout(timeout)
  let hex = new Color(currentColor).to("srgb").toString({format: "hex"});
  document.getElementById("title").innerText = hex.toString().toUpperCase();
  timeout = setTimeout(() => {
    parent.postMessage({title:hex, updateHash:"#/c:" + hex}, "*");
  },100);
}

function renderCanvas() {
  renderHueCanvas();
  renderLumCanvas();
}
function renderHueCanvas() {
  let ctx = hueCanvas.getContext("2d");
  let w = hueCanvas.width, h = hueCanvas.height;

  var hue = ctx.createLinearGradient(0, 0, w, 0);
  hue.addColorStop(0.02, "#FAC22B");
  hue.addColorStop(0.16, "#099351");
  hue.addColorStop(0.28, "#008884");
  hue.addColorStop(0.41, "#0E638E");
  hue.addColorStop(0.52, "#2E36A9");
  hue.addColorStop(0.64, "#6C18AE");
  hue.addColorStop(0.74, "#AE1872");
  hue.addColorStop(0.82, "#D42A20");
  hue.addColorStop(0.91, "#E96523");
  hue.addColorStop(1.00, "#FAC22B");

  ctx.fillStyle = hue;
  ctx.fillRect(0, 0, w, h);
}

function renderLumCanvas() {
  let ctx = lumCanvas.getContext("2d");
  let w = lumCanvas.width, h = lumCanvas.height;

  let color = new Color(currentColor);


  color.hsl.s = 100;


  var chroma =  ctx.createLinearGradient(0, 0, w, 0); // ctx.createRadialGradient(w/2, h/4, h/8, w/2, h/4, w/2);
  chroma.addColorStop(0, color);
  chroma.addColorStop(1, "white");
  ctx.fillStyle = chroma;
  ctx.fillRect(0, 0, w, h);

  var luminance = ctx.createLinearGradient(0, 0, 0, h);
  luminance.addColorStop(0, "transparent");
  luminance.addColorStop(1, "black");
  ctx.fillStyle = luminance;
  ctx.fillRect(0, 0, lumCanvas.width, h );
}

var path = script.substring(0, script.lastIndexOf("."));
var cssURL = path + ".css";
Promise.all([ 
  // loadSyle("https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"),
  loadSyle(cssURL)
]).then(render);


