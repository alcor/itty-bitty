import * as bitty from './bitty.js';

window.bitty = bitty;

var QS = document.querySelector.bind(document);
var QSS = document.querySelectorAll.bind(document);

var DATA_PREFIX = "data:text/html;base64,";
var DATA_PREFIX_8 = "data:text/html;charset=utf-8;base64,";
var DATA_PREFIX_BXZE = "data:text/html;charset=utf-8;bxze64,";
var DATA_PREFIX_GZIP = "data:text/html;charset=utf-8;gzip64,";


var b = document.documentElement.setAttribute(
  "data-useragent",
  navigator.userAgent
);

var bindings = {}
var quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    syntax: true,
    keyboard: { bindings },
    toolbar: "#menubar"
  }
});

quill.on('text-change', function(delta, oldDelta, source) {
  if (source == 'api') {
    console.debug("An API call triggered this change.");
  } else if (source == 'user') {
    console.debug("A user action triggered this change.", source);
  }
  handleContentChange();
});
quill.setSelection(0, Infinity);

var editor = quill.root;
console.log("editor", editor);
editor.autocomplete="off";
var importedFileData = undefined;

var content = editor;
window.onload = function() {
  window.onpopstate = function(e) {
    setContent(e.state);
  };
  window.onhashchange = function(e) {
    console.log("hash", e);
    location.reload();
  };
  document.body.onclick = function(e) {
    if (e.target == document.body) editor.focus();
  };

  content.ondragenter = function(e) {
    document.body.classList.add("drag");
  };
  content.ondragleave = function(e) {
    document.body.classList.remove("drag");
  };
  content.addEventListener("keydown", handleKey);
  content.addEventListener("keyup", handleInput);
  QS("#doc-title").addEventListener("keyup", handleInput);
  Array.from(document.getElementsByTagName("input")).forEach(i => i.addEventListener("keydown", handleInput))
  content.addEventListener("drop", handleDrop);
  content.addEventListener("paste", handlePaste);
  // content.contentEditable = "true";
  editor.focus();
  // document.execCommand("selectAll", false, null);
  QS("#qrcode").onclick = makeQRCode;
  QS("#upload").onclick = upload;
  QS("#share").onclick = share;
  if (!navigator.share) QS("#share").style.display = "none"
  QS("#twitter").onclick = tweetLink;
  QS("#copy").onclick = copyLink;
  QS("#mainmenu").onclick = () => { toggleMenu(QS("#mainmenu"))};

  QS("#doc-title").onclick = toggleMetadata;
  var hash = window.location.hash.substring(1);

  if (hash.length) {
    var slashIndex = hash.indexOf("/");
    var title = hash.substring(0, slashIndex);
    if (title.length)
      QS("#doc-title").innerText = document.title = decodeURIComponent(
        title.replace(/_/g, " ")
      );
    hash = hash.substring(slashIndex + 1);
    updateLink(hash, {title});
    if (hash.startsWith("?")) {
      hash = hash.substring(1);
      zipToString(hash, setContent);
    }
  } else {
    updateBodyClass();
  }
};

function setContent(html) {
  content.innerHTML = html;
  updateBodyClass();
}

function setFileName(name) {
  QS("#doc-file").innerText = name;
  if (name.length) {
    setContent("");
    document.body.classList.add("edited");
  }
}

function updateBodyClass(hasContent) {
  if (hasContent || importedFileData) {
    document.body.classList.add("edited");
  } else {
    document.body.classList.remove("edited");
  }
  document.body.classList.add("loaded");
}

function handleDrop(e) {
  e.preventDefault();
  if (e.dataTransfer.files) {
    var file = e.dataTransfer.files[0];
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function() {
        var url = reader.result;
        url = url.replace(DATA_PREFIX, DATA_PREFIX_8);
        bitty.compressDataURL(url, function(url2) {
          var ratio = url2.length / url.length;
          console.log("Compressed to", Math.round(ratio * 100) + "%", url2, url);
          if (e.ctrlKey)
            bitty.decompressDataURL(url2, undefined, function(url3) {
              console.log("Verified", url == url3);
            });
          if (ratio > 0.95) url2 = url;
          if (e.altKey) url2 = url2.replace(DATA_PREFIX_BXZE, "!");

          importedFileData = url2;
          updateLink(url2, {title:file.name}, true);
          setFileName(file.name);
        });
      },
      false
    );
    reader.readAsDataURL(file);
  }
  document.body.classList.remove("drag");
}

// TODO Command+Shift+T for title (H1), Command+Shift+H for headline (H2), Command+Shift+B for body text (remove any of the above)
function handleKey(e) {
  var code = e.which;
  var handled = false;
  if (e.metaKey && e.altKey) {
    handled = true;
    if (code == "1".charCodeAt(0)) {
      document.execCommand("formatBlock", true, "<h1>");
    } else if (code == "2".charCodeAt(0)) {
      document.execCommand("formatBlock", true, "<h2>");
    } else if (code == 220) {
      // \
      document.execCommand("removeFormat");
    } else if (code == "0".charCodeAt(0)) {
      document.execCommand("formatBlock", true, "");
    } else {
      handled = false;
    }
  } else if (e.metaKey) {
    if (code == "K".charCodeAt(0)) {
      handled = true;
      var url = prompt("Add a link", "");
      if (url) {
        document.execCommand("createLink", true, url);
      }
    }
  } else if (code == 9 ) {
      console.log("tab");
      e.preventDefault();
  }
  if (handled) e.preventDefault();
}

var codepenRE = /(https:\/\/codepen\.io\/[\w]+\/(\w+)\/(\w+))/;
function handlePaste(e) {
  var clipboard = window.clipboardData || e.clipboardData;
  var text = clipboard.getData("Text") || clipboard.getData("text/plain");
  if (!text) return;
  let match =  text.match(codepenRE);
  if (match) {
    fetchCodepen(match[0]);
  }
}

var TEMPLATE_MARKER = "/*use-itty-bitty-template*/";
function fetchCodepen(url) {
  var h, c, j;
  $.when(
    $.get({ url: url + ".html", cache: false }, function(html) {
      h = html;
    }),
    $.get({ url: url + ".css", cache: false }, function(css) {
      c = css;
    }),
    $.get({ url: url + ".js", cache: false }, function(js) {
      j = js;
    })
  ).then(function() {
    var useTemplate = c.indexOf(TEMPLATE_MARKER) >= 0;
    var string =
      '<style type="text/css">' +
      c +
      "</style>" +
      h +
      '<script type="text/javascript">' +
      j +
      "</script>";
    stringToZip(string, function(zip) {
      setFileName("✒️" + url);
      var title = QS("#doc-title").innerText;
      setTimeout(function() {
        var data = (useTemplate ? "" : DATA_PREFIX_BXZE) + zip;
        importedFileData = data;
        updateLink(data, {title});
      }, 300);
    });
  });
}



function handleInput(e) {
   handleContentChange(e);
}
function getMetadata() {
  let formData = new FormData(document.forms[0]);
  var object = {};
  formData.forEach((value, key) => object[key] = value);
  return object;
}

function handleContentChange() {

  var text = editor.innerText;
  let hasContent = text.trim().length > 0;

  updateBodyClass(hasContent);

  if (!hasContent) return;

  var metadata = getMetadata();

    var rawHTML = text.indexOf("</") > 0;
    if (rawHTML) {
      text = text.replace(/[ |\t]+/g, " ").replace(/> +</g, "> <");
    } else {
      text = content.innerHTML;
    }
  

    if (text.trim().length) {
      const t0 = performance.now();
      bitty.compressString(text, bitty.GZIP64_MARKER, function(zip) {
        const t1 = performance.now();
        // bitty.compressString(text, bitty.LZMA64_MARKER, function(zip2) {
        //   const t2 = performance.now();
        //   console.debug("gz", Math.round(zip.length/text.length*100) + "%", Math.round((t1-t0)),"ms");
        //   console.debug("lz", Math.round(zip2.length/text.length*100) + "%", Math.round((t2-t1)), "ms");
        // });
        zip.replace("=","")

        if (rawHTML) {
          updateLink(DATA_PREFIX_GZIP + zip, metadata);
        } else {
          updateLink("?" + zip, metadata);
        }
      });
      setFileName("");
    } else if (importedFileData) {
      updateLink(importedFileData, {title});
    } else {
      updateLink("");
    }
  
}

var maxLengths = {
  // "#twitter": 4088,
  // "#bitly": 2048,
  "#qrcode": 2953
};

let bittyLink = undefined;
function updateLink(url, metadata, push) {
  
  let title = metadata.title;
  // if (title) title = encodeURIComponent(title.trim().replace(/\s/g, "_"));
  
  let includeMetadata = !metadata.includeMetadata;
  let path = includeMetadata ? "/" : bitty.metadataToPath(metadata) ?? "/";
  let prefix = includeMetadata ? bitty.encodePrettyComponent(title) : "";

  if (url.length) {
    url = path + "#" + prefix + "/" + url;
  } else {
    url = "/edit";
  }

  document.getElementById("doc-title-text").innerText = title.length ? title : "untitled";

  bittyLink = new URL(url, document.location).href;

  document.getElementById("canonical").href = bittyLink;

  console.log({bittyLink});


  var hash = location.hash;
  // if (push || !hash || !hash.length) {
  //   window.history.pushState(content.innerHTML, null, url);
  // } else {
  //   window.history.replaceState(content.innerHTML, null, url);
  // }
  var length = bittyLink.length;

  QS("#length").innerText = length + " bytes";
  QS("#length").onclick = () => {
    window.open(bittyLink, "_blank");
  }
  for (var key in maxLengths) {
    var maxLength = maxLengths[key];
    if (length > maxLength) {
      QS(key).classList.add("invalid");
    } else {
      QS(key).classList.remove("invalid");
    }
  }
}

function share() {
  navigator.share({
    title: 'itty.bitty',
    url: bittyLink
  }).then(() => {
    console.log('Thanks for sharing!');
  })
  .catch(console.error);
}
function makeQRCode() {
  var url =
    "https://chart.googleapis.com/chart?cht=qr&chs=512x512&chld=L|1&choe=UTF-8&chl=" +
    encodeURIComponent(location.href);
  this.href = url;
}
function upload() {
  document.getElementById('file-input').click();
}

function toggleMenu(el) {
  el.classList.toggle("menu-visible");
}

function toggleMetadata(e) {
  if (e.target.closest(".menu")) return;
  console.log(e)
  QS("#md-contents").classList.toggle("menu-visible");
  QS("#doc-title").classList.toggle("open");
  QS("#md-title").focus();
}
function copyThenLink() {
  copyLink();
  return confirm("Copied your link to the clipboard. Paste it to share.");
}
function copyLink() {
  var text = location.href;
  var dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);

  document.body.classList.add("copied");
  setTimeout(function() {
    document.body.classList.remove("copied");
  }, 2000);
}

function saveLink() {
  var url = "/" + location.hash;
  window.history.pushState(null, null, url);
  location.reload();
}

function tweetLink() {
  var url =
    "https://twitter.com/intent/tweet?url=" + encodeURIComponent(location.href);
  window.open(url, "_blank");
  return false;
}
