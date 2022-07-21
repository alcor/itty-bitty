let script = document.currentScript?.src 

var cssURL = "/render/axiom.css";
Promise.all([loadSyle(cssURL)]).then(render);

let colors = ["#192F30", "#2A4546", "#2E4A4B", "#264A4B", "#274E50", "#225A5D", "#1B666A", "#207479", "#27898F", "#2E9EA1", "#37A7AA", "#3FB6BA", "#39C9CE", "#3CD0D5", "#40D7DC", "#46DCE1", "#5CE6EB", "#ACF6F4"]
let chars = `AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz.,:;!?&#/\\∞'"0123456789+-*()[]^\`█▟▙▜▛▀▄▐▌▝▘▗▖─═║╔╗╚╝╠╣╦╩╬><▲▼☺☻⚉ ™ %  ♦♣♠♥`
var img = new Image;
img.src = "data:image/gif;base64,R0lGODlhegEtAIAAAP///////yH5BAUAAAEALAAAAAB6AS0AAAL/jI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyzAD2/dw2std6rgP4DMGeo5j4HYJAntC4gE6kSeHyaVVQiVmu89jdVsVOJkQJNqdxa7QUSg7Au9psT2yM5+leOb8ZxbcH9qX3Z1h1peg3FDjG9XdlF7kYx7jYcEfZx+mISZj49VknqjZ4GRp42tlHxjY66qo0h+pZgYiKF/n2s4PDNovlNyk6XMzoG6YsqVkqzMosSGe6fEobao1F7NlcmQztdU167Nz5/QpbO475zb69Hh7+JI+s3bpc/5n8XNvdff9syypovAptK0JFkxt/hxoahARJ3B5erwQeRGhMnUVQ/+4Wmts1rdq8fMP4/SN5CWMuK7SyUVMFbFPCkA/vOQtWM6VDeO10wqwIMhGTbDkLwju6SqFRpCLl0INIVFHUVCd7/hvYSA2spSirmmTZ1ObRjyvB6Wqk7ytZrBvTUg0rLtXakT27gi16dx1Dp1N9AiI3U67VvE/9yiMc9WremGjJbb2YseU7szTVlZX67uyxc4XtesOc7he+QYw/C1brOLBOe/3ABvOIrqSyiehER6zN1bFsYl4vh5bWtrVvJJI2C7srOS1F3XWh8iZsuAzQ2JYzMitTnYZ2DJZYdN/ufdNf8OTLp/iuAr15E+rHrn8P/wIaGfPjt2gv177+/fz7+///D2CAAg5IYIEGHohgglNUNkZI+BnHUXZkZYKPD8TNQFGGOb1lQUFz1JchbTO5ZgZxCJEoongZBJcOQbZM2Bgu4Li1oHYSQdZZMQ96ONlEEMaFE08OJdeiBrLkB5hqbvU1mGlJLTaZN1rJt9Np7hx2ISvtBfZkhS9eeVKRpnUW1xlfJknhhjB6JpwvrT0p3ZVISlije0deBxpTJCil229iqaSSjmGteQRfc2pJCZyAKDYXXwzmKByiZ54XFJ55MqcilShJqOFudX3q5W7RKCXiI4dqlKgdSZyBmFrnZAkiiwOxGN6LfG7Kaaa3lEZZqu5tylaohGZiaJ+opmkkbm//xvRSWUoOVyV8pJ1Y5IOs9ujgeDOCSpCwkUoQbX53rhhbuS/NilosUE7qp53hwjitsTOSC2G73TZ66Y/ebjDuvNYiSR1LeA2c2mtDZVkdrZR9CSg/dD5MZazSGRzchSaCtFB9Hyjcr4LIirClrh6PTOmcsf47IMokr8xyyyBT53LMMm93ooNT1owztRHobOGUK4xkpFOrCiI0D0WbSfQkMMs2s40832ZuzlKj93QdCP98NHdZF2t00lNsDbTPtzVNQ80TazV12uAG+tPSKAC9Ithyew3u3BNbrXLLDR2y89M4n50222247anIIcCtNd1da7E1sYoz3eA0gJOq9HSG//yyRBrzXhu5qZzsY3HOowZ+dc8aTw4D4vLZPTTjIquOONoa2wyM6xgJzjikoP0rO27MavM31LAGzkHV0jZ+C+uLt17345CPjd3oRAg9z6vUT1/o9Kpjx/vws/VCOopmCz9+sqW/UD7sog99u+1IVG42tRmTanXn2t9vvcDIZ479/qcOLpqDhU9nahsd7iImNvYYz3W5q0EDo/DACIKgRCf7UB7cNxTsiUdV/YsQBQYIQvkRj3zn21UJ78Mz2BUObOvrWvsiUrj4WQ5F9isO/1z4vn3syXB4CyDxbifCApKQcB884HpU6LzVJXF7DqTd3YQXPe1h7kY83JV1iggUR6LFo1QxHKABTxe5CoKRO0bskPIyV0UGMm95O8ta71IkOaOxL3RpXBuu1gac+nkuhGwLHhAEt0BynfCDZ7wfvwrJNaQ98W7lY+H88mbFKyavhs+7YRfDN7nvNHKFGytj8pbov+apkY2KjEYPw1PHA/ERYYHsoRiJaMIEmhGUqUTjKG0pSuidkmz0WeUrqVa1ViJwjJ+8pSGDRsuvwc90vJRBAQAAOw=="

function render() {
  window.canvas = el("canvas", { width: 500, height: 300 });
  window.ctx = canvas.getContext("2d");
  window.w = window.canvas.width
  window.h = window.canvas.height

  document.body.appendChild(el("div.window",
    el("div#titlebar", {}, "Axiom QuickServe", el("span#title")),
    window.canvas 
    )
  );
  document.body.appendChild(el("script", {}, params.body))
  
  setTimeout(() => {
    document.title = getName();

    var a = new FileReader();
    a.onload = function(e) { 
      console.log("e.target.result", e.target.result)
      document.getElementById("titlebar").appendChild(el("a", {href:e.target.result, download:document.title}, "Download QuickServe Script"))
    }
    a.readAsDataURL(new Blob([params.body], {encoding:"UTF-8",type:"text/javascript;charset=UTF-8"}));
    
    
    document.getElementById("title").innerText = " - " + document.title;
    parent.postMessage({ title: document.title }, "*");
    onConnect()
    setInterval(() => { onUpdate() }, 1000 / 30)
  }, 100)
  document.onkeydown = (e) => {
    console.log(e)
    if (e.metaKey || e.ctrlKey) return;
    let code = e.key.length <= 1 ? e.key.charCodeAt(0) : e.keyCode;
    if (e.key == "Enter") code = 10;
    // if (code >= 65 && code <= 90 && (!e.shiftKey)) code += 32;
    onInput(code);
  }
}

function drawChar(cx, cy, c) {
  
  let x = cx * xs;
  let y = cy * ys;
  let w = xs;
  let h = ys;
  
  let i = chars.indexOf(c);
  ctx.clearRect(x, y, w, h);
  
  if (c == "™" || c == "%") { w *= 2; x -= 7; i -= 4 / 9; }; // special case wide characters
  
  if (c == " ") i = 121;

  ctx.drawImage(img,
    (i % 42) * xs, Math.floor(i / 42) * ys, w, h,
    x, y, w, h);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillRect(x, y, w, h)
    ctx.globalCompositeOperation = 'source-over';
  }
  
  let ys = 15;
  let xs = 9

  // Clear the screen.
  window.clearScreen = () => {
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Draw the specified text. The color parameter is a number between 0 (darkest) and 17 (lightest).
  window.drawText = (text, color, x, y) => {
    ctx.fillStyle = colors[color];
    text = text.toString();
    for (var i = 0; i < text.length; i++) {
      drawChar(x + i, y, text[i]);
    }
    // ctx.fillText(text, x * xs, y * ys);
  }
  
  // Draw the specified text, wrapping it so that it is no more than width characters wide.
  window.drawTextWrapped = (text, color, x, y, width) => {
    ctx.fillStyle = colors[color];
    text = text.toString();
    var row = 0;
    var col = 0;
    let words = text.split(" ");
    words.forEach(word => {
      if (col + word.length > width) {
        row += 1;
        col = 0;
      }
      drawText(word, color, x + col, y + row);
      col += word.length + 1;
    })
  }
  
  // Draw a box using the built-in box drawing characters.
  window.drawBox = (color, x, y, width, height) => {
    ctx.fillStyle = colors[color];
    for (var i = 1; i < width - 1; i++) {
      drawChar(x + i, y, "═");
      drawChar(x + i, y + height - 1, "═");
    }
    for (var j = 1; j < height - 1; j++) {
      drawChar(x, y + j, "║");
      drawChar(x + width - 1, y + j, "║");
    }
    drawChar(x, y, "╔");
    drawChar(x + width - 1, y, "╗");
    drawChar(x, y + height - 1, "╚");
    drawChar(x + width - 1, y + height - 1, "╝");
  }
  
  // Fill an area using the specified symbol.
  window.fillArea = (symbol, color, x, y, width, height) => {
    ctx.fillStyle = colors[color];
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        drawChar(x + i, y + j, symbol);
      }
    }
  }
  
  // Write this server's persisted data string. You can convert a JavaScript object to a JSON string using JSON.stringify().
  window.saveData = (data) => {
    try {
      localStorage.setItem(document.title, data);
    } catch (e) {}
  }
  
  // Read this server's persisted data string. You can convert a JSON string to a JavaScript object using JSON.parse().
  window.loadData = () => {
    try {
      return localStorage.getItem(document.title) || "";
    } catch (e) { 
      console.log("cannot load data", e)
      return "" 
    }
  };