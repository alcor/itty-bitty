// var $ = document.querySelector.bind(document)
// var $$ = document.querySelectorAll.bind(document)

var DATA_PREFIX = 'data:text/html;base64,'
var DATA_PREFIX_8 = 'data:text/html;charset=utf-8;base64,'
var DATA_PREFIX_BAZE = 'data:text/html;charset=utf-8;baze64,'

var content = undefined
window.onload = function() {
  window.onpopstate = function(e) { setContent(e.state) }
  window.onhashchange = function(e) { console.log("hash", e); location.reload() }
  document.body.ondragenter = function(e) { document.body.classList.add("drag"); };
  document.body.ondragleave = function(e) { document.body.classList.remove("drag"); };
  document.body.onclick = function(e) { if (e.target == document.body) content.focus() };
  content = document.getElementById("content");
  content.addEventListener('keydown', handleKey);
  content.addEventListener('keyup', handleInput);
  content.addEventListener('drop', handleDrop);
  content.addEventListener('paste', handlePaste)
  content.contentEditable = 'true';
  content.focus();
  document.execCommand('selectAll',false,null);
  $('#qrcode')[0].onclick = makeQRCode
  $('#copy')[0].onclick = copyLink
  var hash = window.location.hash.substring(1)
  if (hash.length) {
    updateLink(hash)
    if (hash.startsWith('!')) {
      hash = hash.substring(1)
      zipToString(hash, setContent);
    }
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
  if (length) {
    $('body').addClass("edited")
  } else {
    $('body').removeClass("edited")
  }
}

function handleDrop(e) {
  e.preventDefault();
  if (e.dataTransfer.files) {
    var file = e.dataTransfer.files[0]
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      var url = reader.result;
      url = url.replace(DATA_PREFIX, DATA_PREFIX_8)
      var length = url.length;
      compressDataURI(url, function(url){
        console.log("Compressed to", url.length / length)
        if (e.altKey) url = url.replace(DATA_PREFIX_BAZE, "!")
        updateLink(url, true)
        setFileContent('📄' + file.name)
      })
    }, false);
    reader.readAsDataURL(file);
  }
  document.body.classList.remove("drag")
}

function setFileContent(name) {
  setContent('&nbsp;<span class="ib-file" contentEditable="false">' + name + '</span><br><br>'); 
}

function handleKey(e) {
  var code = e.which;
  var handled = false;
  if (e.metaKey && e.altKey) {
    handled = true;
    if (code == '1'.charCodeAt(0)) {
      document.execCommand("formatBlock", true, "<h1>");
    } else if (code == '2'.charCodeAt(0)) {
      document.execCommand("formatBlock", true, "<h2>");
    } else if (code == 220) { // \
      document.execCommand("removeFormat");
    } else if (code == '0'.charCodeAt(0)) {
      document.execCommand("formatBlock", true, "");
    } else {
      handled = false
    }

  } else if (e.metaKey) {
    if (code == 'K'.charCodeAt(0)) {
      handled = true;
      var url = prompt("Add a link", "")
      if (url) { document.execCommand("createLink", true, url); };
    }
  }
  if (handled) e.preventDefault()
};

var codepenRE = /(https:\/\/codepen\.io\/[\w]+\/(\w+)\/(\w+))/
function handlePaste(e) {
  var clipboard = window.clipboardData || e.clipboardData
  var text = clipboard.getData('Text') || clipboard.getData('text/plain')
  if (match = text.match(codepenRE)) {
    fetchCodepen(match[0])
  }
}


var TEMPLATE_MARKER = "/*use-itty-bitty-template*/"
function fetchCodepen(url) {
  var h, c, j;
  $.when(
    $.get(url + ".html", function(html) { h = html; }),
    $.get(url + ".css", function(css) { c = css; }),
    $.get(url + ".js", function(js) { j = js; })
  ).then(function() {
    var useTemplate = c.indexOf(TEMPLATE_MARKER) >= 0
    var string = '<style type="text/css">' + c + '</style>' +  h + '<script type="text/javascript">' + j + '</script>'
    console.log(c, c.indexOf(TEMPLATE_MARKER))
    stringToZip(string, function(zip) {
      setFileContent('✒️' + url)
      setTimeout(function() {
          updateLink((useTemplate ? "," : DATA_PREFIX_BAZE) + zip)
      }, 300);
    });
  });
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
  if (text.indexOf("</") > 0) {
    text = text.replace(/[\n|\t]+/g,' ').replace(/> +</g, '> <')
  } else {
    var title = text.split("\n")[0]
    text = content.innerHTML
    strip = true
  }
   
  stringToZip(text, function(zip) {
    updateLink("!" + zip)
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

  $('#length')[0].innerText = length + " bytes"
  $('#length')[0].href = url
  for (var key in maxLengths) {
    var maxLength = maxLengths[key]
    if (length > maxLength) {
      $(key).addClass("invalid")
    } else {
      $(key).removeClass("invalid")
    }
    
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
