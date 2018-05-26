var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)

window.onload = function() {
  becomeEditable()

  document.body.classList.toggle("edited", container.innerText.length)

  document.ondrop = dropEvent;

  var dragcount = 0;
  content.ondragenter  = function(e) {
    console.log("enter", e)
    dragcount++
    document.body.classList.toggle("drag", dragcount)
    event.preventDefault()
  };

  content.ondragleave  = function(e) {
    console.log("leave", e)
    dragcount--
    document.body.classList.toggle("drag", dragcount)
    event.preventDefault()
  };

  
};

var DATA_PREFIX = 'data:text/html;charset=utf-8,'
var DATA_PREFIX2 = 'data:text/html;charset=utf-8;base64,'
var iframe = undefined;

var container = undefined
function becomeEditable() {
  container = document.getElementById("content")
  container.addEventListener('input', inputEvent);
  container.contentEditable = 'true';
  container.focus();
  container.onkeydown = handleKey;
  var hash = window.location.hash.substring(1)
  console.log("load", hash)

  if (hash.length) {
    if (hash.startsWith('!')) {
      hash = hash.substring(1)
    }
    if (!hash.startsWith("data:")) hash = 'data:text/html;charset=utf-8;base64,' + hash;

    dataToString(hash, function(html) {
      container.innerHTML = html
    })
  }
}

function dropEvent(e) {
  dragcount = 0
  document.body.classList.remove("drag")

  console.log("drop")
  e.preventDefault();
  if (e.dataTransfer.files) {
    var file = e.dataTransfer.files[0]
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      var url = reader.result;
      content.innerHTML = "📄 " +  file.name 
      updateLink(url)
    }, false);
    reader.readAsDataURL(file);
  }
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

function handleKey(e) {
    var code = e.which;
    console.log(e)
  if (e.metaKey && e.altKey) {
    if (code == '1'.charCodeAt(0)) {
      document.execCommand("formatBlock", true, "<h1>");
    } else if (code == '2'.charCodeAt(0)) {
      document.execCommand("formatBlock", true, "<h2>");
    } else if (code == 220) { // \
      console.log("remove")
      document.execCommand("removeFormat");
    } else if (code == '0'.charCodeAt(0)) {
      console.log("clear block")
      document.execCommand("formatBlock", true, "");
    }
    e.preventDefault()
  } else if (e.metaKey) {

    console.log("KEY", e, 'V'.charCodeAt(0), 'K'.charCodeAt(0) )
    if (code == 'V'.charCodeAt(0)) {
      // console.log("paste")
      // e.preventDefault()
    } else if (code == 'K'.charCodeAt(0)) {
      console.log("link")
      var url = prompt("Add a link", "")
      document.execCommand("createLink", true, url);
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
  // if (!data.length) return callback("");
  var reader = new FileReader();
  reader.onload = function(e) { callback(reader.result) }
  reader.readAsText(blob);
}

function stripPrefix(url) {
  if (url) {
    var dataRE = /data:(text\/html[^,]*)(;base64),(.*)/
    var match = url.match(dataRE);
    if (match) return "!" + match[3];
  }
  return url;
}

function inputEvent(e) {
  document.body.classList.toggle("edited", container.innerText.length)
  var content = container.innerText
  if (content.includes("</")) {
    content = content.replace(/[\n|\t]+/g,' ').replace(/> +</g, '> <')
  } else {
    var title = content.split("\n")[0]
    content = container.innerHTML
    var meta = []
    meta.push("<title>" + title + "</title>")
    document.head.childNodes.forEach( function(el) {
      if (el.attributes && !el.attributes.doNotEncode) meta.push(el.outerHTML);
    });
  }

  console.log("Encoding:\n" + content)
  stringToData(content, function(hash) {
    var plain = encodeURIComponent(content)
    // if (plain.length < hash.length) hash = plain;
    updateLink(hash)
  });
}

function updateLink(url) {
  url = stripPrefix(url);
  // $('#link').href = "/#" + url
  // $('#link').innerText = $('#link').href
  window.history.replaceState(null, null, "/#" + url);
  var length = url.length
  $('#length').innerText = (url.length - 1)/1000 + "/1000"
}

function makeLink() {

}

function makeQRCode() {
  //https://developers.google.com/chart/infographics/docs/qr_codes
  //https://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=
  // chart.googleapis.com/chart?chs=400x400&cht=
  location.href = "https://zxing.org/w/chart?cht=qr&chs=548x548&chld=L|1&choe=UTF-8&chl=" + encodeURIComponent(location.href)

}

function makeShortLink() {

}

function textToClipboard (text) {
  var dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

function copyLink() {
  textToClipboard(location.href)
}