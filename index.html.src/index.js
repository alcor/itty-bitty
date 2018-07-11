var HEAD_TAGS = "PGJhc2UgdGFyZ2V0PSJfdG9wIj4K";
var HEAD_TAGS_EXTENDED =
  "PG1ldGEgY2hhcnNldD0idXRmLTgiPjxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgiPjxiYXNlIHRhcmdldD0iX3RvcCI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5ib2R5e21hcmdpbjowIGF1dG87cGFkZGluZzoxMnZtaW4gMTB2bWluO21heC13aWR0aDozNWVtO2xpbmUtaGVpZ2h0OjEuNWVtO2ZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxzYW5zLXNlcmlmO3dvcmQtd3JhcDogYnJlYWstd29yZDt9PC9zdHlsZT4g";

function dismiss() {
  if (document.getElementById("never").checked) window.localStorage.setItem('toasted', true);
  document.body.classList.remove("toasting")
}

window.onhashchange = window.onload = function() {
  var hash = window.location.hash.substring(1);
  if (hash.length < 3) {
    location.href = "/edit";
  } else {
    if (!window.localStorage.getItem('toasted')) document.body.classList.add("toasting");

    var iframe = document.getElementById("iframe");
    var link = document.getElementById("edit");
    var preamble = undefined;

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
      var compressed = true;
      preamble = HEAD_TAGS_EXTENDED;
      hash =
        "data:text/html;charset=utf-8;" +
        (compressed ? "bxze64," : "base64,") +
        hash;
    } else if (hash.indexOf("data:text/html;") == 0) {
      preamble = HEAD_TAGS;
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
    decompressDataURI(hash, preamble, function(hash) {
      if (!hash) return;
      iframe.sandbox =
        "allow-scripts allow-forms allow-top-navigation allow-popups allow-modals allow-popups-to-escape-sandbox";
      if (!isIE) {
        if (hash) iframe.src = hash;
      } else {
        dataToString(hash, function(content) {
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
