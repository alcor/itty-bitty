// window.el = function (tagName, attrs, ...children) {
//   let l = document.createElement(tagName);
//   Object.entries(attrs).forEach(([k,v]) => l[k] = v);
//   children.forEach((c) => l.appendChild(typeof c == "string" ? document.createTextNode(c) : c));
//   return l;
// }
const el = (selector, ...args) => {
  var attrs = (args[0] && typeof args[0] === 'object' && !Array.isArray(args[0]) && !(args[0] instanceof HTMLElement)) ? args.shift() : {};

  let classes = selector.split(".");
  if (classes.length > 0) selector = classes.shift();
  if (classes.length) attrs.className = classes.join(" ")

  let id = selector.split("#");
  if (id.length > 0) selector = id.shift();
  if (id.length) attrs.id = id[0];

  var node = document.createElement(selector.length > 0 ? selector : "div");
  for (let prop in attrs) {
    if (attrs.hasOwnProperty(prop) && attrs[prop] != undefined) {
      if (prop.indexOf("data-") == 0) {
        let dataProp = prop.substring(5).replace(/-([a-z])/g, function(g) { return g[1].toUpperCase(); });
        node.dataset[dataProp] = attrs[prop];
      } else {
        if (typeof attrs[prop] === 'function' || prop == "className") {
          node[prop] = attrs[prop];
        } else {
          node.setAttribute(prop, attrs[prop]);
        }
      }
    }
  }

  const append = (child) => {
    if (Array.isArray(child)) return child.forEach(append);
    if (typeof child == "string") child = document.createTextNode(child);
    if (child) node.appendChild(child);
  };
  args.forEach(append);

  return node;
};
el.trust = function (html) {
  if (!html?.length) return undefined;
  var template = document.createElement('template');
  template.innerHTML = html;
  return Array.from(template.content.childNodes);
}
window.el = el;

function async(u, c) {
  var d = document, t = 'script',
      o = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
  o.src = '//' + u;
  if (c) { o.addEventListener('load', function (e) { c(null, e); }, false); }
  s.parentNode.insertBefore(o, s);
}

function loadScript(src, callback, type = "module") {
  let promise =  new Promise((resolve, reject) => {
    document.head.appendChild(el("script", { src, type, onload:resolve}));
  })
  return callback ? promise.then(callback) : promise;
}

function loadSyle(href, callback) {
  let promise =  new Promise((resolve, reject) => {
    document.head.appendChild(el("link", { type: "text/css", rel: "stylesheet", href, onload:resolve}));
  })
  return callback ? promise.then(callback) : promise;
}


function renderScriptContent(data, origin) {
  var base = el('base', {href: data.script});
  document.head.appendChild(base);
  window.script = data.script
  window.params = data;
  window.params.origin = origin;
  console.log("🖊 Rendering with", {script:data.script, params:data})
  loadScript(data.script);
}

window.addEventListener("message", function(e) {
  renderScriptContent(e.data, e.origin);
}, false);

function QRCodeURL(url, options) {
  if (url.length > 2953) return undefined;
  let size = options?.size ?? 547;
  let errorCorrection = options?.correction ?? 'L';
  let margin = options?.margin?.toString() || "1";
  return `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chld=${errorCorrection}|${margin}&choe=UTF-8&chl=${encodeURIComponent(url || location.href)}`;
}