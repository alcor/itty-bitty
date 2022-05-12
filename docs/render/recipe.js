let script = document.currentScript;
let reformat = false;

FRACTION_MAP = {
  '1/4': '\u00BC',
  '1/2': '\u00BD',
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

let ignoredTerms = [
  "teaspoon", "teaspoons", "tablespoon", "tablespoons", "cup", "cups", "taste", "more", "melted", "into", "wide", "pound", "pounds", "gram", "grams", "you", "ounce", "ounces", "thinly", "sliced",
  "finely", "ground", "garnish", "about", "cut", "and", "smashed", "each", "the", "medium", "large", "small", "for", "chopped", "minced", "grated", "box", "softened", "directed", "shredded", "cooked", "from", "frozen", "thawed"
]

const replacements = {
  "teaspoon": "tsp.",
  "tablespoon": "Tbsp."
}

window.addEventListener("mouseover", (e) => {
  let target = e.target;

  if (target.classList.contains("noun")) {
    let els = document.querySelectorAll("#" + e.target.id);
    
    for (const noun of els) {
      noun.classList.add("hovered");
      noun.closest(".substep")?.classList.add("hovered")
      noun.closest(".ingredient")?.classList.add("hovered")
    }
  }
})
window.addEventListener("mouseout", (e) => {
  let target = e.target;


  if (target.classList.contains("noun")) {
    let els = document.querySelectorAll("#" + e.target.id);
    
    for (const noun of els) {
      noun.classList.remove("hovered");
      noun.closest(".substep")?.classList.remove("hovered")
      noun.closest(".ingredient")?.classList.remove("hovered")

    }
  }
})

function getStringProperty(stringOrArray, prop) {
  if (Array.isArray(stringOrArray)) {
    stringOrArray = stringOrArray.pop();
  }
  if (prop) {
    stringOrArray = stringOrArray[prop]
  }
  return stringOrArray?.toString();
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

function clean(html) {
  let doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

function formatTime(time) {
  const timeRE = /(?<sign>-)?P(?:(?<years>[.,\d]+)Y)?(?:(?<months>[.,\d]+)M)?(?:(?<weeks>[.,\d]+)W)?(?:(?<days>[.,\d]+)D)?T(?:(?<hours>[.,\d]+)H)?(?:(?<minutes>[.,\d]+)M)?(?:(?<seconds>[.,\d]+)S)?/
  let duration = time.match(timeRE).groups;
  if (duration) {
    time = [];

    if (duration.minutes > 60) {
      duration.hours = Math.floor(duration.minutes / 60);
      duration.minutes = duration.minutes % 60
    }

    if (duration.hours > 0) time.push(duration.hours + "h");
    if (duration.minutes > 0) time.push(duration.minutes + "m");
    time = time.join(" ");
  }
  return time;
}

function markIngredient(e) {
  e.target.closest(".ingredient").classList.toggle("complete")
}

function highlightStep(e) {
  // console.log("e", e.target)
  //   e.target.parent.children.forEach((i,el) => {
  //     el.classList.toggle("complete", )
  //   }
  e.target.closest(".substep").classList.toggle("complete")

}

const ingredientMatch = /^(?:A )?([\/0-9 \u00BC-\u00BE\u2153-\u215E\u2009]*) (.*)/


function ingredientEl(string, terms) {
  if (string == "-") return m("hr");

  string = highlightTerms(string, terms)
  //console.log("terms", terms);

  let match = FRACTION_MAP.replace(clean(string)).match(ingredientMatch);

  if (match) {
    return [m("span.quantity", match[1].replace(" ", "\u202F")), m("div", {innerHTML:highlightTerms(match[2], terms)})]
  }
  return [m("span.quantity", ""), m("div", {innerHTML:string})];
}

function highlightTerms(string, terms) {
  const pattern = new RegExp(`\\b(${Array.from(terms).join('|').replace("-","\\-") })\\b`, 'gi'); 
  return string.replace(pattern, match => `<span class="noun" id="term-${match}">${match}</span>`);
}

function render() {
  delete document.documentElement.style.display;
  document.body.childNodes.forEach((c) => document.body.removeChild(c))
  let data = JSON.parse(window.params.body);

  try {
    var json = data; //JSON.parse(data);
    if (json["@type"] != "Recipe") {
      json = (json["@graph"] ?? json).find((item) => item["@type"] == "Recipe")
    }
    console.log("Recipe", json);
  } catch (e) {
    console.debug("Data", e, {data});
  }


  if (!json) return;
  let image = json.image;
  if (Array.isArray(image)) image = image.shift();
  image = image?.url || image;
  instructions = json.recipeInstructions;
  let title = clean(json.name);
  parent.postMessage({title:title, favicon:"🍳", image:image, updateURL:true}, "*");


  // let text = instructions.join(" ");
  let ingredients = json.recipeIngredient;

  var ingredientTerms = new Set(
    Array.from(ingredients.join("\n").matchAll(/[A-Za-z\-]+/g)).map(m => m[0].length > 2 ? m[0].toLowerCase(): "")
  );
  if (typeof instructions === "string") instructions = [instructions]
  instructions = flattenInstructions(instructions)
  let intructionTerms = new Set(
    Array.from(instructions.flat().join("\n").matchAll(/[A-Za-z\-]+/g)).map(m => m[0].length > 2 ? m[0].toLowerCase(): "")
  );
  ignoredTerms.forEach((t) => { ingredientTerms.delete(t) })

  ingredientTerms.forEach((t) => {
    if (!intructionTerms.has(t)) {
      ingredientTerms.delete(t);
    }
  })
  ingredientTerms.delete("");  
  //console.log(ingredientTerms);

  // console.log("1 tablespoon".replace(/(tablespoon)/, (a) => {
  //   return replacements[a];
  // }))
  ingredients = ingredients.map(i => m("div.ingredient", { onclick: markIngredient }, ingredientEl(clean(i), ingredientTerms)));


  console.group("instructions")
  console.log(instructions)
  console.groupEnd("instructions")

  let step = 1;
  function renderInstructions(instruction, terms) {
    if (Array.isArray(instruction)) {
      // if (Array.isArray(instruction[0])) instruction = instruction.flat();
      return [m("hr"), m("ul.step", instruction.map(i => renderInstructions(i, terms)))];
    }

    let text = (instruction.text || instruction);
    if (text.startsWith("= ")) return m("h3", text.substring(2));

    return m("li", { onclick: highlightStep }, 
      m("span.number" + (step>9 ? ".big" : ""), `${step++}`),
      m("span.substep",{innerHTML:highlightTerms(FRACTION_MAP.replace(text.trim()), terms)}))
  }

  function flattenInstructions(instruction) {
    if (instruction.itemListElement) {
      return ["= " + instruction.name].concat(flattenInstructions(instruction.itemListElement).flat());
    }

    if (Array.isArray(instruction)) {
      if (Array.isArray(instruction[0])) instruction = instruction.flat();
      return instruction.map(i => flattenInstructions(i));
    }

    let text = (instruction.text || instruction);
 

    if (reformat) {
      text = text.match( /[0-9\. ]{0,6}[^\.!\?]+[\.!\?]+/g );
    } else {
      text = text.match( /[^\n]+/g );
    }
    // text = [text]
    // if (true) text = text.replace(/\. /g, ". <p> ")
    return text;
  }

  instructions = instructions.map(i => renderInstructions(i, ingredientTerms));



  // instructions = instructions.map(i => m("div.step", { onclick: highlightStep }, i))

  let rating = json.aggregateRating;
  let ratingCount = rating?.ratingCount;
  if (ratingCount && ratingCount < 10) rating = undefined;



  let yield = (getStringProperty(json.recipeYield));
  if (!isNaN(parseInt(yield?.charAt(yield?.length - 1)))) yield += " servings";

  document.body.appendChild(
    m("article.recipe", {},
      image ? m(".thumbnail.noprint", { style: "background-image:url(" + image + ");" }) : null,

      m("header",
        m("img.publisher", { src: json.publisher?.image ?.[0]?.url ?? json.publisher ?.logo ?.url }),
        m("h1", title),
        m(".metadata",
          m("div", m("span.yield", m(".icon.material-icons-outlined", "restaurant"), yield)),
          m(".time",
            m(".icon.material-icons-outlined", "timer"),

            json.totalTime ? m("span", formatTime(json.totalTime)) : undefined,
            // " (",
            // json.prepTime ? m("span", formatTime(json.prepTime), " prep") : undefined,
            // json.cookTime ? m("span",  ", ",  formatTime(json.cookTime), " cook") : undefined,
            // ")"
          ),
          (rating) ? m("div.rating",
              m(".icon.material-icons-outlined", "grade"),
              parseFloat(rating.ratingValue).toFixed(1), " ",
              // ratingCount ? m("span.count", ratingCount.toString()) : null
              )
           : null,
          json.nutrition?.calories ? m("div", m(".icon.material-icons-outlined", "info"), (json.nutrition?.calories) + (parseFloat(json.nutrition?.calories) != NaN ? " calories" : "")) : null,

          m("div.spacer"),
          m("a.action.noprint", { title:"Open original", href: json.mainEntityOfPage || json.url, target:"_blank"}, m(".icon.material-icons-outlined", "link")),
          m("a.action.noprint", { title:"Show steps as list", href: "#", onclick: () => {reformat = !reformat; render(); return false;}}, m(".icon.material-icons-outlined", "format_list_numbered")),
          m("a.action.noprint", { title:"Print", href: "#", onclick: () => window.print() }, m(".icon.material-icons-outlined", "print")),

        ),
        json.description ? m(".description",
          clean(json.description),
          json.author?.name ? m("span.author", (" —⁠" + json.author?.name)) : null,

          m("p"),

        ) : null,

      ),
      m(".columns",
        m(".ingredients", ingredients),
        m(reformat ? ".instructions.numbered" : ".instructions",  instructions)
      ),
    )
  )

  var path = script.src.substring(0, script.src.lastIndexOf("."));
  var cssURL = path + ".css";

  document.head.appendChild(m("link", { rel: "stylesheet", type: "text/css", href: cssURL }));
  document.head.appendChild(m("link", { rel: "stylesheet", href: "https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" }));


}

render();