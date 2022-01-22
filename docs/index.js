var HEAD_TAGS = "PGJhc2UgdGFyZ2V0PSJfdG9wIj4K";
var HEAD_TAGS_EXTENDED =
  "PG1ldGEgY2hhcnNldD0idXRmLTgiPjxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgiPjxiYXNlIHRhcmdldD0iX3RvcCI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5ib2R5e21hcmdpbjowIGF1dG87cGFkZGluZzoxMnZtaW4gMTB2bWluO21heC13aWR0aDozNWVtO2xpbmUtaGVpZ2h0OjEuNWVtO2ZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxzYW5zLXNlcmlmO3dvcmQtd3JhcDogYnJlYWstd29yZDt9PC9zdHlsZT4g";

let dataRE = /^data:(?<type>[^;,]+)?(?<attrs>(?:;[^;,]+=[^;,]+)*)?(?:;(?<encoding>\w+64))?,(?<data>.*)$/

function dismiss() {
  if (document.getElementById("never").checked) window.localStorage.setItem('toasted', true);
  document.body.classList.remove("toasting")
}

function setFavicon(favicon) {
  document.getElementById("favicon").href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><text y=".9em">'+ favicon + '</text></svg>'
}

var validTypes = ["image/svg+xml", "application/ld+json"]
window.addEventListener("message", (e) => {
  if (e.origin == 'null') {
    if (e.data.title) document.title = e.data.title;
    if (e.data.favicon) setFavicon(e.data.favicon);
    }
}, false);

window.onhashchange = window.onload = function() {  
  var hash = window.location.hash.substring(1);
  if (window.location.search) {
    console.log("window.location.search.substring(1)", window.location.search.substring(1))
   window.history.replaceState(null, null, window.location.search.substring(1) + "#" + hash) 
  }

  if (hash.length < 3) {
    location.href = "/edit";
  } else {
    // if (!window.localStorage.getItem('toasted')) document.body.classList.add("toasting");

    var iframe = document.getElementById("iframe");
    var link = document.getElementById("edit");
    var preamble = undefined;
    var renderMode = "data";

    var slashIndex = hash.indexOf("/");
    var title = hash.substring(0, slashIndex);
    document.title = title.length
      ? decodeURIComponent(title.replace(/_/g, " "))
      : location.hostname;

    hash = hash.substring(slashIndex + 1);
    var editable = hash.charAt(0) == "?";
    if (editable) {
      hash = hash.substring(1);
    }
    if (hash.indexOf("data:") != 0) {
      var colon = hash.indexOf(":");
      if ( colon > 0 && colon < 15) {
        document.body.classList.remove("toasting");
        return window.location.replace(hash);
      }
      var compressed = true;
      preamble = HEAD_TAGS_EXTENDED;
      hash =
        "data:text/html;charset=utf-8;" +
        (compressed ? "bxze64," : "base64,") +
        hash;
    } else if (hash.indexOf("data:text/html;") == 0) {
      preamble = HEAD_TAGS;
    } else if (hash.indexOf("data:text/plain;") == 0) {
      preamble = HEAD_TAGS_EXTENDED;
    } else if (hash.indexOf("data:text/") == 0) {
    } else if (hash.indexOf("data:image/") == 0) {
    } else {
      let match = hash.match(dataRE);
      let type = match?.groups.type;
      if (type == "application/ld+json") {
        let script = '<script src="' + location.origin + '/render/recipe.js"></script>'
        script = script + " ".repeat(3 - (script.length % 3))
        preamble = btoa(script);
        renderMode = "frame";
      } else if (!validTypes.includes(type)) {
        console.log("unknown type, rendering as download")
        let extension = title.split(".")
        document.querySelector("#dl-name").innerText = title;
        if (extension.length > 1) document.querySelector("#dl-image").innerText = extension.pop();
        renderMode = "download";
      }
    }
    link.onclick = function() {
      location.href = "/edit" + location.hash;
    };

    var isIE = navigator.userAgent.match(/rv:11/);
    var isEdge = navigator.userAgent.match(/Edge\//);
    var isWatch = (window.outerWidth < 200);
    if ((isEdge || isIE) && location.href.length == 2083) {
      document.getElementById("warning").innerHTML =
        'Edge only supports shorter URLs (maximum 2083 bytes).<br>Larger sites may require a different browser.<br><a href="http://reference.bitty.site">Learn more</a>';
    }
    decompressDataURI(hash, preamble, function(dataURL) {
      if (!dataURL) return;
      iframe.sandbox = "allow-downloads allow-scripts allow-forms allow-top-navigation allow-popups allow-modals allow-popups-to-escape-sandbox";
      
      if (isIE && renderMode == "data") renderMode = "frame";
      if (isWatch) {
        renderMode = "rewrite";
      }
      console.log("Rendering via", renderMode)
      dataURL = dataURL.replace("application/ld+json", "text/plain");
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
      } else if (renderMode == "url") {
        location.href = dataURL;
      } else if (renderMode == "frame") {
        dataToString(dataURL, function(content) {
          var doc = iframe.contentWindow.document;
          doc.open();
          doc.write(content);
          doc.close();
        });
      } else if (renderMode == "rewrite") {
        dataToString(dataURL, function(content) {
          document.open();
          document.write(content);
          document.close();
        });
      }
    });
    var link = document.getElementById("edit");
    link.href = "/edit" + location.hash;
    link.style.display = editable ? "block" : "none";
  }
};
