FRACTION_MAP = {
  '1/2': '\u00BD', '1/4': '\u00BC', '3/4': '\u00BE', '1/3': '\u2153', '2/3': '\u2154', '1/5': '\u2155', '2/5': '\u2156', '3/5': '\u2157', '4/5': '\u2158', '1/6': '\u2159', '5/6': '\u215A', '1/8': '\u215B', '3/8': '\u215C', '5/8': '\u215D', '7/8': '\u215E',
  replace: function(string) {
    return string.replace(/\d\/\d/g, function(a,b,c) {
      return FRACTION_MAP[a];
    })
  }
}

const m = (selector, ...args) => {
  var attrs = (args[0] && typeof args[0] === 'object' &&  !Array.isArray(args[0]) && !(args[0] instanceof HTMLElement)) ? args.shift() : {};

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
        let dataProp = prop.substring(5).replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
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
  let duration = time.match(timeRE)?.groups;
  console.log("match", duration)
  if (duration) {
    time = [];
    if (duration.hours > 0 ) time.push(duration.hours + "h");
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
  let data = document.body.innerText;
  document.body.innerText = "";
  delete document.documentElement.style.display;
  let json = JSON.parse(data);

  if (json["@type"] != "Recipe") {
    json = (json["@graph"] ??  json).find((item) => item["@type"] == "Recipe")
  }
  console.log("recipe", json)

  let image = json.image;
  if (Array.isArray(image)) image = image.shift();
  image = image.url || image;

  document.body.appendChild(
    m("article.recipe",{},
    m("img.publisher", {src:json.publisher?.image[0]?.url}),
    m("img.thumbnail.noprint", {src:image}),
    m("header",
        m("h1", json.name),
        m(".metadata",
            json.nutrition?.calories ? m("div", (json.nutrition?.calories) + " calories") : null,
            m("div", json.recipeYield),
            m("div", formatTime(json.totalTime)),
            json.author?.name ? m(".author", (json.author?.name)) : null,
            "\u2605".repeat(json.aggregateRating?.ratingValue) + " " + parseFloat(json.aggregateRating?.ratingValue).toFixed(1) + " (" + json.aggregateRating?.ratingCount + ")",
            // m(".rating", (json.aggregateRating?.ratingValue), (json.aggregateRating?.ratingCount)),
            m("button.noprint", {onclick:() => window.print()},"print")
          ),
          m(".description", json.description),

      ),
      m(".columns",
        m(".ingredients",
          json.recipeIngredient?.map(i => m("div.ingredient", {onclick:markIngredient}, FRACTION_MAP.replace(i)))
        ),
        m(".instructions",
          json.recipeInstructions?.map(i => m("div.step", {onclick:highlightStep}, i.text))
        )
      )
    )
  )

  document.head.appendChild(m("style", {}, `
  * {
    font-family:-apple-system, BlinkMacSystemFont, sans-serif;
  }

  img.thumbnail {
    width:100%;
  }

  img.publisher {
    max-width: 12em;
    margin-bottom:1em;
  }
  .recipe {
    max-width:40em;
    margin:auto;
    line-height:133%;
  }

  .columns {
    display:flex;
    gap:2em;
    margin-bottom:4em;
    align-content:center;
    justify-content:center;
  }
  header {
    gap:2em;
    margin-bottom:2em;
  }
  h1 {
    margin-top:2em;

  }

  .metadata {
    align:right;
    display:flex;
    gap:1em;
    margin-bottom:1em;
  }
  .metadata div:after  {
    content:"-";
    margin-left:1em;
  }
  .ingredients {
    font-weight:600;
    font-size:100%;
    padding-top:1em;
    flex:0 1 35%;
  }

  .instructions {
    white-space: pre-wrap;
    line-height:125%;
    font-size:100%;
    flex: 0 1 65%;
  }

  .ingredient {
    padding: 0.625em 1em;
    margin:0 -1em;
    line-height:1.25em;
    opacity:0.75;
    cursor:pointer;
  }
  .ingredient.complete,
  .step.complete {
    text-decoration:line-through;
    opacity:0.33;
  }
  .ingredient:hover {
    opacity:1.0;
    background-color:rgba(128,128,128,0.1)
  }
  
  .step {
    padding-top:2em;
    max-width:40em;

    cursor:pointer;
  }
  .step:before {
    content:"";
    width:100px;
    float:left;
    margin-top:-1em;
    height:0.5px;
    background-color:currentColor;
    opacity:0.54;
  }

  button {
    border:none;
    background:none;
    text-transform:uppercase;
  }

  @media screen and (max-width: 480px) {
    /* some CSS here */
    .columns {
      flex-direction:column;
    }
  }

  @media (prefers-color-scheme: dark) {
    body {
      background-color:#222;
      color:white;
    }
  }
  @media print {
    body { font-size:14px; }
    .noprint { display:none; }
  }
  
  
  `));

}

window.addEventListener('load', (event) => {
  render();
});
