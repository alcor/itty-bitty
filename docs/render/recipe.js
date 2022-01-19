let script = document.currentScript;


FRACTION_MAP = {
  '1/2': '\u00BD',
  '1/4': '\u00BC',
  '3/4': '\u00BE',
  '1/3': '\u2153',
  '2/3': '\u2154',
  '1/5': '\u2155',
  '2/5': '\u2156',
  '3/5': '\u2157',
  '4/5': '\u2158',
  '1/6': '\u2159',
  '5/6': '\u215A',
  '1/8': '\u215B',
  '3/8': '\u215C',
  '5/8': '\u215D',
  '7/8': '\u215E',
  replace: function(string) {
    return string.replace(/\d\/\d/g, function(a, b, c) {
      return FRACTION_MAP[a];
    })
  }
}

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

function formatTime(time) {
  const timeRE = /(?<sign>-)?P(?:(?<years>[.,\d]+)Y)?(?:(?<months>[.,\d]+)M)?(?:(?<weeks>[.,\d]+)W)?(?:(?<days>[.,\d]+)D)?T(?:(?<hours>[.,\d]+)H)?(?:(?<minutes>[.,\d]+)M)?(?:(?<seconds>[.,\d]+)S)?/
  let duration = time.match(timeRE).groups;
  console.log("match", duration)
  if (duration) {
    time = [];
    if (duration.hours > 0) time.push(duration.hours + "h");
    if (duration.minutes > 0) time.push(duration.minutes + "m");
    time = time.join(" ");
  }
  return time;
}

function markIngredient(e) {
  e.target.classList.toggle("complete")
}

function highlightStep(e) {
  // console.log("e", e.target)
  //   e.target.parent.children.forEach((i,el) => {
  //     el.classList.toggle("complete", )
  //   }
  e.target.classList.toggle("complete")

}

function render() {
  let data = document.body.innerHTML;
  document.body.innerText = "";
  delete document.documentElement.style.display;
  try {
    var json = JSON.parse(data);
    if (json["@type"] != "Recipe") {
      json = (json["@graph"] ?? json).find((item) => item["@type"] == "Recipe")
    }
    console.log("Recipe", json);
  } catch (e) {
    console.log("Data", e, {data});
  }

  if (!json) return;
  let image = json.image;
  if (Array.isArray(image)) image = image.shift();
  image = image.url || image;
  instructions = json.recipeInstructions;
  if (Array.isArray(instructions)) {
    if (Array.isArray(instructions[0])) instructions = instructions.flat()
  } else {
    instructions = [{ text: instructions }];
  }
  parent.postMessage({title:json.name, favicon:"🍳"}, "*");

  document.body.appendChild(
    m("article.recipe", {},
      image ? m(".thumbnail.noprint", { style: "background-image:url(" + image + ");" }) : null,

      m("header",
        m("img.publisher", { src: json.publisher?.image ?.[0]?.url ?? json.publisher ?.logo ?.url }),
        m("h1", json.name),
        m(".metadata",
          // json.nutrition?.calories ? m("div", (json.nutrition?.calories) + (parseFloat(json.nutrition?.calories) != NaN ? " calories" : "")) : null,
          json.totalTime ? m("div", formatTime(json.totalTime)) : undefined,
          m("div", json.recipeYield),
          json.author?.name ? m(".author", (json.author?.name)) : null,
          (rating = json.aggregateRating) ? [
            parseFloat(rating.ratingValue).toFixed(1),
            "\u2606".repeat(1),
            rating.ratingCount ? " (" + rating.ratingCount + ")" : null
          ].join(" ") : null,
          // m(".rating", (json.aggregateRating?.ratingValue), (json.aggregateRating?.ratingCount)),
          m("a.action.noprint", { onclick: () => window.print() }, "print"),
          m("a.action.noprint", { href: json.mainEntityOfPage }, "link"),

        ),
        m(".description", json.description),

      ),
      m(".columns",
        m(".ingredients",
          json.recipeIngredient?.map(i => m("div.ingredient", { onclick: markIngredient }, FRACTION_MAP.replace(i)))
        ),
        m(".instructions",
          instructions.map(i => m("div.step", { onclick: highlightStep }, i.text))
        )
      )
    )
  )

  var path = script.src.substring(0, script.src.lastIndexOf("."));
  var cssURL = path + ".css";

  let style = m("link", { rel: "stylesheet", type: "text/css", href: cssURL })
  document.head.appendChild(style);

}


window.addEventListener('load', (event) => {
  render();
});