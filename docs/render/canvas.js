let script = document.currentScript?.src || import.meta?.url;

function render() {
  let colors = params.body;
  window.canvas = el("canvas.fullbleed", {width:screen.width, height:screen.height});
  window.ctx = canvas.getContext("2d");
  window.w = window.canvas.width
  window.h = window.canvas.height
  document.body.appendChild(
    el("form.toolbar", {onchange: updateDimensions},
      el("select#size", 
        el("option", {value:"*"}, "this screen"),
        el("option", {value:"page", selected:"selected"}, "this page"),
        el("option", {value:"1500x500"}, "a cover image"),
        el("option", {value:"1920x1080"}, "a virtual background"),
        el("option", {value:"1600x1600"}, "a square"),
      ),
      el("a#save", {href:"#", onclick:saveImage}, "Save")
    )
  );
  document.body.appendChild(window.canvas);
  updateDimensions();
}

function updateDimensions(e) {
  var ua = navigator.userAgent;
  var isMac = /Macintosh/.test(ua)
  var isWin = /Windows/.test(ua)
  var iOS = /iPad|iPhone|iPod/.test(ua)

  var density = window.devicePixelRatio;
  var sh = screen.height, sw = screen.width;
  if (iOS && Math.abs(window.orientation) == 90) {
    [sw, sh] = [sh, sw]
  }
  
  sw *= density; sh *= density;

  let sizeString = document.querySelector('#size').value || "*";
  // localStorage.setItem("size", sizeString)

  if (sizeString == "page") { //} || fullbleed) {
    sw = window.innerWidth;
    sh = window.innerHeight;
    sw *= density;
    sh *= density;
  } else if (sizeString != "*") {
    let sizes = sizeString.split("x");
    sw = sizes[0]
    sh = sizes[1] || sw
    density = 2;
  }
  canvas.width = window.w = sw;
  canvas.height = window.h = sh;
  redraw();
}

function redraw() {
  eval(params.body);
  console.log("params", params)
}



function saveImage(e) {
  let target = e.target;
  target.href = window.canvas.toDataURL("image/png");
  target.download = "title.png";

  // window.canvas.toBlob(function(blob) {
  //   window.URL.revokeObjectURL(blobURL);
  //   blobURL = window.URL.createObjectURL(blob);
  //   target.href = blobURL;
  // });
}

var path = script.substring(0, script.lastIndexOf("."));
var cssURL = path + ".css";
Promise.all([ 
  loadSyle(cssURL)
]).then(render);


