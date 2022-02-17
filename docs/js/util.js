const m = (selector, ...args) => {
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
        node[prop] = attrs[prop];
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