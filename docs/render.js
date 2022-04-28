window.el = function (tagName, attrs, ...children) {
  let l = document.createElement(tagName);
  Object.entries(attrs).forEach(([k,v]) => l[k] = v);
  children.forEach((c) => l.appendChild(typeof c == "string" ? document.createTextNode(c) : c));
  return l;
}

function loadScript(src, callback) {
  let script = el("script", { src });
  script.addEventListener('load', function(e) {
    console.debug("Loaded script", src);
    if (callback) callback(e);
  });
  document.head.appendChild(script);
}

function async(u, c) {
  var d = document, t = 'script',
      o = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
  o.src = '//' + u;
  if (c) { o.addEventListener('load', function (e) { c(null, e); }, false); }
  s.parentNode.insertBefore(o, s);
}

function loadSyle(href) {
  document.head.appendChild(el("link", { type: "text/css", rel: "stylesheet", href}));
}

window.addEventListener("message", function(e) {
  var base = el('base', {href: e.data.script});
  document.head.appendChild(base);

  window.params = e.data;
  window.params.origin = e.origin;
  console.log("Rendering with", e.data.script, e.data)
  loadScript(e.data.script);
}, false);
