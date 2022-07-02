let script = document.currentScript?.src || import.meta?.url;

 import Color from "https://colorjs.io/dist/color.js";
// import Color from (new URL("/js/color.global.min.js", script.src)).href;
console.log("script",script)

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

function update (e){
   if (!e.buttons) return;
  console.log(e)
  // Get the coordinates of the click
  var eventLocation = getEventLocation(this,event);
  // Get the data of the pixel according to the location generate by the getEventLocation function
  var context = this.getContext('2d');
  var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data; 

  // If transparency on the pixel , array = [0,0,0,0]
  if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)){
      // Do something if the pixel is transparent
  }
  currentColor = `rgba(${pixelData[0]},${pixelData[1]},${pixelData[2]},${pixelData[3]})`;
  renderCanvas()

  console.log(pixelData[0], pixelData[1], pixelData[2]);
  // Convert it to HEX if you want using the rgbToHex method.
  // var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
}
function render() {
  let colors = params.body.substring(2).split(";");
  console.log("params", params, colors)
  // parent.postMessage({title:title, favicon:"🍴", image:image, description:description, wakeLock:true, updateURL:true}, "*");
  document.body.style.backgroundColor = colors[0];
  document.body.style.color = colors[1];
  currentColor = colors[0];
  window.canvas = el("canvas", {width:320, height:320});
  document.body.appendChild(
    el("div", {}, [ 
        // el("div", {innerHTML: colors.join("<br>")}),
        window.canvas
      ]
    )
  )
  window.canvas.addEventListener("pointerdown",update);
  window.canvas.addEventListener("pointermove",update);
  renderCanvas()
}

function renderCanvas() {
  let ctx = canvas.getContext("2d");
  let w = canvas.width, h = canvas.height;

  var luminance = ctx.createLinearGradient(0, 0, w, 0);
  luminance.addColorStop(0, "white");
  luminance.addColorStop(1, "black");
  ctx.fillStyle = luminance;
  ctx.fillRect(0, h/4, canvas.width, h * 3/4);


  var hue = ctx.createLinearGradient(0, 0, w, 0);
  hue.addColorStop(0.0,    "#FAC22B");
  hue.addColorStop(0.1448, "#0E8E51");
  hue.addColorStop(0.349,  "#0E638E");
  hue.addColorStop(0.503,  "#67378D");
  hue.addColorStop(0.7423, "#D42A20");
  hue.addColorStop(0.8907, "#E77625");
  hue.addColorStop(1.0,    "#FAC22B");
  ctx.fillStyle = hue;
  ctx.fillRect(0, 0, w, h/4);

  let color = new Color(currentColor);
  document.body.style.backgroundColor = currentColor;


  color.hsl.s = 100;

  var chroma =  ctx.createLinearGradient(0, h, 0, h/4); // ctx.createRadialGradient(w/2, h/4, h/8, w/2, h/4, w/2);
  chroma.addColorStop(0, color);
  color.alpha = 0.0;

  chroma.addColorStop(1, color);

  ctx.fillStyle = chroma;
  ctx.fillRect(0, h/4, canvas.width, h * 3/4);
}


var path = script.substring(0, script.lastIndexOf("."));
var cssURL = path + ".css";
Promise.all([ 
  loadSyle("https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"),
  loadSyle(cssURL)
]).then(render);


