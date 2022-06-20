  import * as bitty from './bitty.js';

  window.bitty = bitty;

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
    
  function addLoader() {
    let el = document.createElement("div");
    el.className = "loader";
    document.body.appendChild(el);
  }

  function setThemeColor(color) {
    let el = document.getElementById("themeColor");
    if (!el) {
      el = document.createElement("meta");
      el.name = "theme-color";
      el.id = "themeColor";
      document.head.appendChild(el);
    }
    el.content = color;
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
    "ipfs": {script:"ipfs", sandbox:"ipfs"},
    "web3": {script:"web3"},
    "text/directory": {script:"download", args: {extension:"vcf", filename:"contact"}}
  }


  function share(info) { // {title, text, url}
    if (!info.url) info = {title:document.title, text:document.title, url:location.href};
    console.log("Share", info);

    if (navigator.share) {
      navigator.share(info)
        .then(() => { console.log('Thanks for sharing!');})
        .catch(console.error);
    } else {
      copyLink(info)
    }
  }

  function copyLink(info) {
    var text = info.url;
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

  let wakeLock;
  const getWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request();
      wakeLock.addEventListener('release', () => {});
      console.log('Keeping Screen Awake:', !wakeLock.released);
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };

  const handleVisibilityChange = async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      await getWakeLock();
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

 

  window.addEventListener("message", function(e) {
    console.debug("Message:", e.origin, e.data)
      if (e.data.title) document.title = e.data.title;
      if (e.data.favicon) setFavicon(e.data.favicon);
      if (e.data.themeColor) setThemeColor(e.data.themeColor);
      if (e.data.updateURL) {
        let path = ["/" + e.data.title.replace(/\s/g, "-")];
        if (e.data.description) path.push("d/" + encodeURIComponent(e.data.description.replace(/\s/g, "-"));
        if (e.data.favicon) path.push("f/" + encodeURIComponent(e.data.favicon));
        if (e.data.image) path.push("i/" + encodeURIComponent(btoa(e.data.image)));
        window.location.pathname = path.join('/') + "/";
      }

      if (e.data.share) {
        share(e.data.share);
      }
      if (e.data.wakeLock) {
        getWakeLock();
      }
      if (e.data.replaceURL) {
        if (e.data.compressURL) {
          let durl = new bitty.DataURL(e.data.replaceURL);

          durl.compress().then(arg => {
            window.history.replaceState(null, null, "/#/" + arg.href);
            renderContent();
          })

        } else {
          window.history.replaceState(null, null, e.data.replaceURL);
          renderContent();
        }
      }
      
      if (e.data.setStorage) document.localStorage.setItem(contentHash, e.data.set);
      if (e.data.getStorage) document.getElementById("iframe").postMessage(document.localStorage.getItem(contentHash), e.origin)
  }, false);  
  
  async function renderContent() {    
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
    var renderer;

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
      renderer = info.params?.render ? {script:info.params.render, sandbox:"hash"} : renderers[info.mediatype];
      
      type = "data:" + info.mediaType;

      if (info.mediatype == "text/html") {
        dataPrefix = HEAD_TAGS();
      } else if (info.mediatype == "text/plain" || info.mediatype == undefined) {
        dataPrefix = HEAD_TAGS_EXTENDED();
        fragment = fragment.replace("text/plain", "text/html");
        renderMode = "data";
      } else if (info.type == "text") {
      } else if (info.type == "image") {
      } else if (info.type == undefined) {
      } else if (!renderer) {
        console.log("unknown type, rendering as download")
        renderMode = "download";
      }

      if (renderer) {
        var script = renderer.script;
        if (script.indexOf("/") == -1)  script = location.origin + '/render/' + script + '.js'
        renderMode = "script";
      }

    } else {
      var colon = fragment.indexOf(":");
      if ( colon > 0 && colon < 15) {
        document.body.classList.remove("toasting");
        let scheme = fragment.substring(0,colon);
        type = scheme;
      
        let renderer = renderers[scheme];
        if (renderer) {
          return renderContentWithScript({renderer, title, info, body:fragment, url:fragment});
        }
        return window.location.replace(fragment);
      }

      var compressed = true;
      dataPrefix = HEAD_TAGS_EXTENDED();
      let encoding = !compressed ? "base64," : (fragment.startsWith("XQA") ? bitty.LZMA_MARKER : bitty.GZIP_MARKER);
      fragment = "data:text/html;charset=utf-8;format=" + encoding + ";base64," + fragment;
    }


    if ((isEdge || isIE) && location.href.length == 2083) {
      let element = document.getElementById("warning") || document.body.appendChild(el("div", {id: "warning"}))
      element.innerHTML =
        'Edge only supports shorter URLs (maximum 2083 bytes).<br>Larger sites may require a different browser.<br><a href="http://reference.bitty.site">Learn more</a>';
    }

    let durl = new bitty.DataURL(fragment);

    if (durl.params.compress) {
      console.log("Compressing URL", durl);
      delete durl.params.compress;
      durl.compress(bitty.GZIP_MARKER).then(arg => {
        window.history.replaceState(null, null, "/#/" + arg.href);
        renderContent();
      })
      return;
    }

    await durl.decompress();

    durl.dataPrefix = dataPrefix;
    let dataURL = durl.href;
    let dataContent = durl.rawData;

    if (!dataURL) return;
    iframe.sandbox = "allow-same-origin allow-downloads allow-scripts allow-forms allow-top-navigation allow-popups allow-modals allow-popups-to-escape-sandbox";

    if (isIE && renderMode == "data") renderMode = "frame";
    let contentTarget// = iframe.contentWindow.document;
    if (isWatch) {
      console.log("Rendering for watch")
      contentTarget = document;
    }
    console.log("Rendering mode: " + "\x1B[1m" + renderMode, durl)
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
          renderContentWithScript({renderer, title, info, body:content, url:dataURL, overwrite:contentTarget == document});
        }
      });
    }
    
    
    let recordHistory = false
    if (recordHistory) recordToHistory(title, type, description, window.location);

  };

  window.addEventListener('load',renderContent);
  // window.addEventListener('hashchange',renderContent);

  
  const SCRIPT_LOADER = `<!doctype html><meta charset=utf-8><script src="${location.origin}/render.js"></script>`
  async function renderContentWithScript(params) {

    params.script = params.renderer.script;
    params.originalURL = location.href;
    if (params.script.indexOf("/") == -1)  params.script = location.origin + '/render/' + params.script + '.js'
    
    if (params.overwrite) { 
        // Overwrite the current page with the script. Dangerous, but required for browsers on apple watch to scroll.
        let scriptEl = document.createElement("script")
        scriptEl.src = "/render.js"
        scriptEl.addEventListener('load', function(e) {
          console.log("Loaded script", scriptEl.src);
          renderScriptContent(params, "*");
        });
        document.head.appendChild(scriptEl);
    } else { 
      // Render in an iframe, either via sandboxed subdomain or a data url (disables storage APIs)
      iframe.onload = (() => {
        iframe.contentWindow.postMessage(params, "*");
        delete iframe.onload
      });
      // writeDocContent(iframe.contentWindow.document, SCRIPT_LOADER)
      // iframe.srcdoc = SCRIPT_LOADER;

      let src = window.scriptDomain ?? location.origin;
      src += "/render";
      let sandbox = params.renderer?.sandbox;
      if (sandbox == "hash") { // Generate sandbox based off of body hash
        let hash = await bitty.hashString(params.body);
        src = src.replace("https://", "https://script-" + hash + ".");
      } else if (sandbox) { // Use named sandbox
        src = src.replace("https://", "https://" + sandbox + ".");
      } else { // Render using data url (storage disabled)
        src = "data:text/html," + SCRIPT_LOADER;
      }
      console.log("Loading script with source:\n" + src)
      iframe.src = src;
    }
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
