  import * as bitty from './bitty.js';

  const HEAD_TAGS = () => btoa('<base target="_top">\n');
  const HEAD_TAGS_EXTENDED = () => btoa(`<meta charset="utf-8"><meta name="viewport" content="width=device-width"><base target="_top"><style type="text/css">body{margin:0 auto;padding:12vmin 10vmin;max-width:35em;line-height:1.5em;font-family:-apple-system,BlinkMacSystemFont,sans-serif;word-wrap:break-word;}@media(prefers-color-scheme: dark){body{color:white;background-color:#111;}}</style>  `);
 

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker
  //     .register('/worker.js')
  //     .then(function() { console.debug("Service Worker Registered"); });
  // }

  function dismiss() {
    if (document.getElementById("never").checked) window.localStorage.setItem('toasted', true);
    document.body.classList.remove("toasting")
  }
  
  function addToast() {
    // `<div id="toast">
    // itty.bitty is experimental technology that renders linked content from outside sources.
    // <a href="http://toast.bitty.site" target="_blank">Learn&nbsp;more</a>.
    // <br><br>This content is only as trustworthy as its source, and it should be treated with the caution you would show any insecure web page.
    // <br><br><button onclick="dismiss()">I understand</button> <input id="never" type="checkbox"><label for="never">Never show this</label>
    // </div>`
  }

  function setFavicon(favicon) {
    document.getElementById("favicon").href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><text y=".9em">'+ favicon + '</text></svg>'
  }

  window.el = function (tagName, attrs, ...children) {
    let l = document.createElement(tagName);
    Object.entries(attrs).forEach(([k,v]) => l[k] = v);
    children.forEach((c) => l.appendChild(c));
    return l;
  }

  const renderers = {
    "application/ld+json": {script:"recipe"},
    "text/rawhtml": {script:"parse"},
    "javascript": {script:"bookmarklet"},
    "web3": {script:"web3", mode:"frame"},
}

  window.addEventListener("message", function(e) {
    console.debug("Message:", e.origin, e.data)
      if (e.data.title) document.title = e.data.title;
      if (e.data.favicon) setFavicon(e.data.favicon);
      if (e.data.updateURL) {
        let path = "/" + e.data.title.replace(/\s/g, "-");
        if (e.data.description) path += "/d/" + encodeURIComponent(e.data.description);
        if (e.data.favicon) path += "/f/" + encodeURIComponent(e.data.favicon);
        if (e.data.image) path += "/i/" + encodeURIComponent(btoa(e.data.image));
        window.location.pathname = path;
      }
      if (e.data.replaceURL) {
        window.history.replaceState(null, null, e.data.replaceURL);
        renderContent();
      }
      if (e.data.setStorage) document.localStorage.setItem(contentHash, e.data.set);
      if (e.data.getStorage) document.getElementById("iframe").postMessage(document.localStorage.getItem(contentHash), e.origin)
  }, false);  
  
  function renderContent() {    
    var fragment = window.location.hash.substring(1);

    if (window.location.search) { // Redirect search to path (coming out of server opengraph forwarding)
      window.history.replaceState(null, null, window.location.search.substring(1) + "#" + fragment);
    }

    var isIE = navigator.userAgent.match(/rv:11/);
    var isEdge = navigator.userAgent.match(/Edge\//);
    var isWatch = (window.outerWidth < 200);

    if (fragment.length < 3) {
      return location.href = "/edit";
    }

    // if (!window.localStorage.getItem('toasted')) document.body.classList.add("toasting");

    var iframe = document.getElementById("iframe");
    var dataPrefix = undefined;
    var renderMode = "data";

    let components = window.location.pathname.substring(1).split("/");
    let info = {}
    info.title = decodeURIComponent(components.shift()).replace(/-/g, " ").replace(/–/g, "-");
    let i;
    for (i = 0; i < components.length; i+=2) {
      let key = components[i];
      let value = decodeURIComponent(components[i+1]);
      if (key.length && value.length) info[key] = value;
    }
    info.d = info.d?.replace(/-/g, " ").replace(/–/g, "-");

    if (info.f) setFavicon(info.f);

    var slashIndex = fragment.indexOf("/");
    var title = fragment.substring(0, slashIndex) || info.title;
    if (title) title = decodeURIComponent(title.replace(/_/g, " "))
    var type = undefined;
    var description = undefined;

    document.title = title ?? location.hostname;

    fragment = fragment.substring(slashIndex + 1);
    var editable = fragment.charAt(0) == "?";
    var link = document.getElementById("edit");
    if (editable) {
      fragment = fragment.substring(1);
      document.body.appendChild(el("a", {id: "edit", onclick: function() { location.href = "/edit" + location.hash}}))
      // link.href = "/edit" + location.hash;
    }

    if (fragment.startsWith("data:")) {
      let info = bitty.infoForDataURL(fragment);
      const renderer = info.params?.render || renderers[info.mediatype]?.script;
      
      type = "data:" + info.mediaType;

      if (info.mediatype == "text/html") {
        dataPrefix = HEAD_TAGS();
      } else if (info.mediatype == "text/plain") {
        //dataPrefix = HEAD_TAGS_EXTENDED();
        //fragment = fragment.replace("text/plain", "text/html");
        renderMode = "data";
      } else if (info.type == "text") {
      } else if (info.type == "image") {
      } else if (info.type == undefined) {
      } else if (!renderer) {
        console.log("unknown type, rendering as download")
        renderMode = "download";
      }

      if (renderer) {
        var script = renderer;
        if (script.indexOf("/") == -1)  script = location.origin + '/render/' + script + '.js'
        renderMode = "script";
      }

      // if (info?.encoding == "base64" && !info.params?.encode) {
      //   bitty.compressDataURL(fragment, function(compressedFragment) {
      //     console.log("Compressing long url", fragment.length, compressedFragment.length)
      //     window.location.hash = window.location.hash.replace(fragment, compressedFragment);
      //     window.location.reload();
      //     console.log("Reloading")
      //   })
      // }
    } else {
      var colon = fragment.indexOf(":");
      if ( colon > 0 && colon < 15) {
        document.body.classList.remove("toasting");
        let scheme = fragment.substring(0,colon);
        type = scheme;
      
        let renderer = renderers[scheme];
        if (renderer) {
          return renderContentWithScript(renderer.script, title, info, fragment, fragment);
        }
        return window.location.replace(fragment);
      }

      var compressed = true;
      dataPrefix = HEAD_TAGS_EXTENDED();
      let encoding = !compressed ? "base64," : (fragment.startsWith("XQA") ? bitty.LZMA64_MARKER : bitty.GZIP64_MARKER);
      fragment = "data:text/html;charset=utf-8;" + encoding + "," + fragment;
    }


    if ((isEdge || isIE) && location.href.length == 2083) {
      let element = document.getElementById("warning") || document.body.appendChild(el("div", {id: "warning"}))
      element.innerHTML =
        'Edge only supports shorter URLs (maximum 2083 bytes).<br>Larger sites may require a different browser.<br><a href="http://reference.bitty.site">Learn more</a>';
    }

    bitty.decompressDataURL(fragment, dataPrefix, function(dataURL, dataContent) {
      if (!dataURL) return;
      iframe.sandbox = "allow-downloads allow-scripts allow-forms allow-top-navigation allow-popups allow-modals allow-popups-to-escape-sandbox";

      if (isIE && renderMode == "data") renderMode = "frame";
      let contentTarget// = iframe.contentWindow.document;
      if (isWatch) {
        contentTarget = document;
      }
      console.log("Rendering mode: " + "\x1B[1m" + renderMode)
      // dataURL = dataURL.replace("application/ld+json", "text/plain");
      if (renderMode == "download") {
        try {
          //let dl = document.querySelector("#download");
          let extension = title.split(".")
          let dl = el("a", {id: "download", href:dataURL, download: title},
            el("div", {id: "dl-image", innerText:extension.pop() ?? ""}),
            el("div", {id: "dl-name", innerText:"title"}),
            el("div", {id: "dl-button"}),
          )
          document.body.append(dl)
          document.body.classList.add("download");
          dl.click();
          return;
        } catch (e) {
          console.log("DL error", e)
          iframe.src = dataURL;
        }
      } else if (renderMode == "data") {
        iframe.src = dataURL;
      } else {
        bitty.dataToString(dataURL, function(content) {
          if (renderMode == "frame") {
            writeDocContent(contentTarget, content)
          } else if (renderMode == "script") {
            renderContentWithScript(script, title, info, content, dataURL);
          }
        });
      }
    });
    
    let recordHistory = false
    if (recordHistory) recordToHistory(title, type, description, window.location);

  };

  window.addEventListener('load',renderContent);
  // window.addEventListener('hashchange',renderContent);

  const SCRIPT_LOADER = `<!doctype html><meta charset=utf-8><script src="${location.origin}/render.js"></script>`
  function renderContentWithScript(script, title, info, body, url) {
    if (script.indexOf("/") == -1)  script = location.origin + '/render/' + script + '.js'
    iframe.onload = (() => {
      iframe.contentWindow.postMessage({script, url, title, info, body}, "*");
      delete iframe.onload
    });
    // writeDocContent(iframe.contentWindow.document, SCRIPT_LOADER)
    // iframe.srcdoc = SCRIPT_LOADER;
    iframe.src = "data:text/html," + SCRIPT_LOADER;
  }

  function writeDocContent(doc, content) {
    doc.open();
    doc.write(content);
    doc.close();
  }


function recordToHistory() { 
  if (navigator.storage && navigator.storage.persist)
    navigator.storage.persist().then(granted => {
    if (granted)
      console.log("Storage will not be cleared except by explicit user action");
    else
      console.log("Storage may be cleared by the UA under storage pressure.");
  });

  let openRequest = indexedDB.open("history", 1);

  openRequest.onupgradeneeded = function(event) {
    const db = event.target.result;
    const transaction = event.target.transaction;
    let objectStore;
    if (!db.objectStoreNames.contains('history')) { 
      objectStore = db.createObjectStore('history', {keyPath: 'id'});
    } else {
      objectStore = transaction.objectStore('history');
    }

    objectStore.createIndex("created", "created");
    objectStore.createIndex("type", "type");
    objectStore.createIndex("terms", "terms");
  };

  openRequest.onerror = function() {
    console.error("Error", openRequest.error);
  };

  openRequest.onsuccess = () => {
    let db = openRequest.result;

    let transaction = db.transaction("history", "readwrite"); // (1)

    let history = transaction.objectStore("history"); // (2)

    let hashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)

    console.log("hash", hashCode(location.href))
    let entry = {
      id: location.href,
      url: location.href,
      title: "",
      created: new Date()
    };

    let request = history.add(entry); // (3)

    request.onsuccess = function() { // (4)
      console.log("entry added to the history", request.result);
    };

    request.onerror = function() {
      console.log("Error", request.error);
    };

    // continue working with database using db object
  };
}
