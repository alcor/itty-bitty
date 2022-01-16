var HEAD_TAGS = "PGJhc2UgdGFyZ2V0PSJfdG9wIj4K";
var HEAD_TAGS_EXTENDED =
  "PG1ldGEgY2hhcnNldD0idXRmLTgiPjxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgiPjxiYXNlIHRhcmdldD0iX3RvcCI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5ib2R5e21hcmdpbjowIGF1dG87cGFkZGluZzoxMnZtaW4gMTB2bWluO21heC13aWR0aDozNWVtO2xpbmUtaGVpZ2h0OjEuNWVtO2ZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxzYW5zLXNlcmlmO3dvcmQtd3JhcDogYnJlYWstd29yZDt9PC9zdHlsZT4g";

let dataRE = /^data:(?<type>[^;,]+)?(?<attrs>(?:;[^;,]+=[^;,]+)*)?(?:;(?<encoding>\w+64))?,(?<data>.*)$/

function dismiss() {
  if (document.getElementById("never").checked) window.localStorage.setItem('toasted', true);
  document.body.classList.remove("toasting")
}

var validTypes = ["image/svg+xml", "application/ld+json"]

window.onhashchange = window.onload = function() {
  var hash = window.location.hash.substring(1);
  if (hash.length < 3) {
    location.href = "/edit";
  } else {
    // if (!window.localStorage.getItem('toasted')) document.body.classList.add("toasting");

    var iframe = document.getElementById("iframe");
    var link = document.getElementById("edit");
    var preamble = undefined;
    var download = undefined;

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
    } else {
      let match = hash.match(dataRE);
      let type = match?.groups.type;
      if (validTypes.includes(type)) {
        preamble = btoa(`<script src="https://gitty.bitty.site/render/recipe.js"></script> `);
      } else {
        console.log("unknown type, rendering as download")
        let extension = title.split(".")
        document.querySelector("#dl-name").innerText = title;
        if (extension.length > 1) document.querySelector("#dl-image").innerText = extension.pop();
        download = document.querySelector("#download");
        download.download = title;  
      }
    }
    link.onclick = function() {
      location.href = "/edit" + location.hash;
    };

    var isIE = navigator.userAgent.match(/rv:11/);
    var isEdge = navigator.userAgent.match(/Edge\//);
    if ((isEdge || isIE) && location.href.length == 2083) {
      document.getElementById("warning").innerHTML =
        'Edge only supports shorter URLs (maximum 2083 bytes).<br>Larger sites may require a different browser.<br><a href="http://reference.bitty.site">Learn more</a>';
    }
    decompressDataURI(hash, preamble, function(dataURL) {
      if (!dataURL) return;
      iframe.sandbox = "allow-downloads allow-scripts allow-forms allow-top-navigation allow-popups allow-modals allow-popups-to-escape-sandbox";
      
      dataURL = dataURL.replace("application/ld+json", "text/html");
      if (download) {
        try {
          download.href = dataURL
          download.click();
          document.body.classList.add("download");  
        } catch (e) {
          iframe.src = dataURL;
        }
      } else if (!isIE) {
        iframe.src = dataURL;
      } else {
        dataToString(dataURL, function(content) {
          var doc = iframe.contentWindow.document;
          doc.open();
          doc.write(content);
          doc.close();
        });
      }
    });
    var link = document.getElementById("edit");
    link.href = "/edit" + location.hash;
    link.style.display = editable ? "block" : "none";
  }
};
