(function () {

  const HEAD_TAGS = "PGJhc2UgdGFyZ2V0PSJfdG9wIj4K";
  const HEAD_TAGS_EXTENDED = "PG1ldGEgY2hhcnNldD0idXRmLTgiPjxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgiPjxiYXNlIHRhcmdldD0iX3RvcCI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5ib2R5e21hcmdpbjowIGF1dG87cGFkZGluZzoxMnZtaW4gMTB2bWluO21heC13aWR0aDozNWVtO2xpbmUtaGVpZ2h0OjEuNWVtO2ZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxzYW5zLXNlcmlmO3dvcmQtd3JhcDogYnJlYWstd29yZDt9PC9zdHlsZT4g";

  let dataUrlRE = /^data:(?<type>[^;,]+)?(?<attrs>(?:;[^;,]+=[^;,]+)*)?(?:;(?<encoding>\w+64))?,(?<data>.*)$/

  function dismiss() {
    if (document.getElementById("never").checked) window.localStorage.setItem('toasted', true);
    document.body.classList.remove("toasting")
  }

  function setFavicon(favicon) {
    document.getElementById("favicon").href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><text y=".9em">'+ favicon + '</text></svg>'
  }

  const renderers = {"application/ld+json": "recipe"}

  window.addEventListener("message", function(e) {
    console.log("Message:", e.origin, e.data)
    // if (e.origin == 'null' || e.origin = ) {
      if (e.data.title) document.title = e.data.title;
      if (e.data.favicon) setFavicon(e.data.favicon);
      if (e.data.setStorage) document.localStorage.setItem(contentHash, e.data.set);
      if (e.data.getStorage) document.getElementById("iframe").postMessage(document.localStorage.getItem(contentHash), e.origin)
      // }
  }, false);

  // window.onhashchange = 
  window.onload = function() {  
    if (window.location.search) { // Redirect search to path (coming out of server opengraph forwarding)
      console.log("window.location.search.substring(1)", window.location.search.substring(1))
      window.history.replaceState(null, null, window.location.search.substring(1) + "#" + fragment) 
    }

    var isIE = navigator.userAgent.match(/rv:11/);
    var isEdge = navigator.userAgent.match(/Edge\//);
    var isWatch = (window.outerWidth < 200);

    var fragment = window.location.hash.substring(1);
    if (fragment.length < 3) {
      return location.href = "/edit";
    }

    // if (!window.localStorage.getItem('toasted')) document.body.classList.add("toasting");

    var iframe = document.getElementById("iframe");
    var link = document.getElementById("edit");
    var dataPrefix = undefined;
    var renderMode = "data";

    var slashIndex = fragment.indexOf("/");
    var title = fragment.substring(0, slashIndex);
    document.title = title.length
      ? decodeURIComponent(title.replace(/_/g, " "))
      : location.hostname;

    fragment = fragment.substring(slashIndex + 1);
    var editable = fragment.charAt(0) == "?";
    if (editable) {
      fragment = fragment.substring(1);
    }
    if (fragment.startsWith("data:")) {
      let match = fragment.match(dataUrlRE);
      let attrs = new URLSearchParams(match.groups.attrs?.substring(1).replace(/;/g, "&"));

      if (fragment.indexOf("data:text/html;") == 0) {
        dataPrefix = HEAD_TAGS;
      } else if (fragment.indexOf("data:text/plain;") == 0) {
        dataPrefix = HEAD_TAGS_EXTENDED;
        renderMode = "frame";
      } else if (fragment.indexOf("data:text/") == 0) {
      } else if (fragment.indexOf("data:image/") == 0) {
      } else {
        let type = match?.groups.type;
        const renderer = attrs.get("render") || renderers[type];
        if (renderer) {
          var script = renderer;
          if (script.indexOf("/") == -1)  script = location.origin + '/render/' + script + '.js'
          renderMode = "script";
        } else {
          console.log("unknown type, rendering as download")
          let extension = title.split(".")
          document.querySelector("#dl-name").innerText = title;
          if (extension.length > 1) document.querySelector("#dl-image").innerText = extension.pop();
          renderMode = "download";
        }
      }

      if (match?.groups.encoding == "base64") {
        compressDataURI(fragment, function(compressedFragment) {
          console.log("Compressing long url", fragment.length, compressedFragment.length)
          window.location.hash = window.location.hash.replace(fragment, compressedFragment);
        })
        
      } 
    } else {
      var colon = fragment.indexOf(":");
      if ( colon > 0 && colon < 15) {
        document.body.classList.remove("toasting");
        return window.location.replace(fragment);
      }
      var compressed = true;
      dataPrefix = HEAD_TAGS_EXTENDED;
      fragment =
        "data:text/html;charset=utf-8;" +
        (compressed ? "bxze64," : "base64,") +
        fragment;
    }
    
    link.onclick = function() {
      location.href = "/edit" + location.hash;
    };

    if ((isEdge || isIE) && location.href.length == 2083) {
      document.getElementById("warning").innerHTML =
        'Edge only supports shorter URLs (maximum 2083 bytes).<br>Larger sites may require a different browser.<br><a href="http://reference.bitty.site">Learn more</a>';
    }
    decompressDataURI(fragment, dataPrefix, function(dataURL, dataContent) {
      if (!dataURL) return;
      iframe.sandbox = "allow-downloads allow-scripts allow-forms allow-top-navigation allow-popups allow-modals allow-popups-to-escape-sandbox";
      
      if (renderMode == "script")
      if (isIE && renderMode == "data") renderMode = "frame";
      let contentTarget = iframe.contentWindow.document;
      if (isWatch) {
        contentTarget = document;
      }
      console.log("Rendering via", renderMode)
      // dataURL = dataURL.replace("application/ld+json", "text/plain");
      if (renderMode == "download") {
        try {
          let dl = document.querySelector("#download");
          dl.href = dataURL;
          dl.download = title;
          dl.click();
          document.body.classList.add("download");  
        } catch (e) {
          iframe.src = dataURL;
        }
      } else if (renderMode == "data") {
        iframe.src = dataURL;
      } else {
        dataToString(dataURL, function(content) {
          if (renderMode == "frame") {
            writeDocContent(contentTarget, content)
          } else if (renderMode == "script") {
            writeDocContent(contentTarget, `<script>var data = ${content}</script><script src="${script}"></script>`)
          }
        });
      }
    });
    var link = document.getElementById("edit");
    link.href = "/edit" + location.hash;
    link.style.display = editable ? "block" : "none";

  };

  function writeDocContent(doc, content) {
    doc.open();
    doc.write(content);
    doc.close();
  }

})()