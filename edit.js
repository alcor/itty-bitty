var QS = document.querySelector.bind(document);
var QSS = document.querySelectorAll.bind(document);

var DATA_PREFIX = "data:text/html;base64,";
var DATA_PREFIX_8 = "data:text/html;charset=utf-8;base64,";
var DATA_PREFIX_BXZE = "data:text/html;charset=utf-8;bxze64,";

var b = document.documentElement.setAttribute(
  "data-useragent",
  navigator.userAgent
);

var importedFileData = undefined;

var content = undefined;
window.onload = function() {
  document.addEventListener("notesSaved", renderSavedNotes);

  window.onpopstate = function(e) {
    setContent(e.state);
  };

  window.onhashchange = function(e) {
    console.log("hash", e);
    location.reload();
  };

  document.body.onclick = function(e) {
    if (e.target == document.body) content.focus();
  };

  content = document.getElementById("content");

  content.ondragenter = function(e) {
    document.body.classList.add("drag");
  };

  content.ondragleave = function(e) {
    document.body.classList.remove("drag");
  };

  content.addEventListener("keydown", handleKey);
  content.addEventListener("keyup", handleInput);

  QS("#doc-title").addEventListener("keyup", handleInput);

  content.addEventListener("drop", handleDrop);
  content.addEventListener("paste", handlePaste);
  content.contentEditable = "true";
  content.focus();

  document.execCommand("selectAll", false, null);

  QS("#qrcode").onclick = makeQRCode;
  QS("#copy").onclick = copyLink;

  var hash = window.location.hash.substring(1);

  if (hash.length) {
    var slashIndex = hash.indexOf("/");
    var title = hash.substring(0, slashIndex);

    if (title.length)
      QS("#doc-title").innerText = document.title = decodeURIComponent(
        title.replace(/_/g, " ")
      );

    hash = hash.substring(slashIndex + 1);
    updateLink(hash, title);

    if (hash.startsWith("?")) {
      hash = hash.substring(1);
      zipToString(hash, setContent);
    }
  } else {
    updateBodyClass();
  }

  // Set title to today's date on load, if not set
  var titleElement = document.getElementById("doc-title");

  if (titleElement.innerText.trim() === "") {
    var today = new Date().toDateString();
    titleElement.innerText = today + " " + randomAlphanum();
  }

  // Trigger load saved notes from localStorage
  setSavedNotes(getSavedNotes());
};

function getSavedNotes() {
  var notesJSON = window.localStorage.getItem("notesStore") || "[]";
  var notes = JSON.parse(notesJSON);

  return notes;
}

function setSavedNotes(notes) {
  notes = notes || [];

  var notesJSON = JSON.stringify(
    notes.filter(({ link, title }) => link && title)
  );

  window.localStorage.setItem("notesStore", notesJSON);

  // Trigger notesSaved event
  var event = new CustomEvent("notesSaved", { detail: notes });
  document.dispatchEvent(event);

  return notes;
}

function renderSavedNotes(event) {
  var template = ({ link, title }) => `
    <li>
      <a href="${link}" class="link-title" target="_blank"> ${title} </a>
      <a class="remove" href="#"> &times; </a>
    </li>
    `;

  var savedContainer = document.getElementById("saved");
  savedContainer.innerHTML = null;

  return event.detail.map(note => {
    var element = htmlToElement(template(note));

    var removeBtn = element.querySelector(".remove");

    removeBtn.onclick = removeNoteByLink.bind(null, note.link);

    savedContainer.appendChild(element);
    return element;
  });
}

function removeNoteByLink(link, event) {
  event.preventDefault();

  var currentNotes = getSavedNotes();
  var prevLinks = currentNotes.map(function(note) {
    return note.link;
  });

  var existingIndex = prevLinks.indexOf(link);

  if (!!~existingIndex) {
    currentNotes.splice(existingIndex, 1);
  }

  return setSavedNotes(currentNotes);
}

function saveNoteToLocalStorage(link, title, prevLink) {
  var currentNotes = getSavedNotes();
  var prevLinks = currentNotes.map(function(note) {
    return note.link;
  });

  var existingIndex = prevLinks.indexOf(prevLink);

  var note = { link: link, title: title };

  if (!!~existingIndex) {
    currentNotes[existingIndex] = note;
  } else {
    currentNotes.push(note);
  }

  return setSavedNotes(currentNotes);
}

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

function updateBodyClass() {
  var length = content.innerText.length;
  if (length || importedFileData) {
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
        compressDataURI(url, function(url2) {
          var ratio = url2.length / url.length;
          console.log("Compressed to", ratio);
          if (e.ctrlKey)
            decompressDataURI(url2, undefined, function(url3) {
              console.log("Verified", url == url3);
            });
          if (ratio > 0.95) url2 = url;
          if (e.altKey) url2 = url2.replace(DATA_PREFIX_BXZE, "!");

          importedFileData = url2;
          updateLink(url2, file.name, true);
          setFileName("📄" + file.name);
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
  }
  if (handled) e.preventDefault();
}

var codepenRE = /(https:\/\/codepen\.io\/[\w]+\/(\w+)\/(\w+))/;
function handlePaste(e) {
  var clipboard = window.clipboardData || e.clipboardData;
  var text = clipboard.getData("Text") || clipboard.getData("text/plain");
  if ((match = text.match(codepenRE))) {
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
        updateLink(data, title);
      }, 300);
    });
  });
}

function handleInput(e) {
  updateBodyClass();
  var text = content.innerText;
  var title = QS("#doc-title").innerText;

  var rawHTML = text.indexOf("</") > 0;
  if (rawHTML) {
    text = text.replace(/[\n|\t]+/g, " ").replace(/> +</g, "> <");
  } else {
    text = content.innerHTML;
  }

  if (text.trim().length) {
    stringToZip(text, function(zip) {
      if (rawHTML) {
        updateLink(DATA_PREFIX_BXZE + zip, title);
      } else {
        updateLink("?" + zip, title);
      }
    });
    setFileName("");
  } else if (importedFileData) {
    updateLink(importedFileData, title);
  } else {
    updateLink("");
  }
}

var maxLengths = {
  // "#twitter": 4088,
  // "#bitly": 2048,
  "#qrcode": 2953
};

function updateLink(url, title, push) {
  var originalTitle = title;

  if (title) title = encodeURIComponent(title.trim().replace(/\s/g, "_"));
  if (url.length) {
    url = "/#" + (title || "") + "/" + url;
  } else {
    url = "/edit";
  }

  var hash = location.hash;
  var originalUrl = "/" + hash;

  if (push || !hash || !hash.length) {
    window.history.pushState(content.innerHTML, null, url);
  } else {
    window.history.replaceState(content.innerHTML, null, url);
  }

  var length = location.href.length;

  QS("#length").innerText = length + " bytes";
  QS("#length").href = url;
  for (var key in maxLengths) {
    var maxLength = maxLengths[key];
    if (length > maxLength) {
      QS(key).classList.add("invalid");
    } else {
      QS(key).classList.remove("invalid");
    }
  }

  // All done? Update localStorage
  saveNoteToLocalStorage(url, originalTitle, originalUrl);
}

function makeQRCode() {
  var url =
    "https://zxing.org/w/chart?cht=qr&chs=548x548&chld=L|1&choe=UTF-8&chl=" +
    encodeURIComponent(location.href);
  this.href = url;
}

function toggleMenu() {
  QS("#toolbar").classList.toggle("menu-visible");
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

  document.body.addClass("copied");
  setTimeout(function() {
    document.body.removeClass("copied");
  }, 300);
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
}

function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function randomAlphanum() {
  return btoa(Math.ceil(Math.random() * 10000).toString()).replace(/=/g, "");
}
