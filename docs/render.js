window.el = function (tagName, attrs, ...children) {
  let l = document.createElement(tagName);
  Object.entries(attrs).forEach(([k,v]) => l[k] = v);
  children.forEach((c) => l.appendChild(c));
  return l;
}

function loadScript(src) {
  document.head.appendChild(el("script", { src }));
  document.onload = () => {
    document.write("hi");

  }
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
  console.log("document.head", document.head)
}, false);
