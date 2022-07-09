document.body.style = "display:flex; min-height:100vh; justify-content: center; align-items: center; margin:0;"
let canvas = window.canvas = document.createElement("canvas");
canvas.style = "max-height: 100vh; max-width: 100vw;";
document.body.append(canvas);
window.ctx = canvas.getContext("2d");
let update = () => {
  var density = window.devicePixelRatio;
  window.w = canvas.width = window.innerWidth * density;
  window.h = canvas.height = window.innerHeight * density;
  console.log("canvas", canvas.width, canvas.height)

  draw();
}
(window.onresize = update)()