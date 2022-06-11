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

function loadSyle(href, callback) {
  document.head.appendChild(el("link", { type: "text/css", rel: "stylesheet", href, onload:callback}));
}

function renderScriptContent(data, origin) {
  var base = el('base', {href: data});
  document.head.appendChild(base);
  window.params = data;
  window.params.origin = origin;
  console.log("Rendering with", data.script, data)
  loadScript(data.script);
}

window.addEventListener("message", function(e) {
  renderScriptContent(e.data, e.origin);
}, false);
