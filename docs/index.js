  import * as bitty from './bitty.js';

  const HEAD_TAGS = "PGJhc2UgdGFyZ2V0PSJfdG9wIj4K";
  const HEAD_TAGS_EXTENDED = "PG1ldGEgY2hhcnNldD0idXRmLTgiPjxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgiPjxiYXNlIHRhcmdldD0iX3RvcCI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5ib2R5e21hcmdpbjowIGF1dG87cGFkZGluZzoxMnZtaW4gMTB2bWluO21heC13aWR0aDozNWVtO2xpbmUtaGVpZ2h0OjEuNWVtO2ZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxzYW5zLXNlcmlmO3dvcmQtd3JhcDogYnJlYWstd29yZDt9PC9zdHlsZT4g";

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/worker.js')
      .then(function() { console.debug("Service Worker Registered"); });
  }

  function dismiss() {
    if (document.getElementById("never").checked) window.localStorage.setItem('toasted', true);
    document.body.classList.remove("toasting")
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

    // if (e.origin == 'null' || e.origin = ) {
      if (e.data.title) document.title = e.data.title;
      if (e.data.favicon) setFavicon(e.data.favicon);
      if (e.data.updateURL) {
        window.location.pathname = "/" + e.data.title.replace(" ", "_") + "/-/" + e.data.image
      }
      if (e.data.setStorage) document.localStorage.setItem(contentHash, e.data.set);
      if (e.data.getStorage) document.getElementById("iframe").postMessage(document.localStorage.getItem(contentHash), e.origin)
      // }
  }, false);

  // window.onhashchange =
  window.onload = function() {    
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

    var slashIndex = fragment.indexOf("/");
    var title = fragment.substring(0, slashIndex);
    document.title = title.length
      ? decodeURIComponent(title.replace(/_/g, " "))
      : location.hostname;

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
      
      if (info.mediatype == "text/html") {
        dataPrefix = HEAD_TAGS;
      } else if (info.mediatype == "text/plain") {
        dataPrefix = HEAD_TAGS_EXTENDED;
        renderMode = "data";
      } else if (info.type == "text") {
      } else if (info.type == "image") {
      } else if (!renderer) {
        console.log("unknown type, rendering as download")
        renderMode = "download";
      }

      if (renderer) {
        var script = renderer;
        if (script.indexOf("/") == -1)  script = location.origin + '/render/' + script + '.js'
        renderMode = "script";
      }

      if (info?.encoding == "base64" && !info.params?.encode) {
        bitty.compressDataURL(fragment, function(compressedFragment) {
          console.log("Compressing long url", fragment.length, compressedFragment.length)
          window.location.hash = window.location.hash.replace(fragment, compressedFragment);
          window.location.reload();
          console.log("Reloading")
        })

      }
    } else {
      var colon = fragment.indexOf(":");
      if ( colon > 0 && colon < 15) {
        document.body.classList.remove("toasting");
        let scheme = fragment.substring(0,colon);
        let renderer = renderers[scheme];
        if (renderer) {
          return renderContentWithScript(renderer.script, title, fragment, fragment);
        }
        return window.location.replace(fragment);
      }

      var compressed = true;
      dataPrefix = HEAD_TAGS_EXTENDED;
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
            renderContentWithScript(script, title, content, dataURL);
          }
        });
      }
    });

  };

  const SCRIPT_LOADER = `<!doctype html><meta charset=utf-8><script src="${location.origin}/render.js"></script>`
  function renderContentWithScript(script, title, body, url) {
    if (script.indexOf("/") == -1)  script = location.origin + '/render/' + script + '.js'
    iframe.onload = (() => {
      iframe.contentWindow.postMessage({script, url, title, body}, "*");
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
