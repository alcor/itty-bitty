var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)

var DATA_PREFIX = 'data:text/html;base64,'
var DATA_PREFIX_8 = 'data:text/html;charset=utf-8;base64,'

var content = undefined
window.onload = function() {
  window.onpopstate = function(e) { setContent(e.state) }

  content = document.getElementById("content");
  content.ondrop = dropEvent;
  document.body.ondragenter = function(e) { document.body.classList.add("drag"); };
  document.body.ondragleave = function(e) { document.body.classList.remove("drag"); };
  document.body.onclick = function() { content.focus()};
  content.oninput = handleInput;
  content.onkeydown = handleKey;
  content.contentEditable = 'true';
  content.focus();
  $('#qrcode').onclick = makeQRCode
  $('#copy').onclick = copyLink
  var hash = window.location.hash.substring(1)
  if (hash.length) {
    updateLink(hash)
    if (hash.startsWith('!')) { hash = hash.substring(1) }
    if (!hash.startsWith("data:")) { hash = 'data:text/html;charset=utf-8;base64,' + hash; }
    dataToString(hash, setContent);
  } else {
    updateBodyClass()
  }
};

function setContent(html) {
  content.innerHTML = html
  updateBodyClass()
}

function updateBodyClass() {
  var length = content.innerText.length;
  document.body.classList.toggle("has-content", length)
  document.body.classList.toggle("placeholder", !length)
}

function dropEvent(e) {
  e.preventDefault();
  if (e.dataTransfer.files) {
    var file = e.dataTransfer.files[0]
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      var url = reader.result;
      url = url.replace(DATA_PREFIX, DATA_PREFIX_8)
      updateLink(url, true)
      setContent('&nbsp;<span class="ib-file" contentEditable="false">📄' +  file.name + '</span><br><br>');
    }, false);
    reader.readAsDataURL(file);
  }
  document.body.classList.remove("drag")
}

function handleKey(e) {
  var code = e.which;
  if (e.metaKey && e.altKey) {
    if (code == '1'.charCodeAt(0)) {
      document.execCommand("formatBlock", true, "<h1>");
    } else if (code == '2'.charCodeAt(0)) {
      document.execCommand("formatBlock", true, "<h2>");
    } else if (code == 220) { // \
      document.execCommand("removeFormat");
    } else if (code == '0'.charCodeAt(0)) {
      document.execCommand("formatBlock", true, "");
    }
    e.preventDefault()
  } else if (e.metaKey) {
    if (code == 'K'.charCodeAt(0)) {
      var url = prompt("Add a link", "")
      if (url) { document.execCommand("createLink", true, url); };
    }
  }
};

function stringToData(string, callback) {
  if (!string.length) return callback("");
  var a = new FileReader();
  a.onload = function(e) { callback(e.target.result.replace()) }
  a.readAsDataURL(new Blob([string], {encoding:"UTF-8",type:"text/html;charset=UTF-8"}));
}

function dataToString(data, callback) {
  var blob = dataURItoBlob(data)
  var reader = new FileReader();
  reader.onload = function(e) { callback(reader.result) }
  reader.readAsText(blob);
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var arrayBuffer = new ArrayBuffer(byteString.length);
  var _ia = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
  }
  var dataView = new DataView(arrayBuffer);
  var blob = new Blob([dataView], { type: mimeString });
  return blob;
}

function stripPrefix(url) {
  if (url) {
    var dataRE = /data:(text\/html[^,]*)(;base64),(.*)/
    var match = url.match(dataRE);
    if (match) return "!" + match[3];
  }
  return url;
}

function handleInput(e) {
  updateBodyClass();
  var text = content.innerText
  var strip = false;
  if (text.includes("</")) {
    text = text.replace(/[\n|\t]+/g,' ').replace(/> +</g, '> <')
  } else {
    var title = text.split("\n")[0]
    text = content.innerHTML
    strip = true
  }
  stringToData(text, function(hash) {
    var plain = encodeURIComponent(text)
    if (strip) hash = stripPrefix(hash);
    updateLink(hash)
  });
}

var maxLengths = {
  "#twitter": 4088,
  "#qrcode": 2610,
  "#bitly": 2048,
}
function updateLink(url, push) {
  url = "/#" + url
  var hash = location.hash
  if (push || !hash || !hash.length) {
    window.history.pushState(content.innerHTML, null, url);
  } else {
    window.history.replaceState(content.innerHTML, null, url);
  }

  var length = location.href.length
  $('#length').innerText = length + " bytes"
  $('#length').href = url
  for (var key in maxLengths) {
    var maxLength = maxLengths[key]
    $(key).classList.toggle("invalid", length > maxLength)
  };
  
}


function makeShortLink() {

}

function makeQRCode() {
  var url = "https://zxing.org/w/chart?cht=qr&chs=548x548&chld=L|1&choe=UTF-8&chl=" + encodeURIComponent(location.href)
  this.href = url

  // window.open(url, '_blank');
  // return false;
  //https://developers.google.com/chart/infographics/docs/qr_codes
}

function copyLink() {
  var text = location.href
  var dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

function saveLink() {
  var url = "/" + location.hash
  window.history.pushState(null, null, url);
  location.reload()   
}

function tweetLink() {
  var url = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(location.href);
  window.open(url, '_blank');
}
