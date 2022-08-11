let reformat = true;

let FRACTION_MAP = {
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
  "not", "sprig", "sprigs", "room", "temperature", "still", "see", "notes", "with", "beat", "together", "crust", "very", "cold", "hot", "top", "warm", "one", "note", "teaspoon", "teaspoons", "tablespoon", "tablespoons", "cup", "cups", "taste", "more", "melted", "into", "wide", "pound", "pounds", "gram", "grams", "you", "ounce", "ounces", "thinly", "sliced",
  "pan", "cube", "cubes", "finely", "ground", "garnish", "about", "cut", "and", "smashed", "each", "the", "medium", "large", "small", "for", "chopped", "minced", "grated", "box", "softened", "directed", "shredded", "cooked", "from", "frozen", "thawed"
]
let emojiMap = {
  "grape": "🍇",
  "watermelon": "🍉",
  "melon": "🍈",
  "orange": "🍊",
  "lemon": "🍋",
  "banana": "🍌",
  "pineapple": "🍍",
  "mango": "🥭",
  "apple": "🍎",
  "apple": "🍏",
  "pear": "🍐",
  "peach": "🍑",
  "cherry": "🍒",
  "strawberry": "🍓",
  "blueberry": "🫐",
  "kiwi": "🥝",
  "garlic": "🧄",
  "tomato": "🍅",
  "olive": "🫒",
  "coconut": "🥥",
  "avocado": "🥑",
  "eggplant": "🍆",
  "potato": "🥔",
  "carrot": "🥕",
  "corn": "🌽",
  "spicy": "🌶️",
  "bell pepper": "🫑",
  "cucumber": "🥒",
  "leafy green": "🥬",
  "broccoli": "🥦",
  "onion": "🧅",
  "mushroom": "🍄",
  "peanut": "🥜",
  "bean": "🫘",
  "chestnut": "🌰",
  "bread": "🍞",
  "croissant": "🥐",
  "baguette": "🥖",
  "flatbread": "🫓",
  "pretzel": "🥨",
  "bagel": "🥯",
  "pancake": "🥞",
  "waffle": "🧇",
  "cheese": "🧀",
  "meat": "🍖",
  "beef": "🥩",
  "turkey": "🍗",
  "chicken": "🍗",
  "steak": "🥩",
  "bacon": "🥓",
  "hamburger": "🍔",
  "french fries": "🍟",
  "pizza": "🍕",
  "hot dog": "🌭",
  "sandwich": "🥪",
  "taco": "🌮",
  "burrito": "🌯",
  "tamale": "🫔",
  "stuffed flatbread": "🥙",
  "falafel": "🧆",
  "egg": "🥚",
  "cooking": "🍳",
  "pan": "🥘",
  "pot": "🍲",
  "soup": "🍲",
  "fondue": "🫕",
  "dip": "🫕",
  "bowl": "🥣",
  "salad": "🥗",
  "popcorn": "🍿",
  "butter": "🧈",
  "salt": "🧂",
  "can": "🥫",
  "bento box": "🍱",
  "rice cracker": "🍘",
  "rice ball": "🍙",
  "rice": "🍚",
  "curry": "🍛",
  "steaming bowl": "🍜",
  "spaghetti": "🍝",
  "roasted sweet potato": "🍠",
  "oden": "🍢",
  "sushi": "🍣",
  "fried shrimp": "🍤",
  "fish cake with swirl": "🍥",
  "moon cake": "🥮",
  "fruit": "🍓",
  "dango": "🍡",
  "dumpling": "🥟",
  "oyster": "🦪",
  "octopus": "🐙",
  "fish": "🐟",
  "salmon": "🐟",
  "tuna": "🐟",
  "soft ice cream": "🍦",
  "shaved ice": "🍧",
  "ice cream": "🍨",
  "doughnut": "🍩",
  "cookie": "🍪",
  "birthday": "🎂",
  "cake": "🍰",
  "cupcake": "🧁",
  "pie": "🥧",
  "chocolate": "🍫",
  "candy": "🍬",
  "custard": "🍮",
  "honey": "🍯",
  "milk": "🥛",
  "cream": "🥛",
  "coffee": "☕",
  "tea": "🫖",
  "tea": "🍵",
  "sake": "🍶",
  "champagne": "🍾",
  "wine glass": "🍷",
  "cocktail": "🍸",
  "tropical drink": "🍹",
  "beer": "🍺",
  "tumbler glass": "🥃",
  "cup with straw": "🥤",
  "bubble tea": "🧋",
  "beverage box": "🧃",
  "mate": "🧉",
  "frozen": "🧊",
  "chopsticks": "🥢",
  "fork and knife": "🍴",
  "spoon": "🥄" 
}

let icons = {
  public:('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><g id="public"><mask id="mask0_802_619" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path id="Bounding box" d="M0 0h24v24H0z"/></mask><g mask="url(#mask0_802_619)"><path id="public_2" d="M12 22a9.733 9.733 0 0 1-3.9-.788 10.092 10.092 0 0 1-3.175-2.137c-.9-.9-1.612-1.958-2.137-3.175A9.733 9.733 0 0 1 2 12a9.74 9.74 0 0 1 .788-3.9 10.092 10.092 0 0 1 2.137-3.175c.9-.9 1.958-1.613 3.175-2.138A9.743 9.743 0 0 1 12 2a9.74 9.74 0 0 1 3.9.787 10.105 10.105 0 0 1 3.175 2.138c.9.9 1.612 1.958 2.137 3.175A9.733 9.733 0 0 1 22 12a9.733 9.733 0 0 1-.788 3.9 10.092 10.092 0 0 1-2.137 3.175c-.9.9-1.958 1.612-3.175 2.137A9.733 9.733 0 0 1 12 22Zm-1-2.05V18c-.55 0-1.02-.196-1.412-.587A1.927 1.927 0 0 1 9 16v-1l-4.8-4.8c-.05.3-.096.6-.138.9-.041.3-.062.6-.062.9 0 2.017.663 3.783 1.988 5.3S8.983 19.7 11 19.95Zm6.9-2.55c.333-.367.633-.763.9-1.188.267-.425.488-.866.663-1.325a8.32 8.32 0 0 0 .4-1.412C19.954 12.992 20 12.5 20 12a7.847 7.847 0 0 0-1.362-4.475A7.704 7.704 0 0 0 15 4.6V5c0 .55-.196 1.02-.587 1.412A1.927 1.927 0 0 1 13 7h-2v2a.97.97 0 0 1-.287.712A.968.968 0 0 1 10 10H8v2h6a.97.97 0 0 1 .713.287A.97.97 0 0 1 15 13v3h1c.433 0 .825.129 1.175.387.35.259.592.596.725 1.013Z"/></g></g></svg>'),
  share_android:('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M18 22a2.893 2.893 0 0 1-2.125-.875A2.893 2.893 0 0 1 15 19c0-.117.008-.238.025-.363s.042-.237.075-.337l-7.05-4.1c-.283.25-.6.446-.95.587A2.9 2.9 0 0 1 6 15a2.893 2.893 0 0 1-2.125-.875A2.893 2.893 0 0 1 3 12c0-.833.292-1.542.875-2.125A2.893 2.893 0 0 1 6 9c.383 0 .75.07 1.1.212.35.142.667.338.95.588l7.05-4.1a1.843 1.843 0 0 1-.075-.337A2.749 2.749 0 0 1 15 5c0-.833.292-1.542.875-2.125A2.893 2.893 0 0 1 18 2c.833 0 1.542.292 2.125.875S21 4.167 21 5s-.292 1.542-.875 2.125A2.893 2.893 0 0 1 18 8a2.9 2.9 0 0 1-1.1-.213 3.284 3.284 0 0 1-.95-.587L8.9 11.3c.033.1.058.212.075.337a2.753 2.753 0 0 1 0 .725 1.838 1.838 0 0 1-.075.338l7.05 4.1c.283-.25.6-.446.95-.588.35-.141.717-.212 1.1-.212.833 0 1.542.292 2.125.875S21 18.167 21 19s-.292 1.542-.875 2.125A2.893 2.893 0 0 1 18 22Zm0-16a.97.97 0 0 0 .712-.287A.968.968 0 0 0 19 5a.968.968 0 0 0-.288-.713A.967.967 0 0 0 18 4a.967.967 0 0 0-.712.287A.968.968 0 0 0 17 5c0 .283.096.521.288.713A.967.967 0 0 0 18 6ZM6 13a.968.968 0 0 0 .713-.288A.967.967 0 0 0 7 12a.97.97 0 0 0-.287-.713A.97.97 0 0 0 6 11a.97.97 0 0 0-.713.287A.97.97 0 0 0 5 12c0 .283.096.52.287.712.192.192.43.288.713.288Zm12 7c.283 0 .52-.096.712-.288A.965.965 0 0 0 19 19a.965.965 0 0 0-.288-.712A.965.965 0 0 0 18 18a.965.965 0 0 0-.712.288A.965.965 0 0 0 17 19c0 .283.096.52.288.712A.965.965 0 0 0 18 20Z"/></g></svg>'),
  share:(`
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><g id="ios_share"><mask id="mask0_802_595" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><rect id="Bounding box" width="24" height="24"/></mask><g mask="url(#mask0_802_595)"><path id="ios_share_2" d="M6 23c-.55 0-1.02-.196-1.412-.587A1.927 1.927 0 0 1 4 21V10c0-.55.196-1.021.588-1.413A1.925 1.925 0 0 1 6 8h3v2H6v11h12V10h-3V8h3c.55 0 1.021.196 1.413.587.391.392.587.863.587 1.413v11a1.93 1.93 0 0 1-.587 1.413A1.928 1.928 0 0 1 18 23H6Zm5-7V4.825l-1.6 1.6L8 5l4-4 4 4-1.4 1.425-1.6-1.6V16h-2Z"/></g></g></svg>
  `),
  print:(`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><g id="print"><mask id="mask0_802_592" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path id="Bounding box" d="M0 0h24v24H0z"/></mask><g mask="url(#mask0_802_592)"><path id="print_2" d="M16 8V5H8v3H6V3h12v5h-2Zm2 4.5c.283 0 .52-.096.712-.288A.965.965 0 0 0 19 11.5a.968.968 0 0 0-.288-.713A.967.967 0 0 0 18 10.5a.967.967 0 0 0-.712.287.968.968 0 0 0-.288.713c0 .283.096.52.288.712A.965.965 0 0 0 18 12.5ZM16 19v-4H8v4h8Zm2 2H6v-4H2v-6c0-.85.292-1.562.875-2.137S4.167 8 5 8h14c.85 0 1.563.288 2.138.863S22 10.15 22 11v6h-4v4Zm2-6v-4a.968.968 0 0 0-.288-.713A.967.967 0 0 0 19 10H5a.97.97 0 0 0-.713.287A.97.97 0 0 0 4 11v4h2v-2h12v2h2Z"/></g></g></svg>`),
  checklist:('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M5.55 19 2 15.45l1.4-1.4 2.125 2.125 4.25-4.25 1.4 1.425L5.55 19Zm0-8L2 7.45l1.4-1.4 2.125 2.125 4.25-4.25 1.4 1.425L5.55 11ZM13 17v-2h9v2h-9Zm0-8V7h9v2h-9Z"/></g></svg>'),
  servings:('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><mask id="a" width="16" height="16" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h16v16H0z"/></mask><g mask="url(#a)"><path d="M11.333 14.667V9.334h-2V4.667c0-.922.325-1.708.976-2.358a3.211 3.211 0 0 1 2.357-.976v13.334h-1.333Zm-6.667 0v-6.1a2.747 2.747 0 0 1-1.424-.934A2.495 2.495 0 0 1 2.667 6V1.333H4V6h.667V1.333H6V6h.667V1.333H8V6c0 .622-.192 1.167-.575 1.633A2.747 2.747 0 0 1 6 8.567v6.1H4.667Z"/></g></svg>'),
  timer:('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><mask id="a" width="16" height="16" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h16v16H0z"/></mask><g mask="url(#a)"><path d="M6 2V.667h4V2H6Zm1.333 7.333h1.334v-4H7.333v4ZM8 14.666a5.769 5.769 0 0 1-2.325-.474A6.134 6.134 0 0 1 3.767 12.9a6.133 6.133 0 0 1-1.292-1.908A5.77 5.77 0 0 1 2 8.666c0-.822.158-1.597.475-2.325a6.135 6.135 0 0 1 1.292-1.908 6.125 6.125 0 0 1 1.908-1.291A5.763 5.763 0 0 1 8 2.667c.689 0 1.35.11 1.983.333a6.482 6.482 0 0 1 1.784.966l.933-.933.933.933-.933.934c.422.555.744 1.15.967 1.783.222.633.333 1.295.333 1.983 0 .823-.158 1.598-.475 2.326a6.133 6.133 0 0 1-1.292 1.908 6.133 6.133 0 0 1-1.908 1.292A5.769 5.769 0 0 1 8 14.666Zm0-1.333c1.289 0 2.389-.455 3.3-1.367.911-.91 1.367-2.01 1.367-3.3 0-1.288-.456-2.388-1.367-3.3C10.389 4.457 9.289 4 8 4c-1.289 0-2.389.455-3.3 1.367-.911.91-1.367 2.01-1.367 3.3 0 1.288.456 2.388 1.367 3.3.911.91 2.011 1.366 3.3 1.366Z"/></g></svg>'),
  rating:('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><mask id="a" width="16" height="16" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h16v16H0z"/></mask><g mask="url(#a)"><path d="M4.7 14.033c-.122.1-.253.106-.391.017-.14-.09-.181-.211-.126-.367L5.433 9.6l-3.25-2.333c-.133-.09-.175-.212-.124-.367.05-.156.152-.234.308-.234H6.4L7.683 2.4c.023-.089.064-.15.126-.183a.393.393 0 0 1 .383 0c.06.033.102.094.125.183L9.6 6.667h4.033c.156 0 .259.077.309.233.05.155.008.278-.125.366L10.567 9.6l1.25 4.083c.055.156.014.278-.125.367-.14.089-.27.083-.392-.017l-3.3-2.5-3.3 2.5ZM6.4 11.1 8 9.867 9.6 11.1 9 9.066 10.5 8H8.633L8 5.933 7.367 8H5.5L7 9.066 6.4 11.1Z"/></g></svg>')
}

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
  if (!html) return;
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
  if (e.target.classList.contains("noun")) return;  
  e.target.closest(".ingredient").classList.toggle("complete")
}

function highlightStep(e) {
  // console.log("e", e.target)
  //   e.target.parent.children.forEach((i,el) => {
  //     el.classList.toggle("complete", )
  //   }
  if (e.target.classList.contains("noun")) return;
  if (e.target.closest(".timer")) return;
  if (e.target.tagName == "A") return;
  e.target.closest("li").classList.toggle("complete")

}

const ingredientMatch = /^(?:A )?([\-\/0-9 \u00BC-\u00BE\u2153-\u215E\u2009]*)\s(.*)/


function ingredientEl(string, terms) {
  if (string == "-") return m("hr");

  string = highlightTerms(string, terms)
  //console.log("terms", terms);

  let match = FRACTION_MAP.replace(clean(string)).match(ingredientMatch);

  if (match) {
    return [m("span.quantity", match[1].replace(" ", "\u202F")), " ", m("span", {innerHTML:highlightTerms(match[2], terms)})]
  }
  return [m("span.quantity", ""), m("span", {innerHTML:string})];
}

function highlightTerms(string, terms) {
  const pattern = new RegExp(`\\b(${Array.from(terms).join('|').replace("-","\\-") })\\b`, 'gi'); 
  return string.replace(pattern, match => `<span class="noun" id="term-${match}">${match}</span>`);
}

function highlightTimes(string) {
  const pattern = /([0-9]+)\s*(?:to|-|–)?\s*([0-9]+)?\s?(minutes?|hours?)/g; 
  return string.replace(pattern, (match, t1, t2, tt, offset, groups) => {
    // console.log("match", t1, t2, tt)
    
    return `<span class="timer" onclick="startTimer(this, ${t1}, ${t2})"><span class="countdown"></span><span class="label">${match}</span></span>`
  });
}

function dismissTimer(e) {
  console.log(e.target);
}

function playSound(loc) {
  var audio = new Audio(loc);
  // audio.play();  
}

function startTimer(e, t1, t2) {
  if (!e.startTime) {
    e.startTime = new Date();
    let duration = t1 * 60
    e.endTime = new Date(e.startTime.getTime() + duration * 1000);

    console.log("end", e.endTime);
    let countdownEl = e.querySelector(".countdown");

    console.log(e, t1, t2);
    e.classList.add("active")
    let update = () => {
      let now = new Date();
      let percent = (now - e.startTime) / 1000 / duration * 100;
      // console.log("perc", (now - e.startTime)/1000 , percent, duration)
      e.style.backgroundImage = `linear-gradient(to right, transparent ${percent}%, rgba(255,255,255,0.4) ${percent}%)`
      let remaining = Math.round((e.endTime - now)/1000);
      let expired = percent > 100;
      if (expired) {
        playSound("recipe/beep.mp4")
        delete e.style.backgroundImage;
        // clearInterval(e.interval);
        remaining = -remaining;
        e.classList.add("expired")
      }

      let countdownString = `${expired ? "-": ""}${Math.floor(remaining / 60)}m ${remaining % 60}s`
      countdownEl.innerText = countdownString;

    }
    e.interval = setInterval(update, 1000)
    update();
  } else {
    e.interval = clearInterval(e.interval)
    e.classList.remove("active");
    e.classList.remove("expired");

    e.style.backgroundImage = '';
    delete e.startTime;
  }
}

window.startTimer = startTimer;

function share() {
  parent.postMessage({share:{}}, "*");
}

function faviconForTitle(title) {
  title = title.toLowerCase()
  for (let f in emojiMap) {
    if (title.indexOf(f) != -1) {
      return emojiMap[f];
    }
  }
  return undefined;
}
function render() {
  try {
    let data = JSON.parse(window.params.body);
    var json = data; //JSON.parse(data);
    if (json["@type"] != "Recipe") {
      json = (json["@graph"] ?? json).find((item) => item["@type"] == "Recipe")
    }
    console.log("Recipe", json);
  } catch (e) {

    document.body.appendChild(m("div", "Error parsing recipe", m("p", e.message), m("p", e.stack), m("pre", window.params.body) ));
    console.error("Data", e, {e, body: window.params.body});
    return;
  }
  document.head.appendChild(el("base", {target: "_blank"}));

  delete document.documentElement.style.display;
  document.body.childNodes.forEach((c) => document.body.removeChild(c))


  if (!json) return;
  let image = json.image;
  if (Array.isArray(image)) image = image.shift();
  image = image?.url || image;
  let instructions = json.recipeInstructions;
  let title = clean(json.name);
  let description = clean(json.description?.replace(/\\n/g, "<br>"))
  let favicon = faviconForTitle(title) || "🍴";
  parent.postMessage({title:title, favicon:favicon, image:image, description:description, wakeLock:true, updateURL:true}, "*");
  description = description?.split("\n").join("<p>")
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

  let step = 1;
  function renderInstructions(instruction, terms) {
    if (Array.isArray(instruction)) {
      let instructions = instruction.map(i => renderInstructions(i, terms));
      let className = "step";
      console.log(instructions[0].tagName, instructions[0].tagName=="H3")
      if (instructions[0].tagName=="H3") className = "step header"
      return m("ul", {className}, instructions);
    }

    let text = (instruction?.text || instruction);
    if (!text) return;

    if (text?.startsWith("= ")) return m("h3", text.substring(2));
    if (text?.endsWith(":")) return m("h3", text);

    return m("li", { onclick: highlightStep }, 
      m("span.number" + (step > 9 ? ".big" : ""), `${step++}`),
      m("span.substep",{innerHTML:highlightTimes(highlightTerms(FRACTION_MAP.replace(text.trim()), terms))}))
  }

  function stepsFromText(text) {
    try {
      let steps = []
      let components = text.split(new RegExp("(?<=[\.\!\?]|[\.\!\?]\)|\))\s+(?!\()"));
  
      let append = false;
      while (components.length) {
        let step = components.shift()
        if (append) {
          steps.push(steps.pop() + " " + step)
        } else {
          steps.push(step);
        }
        if (step.indexOf("(") >= 0) { append = true; }
        if (step.includes(")")) { append = false; }
      }
      return steps;
    } catch (e) {
      return text.replace(/(\.\)? )+/g,"$1\n").split("\n")
    }
  }
  function flattenInstructions(instruction) {
    if (instruction.itemListElement) {
      return ["= " + instruction.name].concat(flattenInstructions(instruction.itemListElement).flat());
    }

    if (Array.isArray(instruction)) {
      if (Array.isArray(instruction[0])) instruction = instruction.flat();
      return instruction.map(i => flattenInstructions(i));
    }

    let text = (instruction.text || instruction.name || instruction);
 
    if (reformat) {
      text = stepsFromText(text);
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



  let recipeYield = (getStringProperty(json.recipeYield));
  if (!isNaN(parseInt(recipeYield?.charAt(recipeYield?.length - 1)))) recipeYield += " servings";

  function imgload(e) {
      console.log(e, "img");
      var image = document.querySelector('img');
      var isLoaded = image.complete && image.naturalHeight !== 0;
      alert(isLoaded);
  }


  var bgImg = new Image();
  bgImg.onload = function(){
    let thumbnail = document.querySelector("#thumbnail");
    let thumbnailContainer = document.querySelector("#thumbnail-container");
    thumbnail.style.backgroundImage = 'url("' + bgImg.src + '")';
    thumbnail.style.filter = `blur(${thumbnailContainer.offsetHeight / bgImg.naturalHeight * 1}px)`;
    // thumbnail.style.transform = `scale(1.1)`;  
    setTimeout(() => thumbnail.style.opacity = 1.0, 0);
    if (window.scrollY == 0) setTimeout(() => {
      const yOffset = -20; 
      const element = document.querySelector('.recipe-content');
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;  
      window.scrollTo({top: y, behavior: 'smooth'});  
    }, 1000)
  };
  bgImg.src = image;

  console.log("image", bgImg.src)

  let qrImage = QRCodeURL(params.originalURL, {margin:0});
  let originalURL = json.mainEntityOfPage?.["@id"] || json.mainEntityOfPage || json.url;
  document.body.appendChild(
    m(".recipe", {},
      image ? m("#thumbnail-container", m("#thumbnail.thumbnail.print-hide", { style: "background-image:url(" + image + ");" })) : null,
      m(".recipe-content",
        m("header",
          m("a.publisherlink", {href:originalURL, target:"_blank"},
            m("img.publisher", { src: json.publisher?.image ?.[0]?.url ?? json.publisher ?.logo ?.url }),
          ),
          m(".headerflex",
            m(".headerleft",
              m("h1", {onclick:keepAwake}, title),
              m(".metadata",
                (recipeYield) ? m("div", m("span.yield", m(".icon.servings", {innerHTML:icons.servings}), recipeYield)) : null,
                json.totalTime ? m(".time",
                  m(".icon.time", {innerHTML:icons.timer}),

                  json.totalTime ? m("span", formatTime(json.totalTime)) : undefined,
                  // " (",
                  // json.prepTime ? m("span", formatTime(json.prepTime), " prep") : undefined,
                  // json.cookTime ? m("span",  ", ",  formatTime(json.cookTime), " cook") : undefined,
                  // ")"
                ) : null,
                (rating) ? m("div.rating",
                    m(".icon.rating", {innerHTML:icons.rating}),
                    parseFloat(rating.ratingValue).toFixed(1), " ",
                    // ratingCount ? m("span.count", ratingCount.toString()) : null
                    )
                : null,
                json.nutrition?.calories ? 
                  m("div", m(".icon.info", {innerHTML:icons.info}),
                    (json.nutrition?.calories.toString().replace("calories", "Cal").replace("kcal", "Cal")) + (isNaN(json.nutrition?.calories) ? '' : ' Cal')) : null,

                // m("div.spacer"),
              ),
            ),
            m(".actions.print-hide",
              originalURL ? m("a.action", { title:"Open original", href: originalURL, target:"_blank"}, m(".icon.public", {innerHTML:icons.public})) : null,
              m("a.action", { title:"Share", onclick: share}, m(".icon.share", {innerHTML:icons.share})),
              // m("a.action", { title:"Show steps as list", onclick: () => {reformat = !reformat; render(); return false;}}, m(".icon.checklist")),
              m("a.action", { title:"Print", onclick: () => {window.print(); return false;} }, m(".icon.print", {innerHTML:icons.print})),
            )
          ),
          description ? m(".description", {innerHTML:description},
            json.author?.name ? m("span.author", (" —⁠" + json.author?.name)) : null,
            m("p"),
          ) : null,

        ),
        m(".columns",
          m("section.ingredients", 
            m("caption.ingredients-title", {onclick:(e) => {e.target.closest("section").classList.toggle("hanging")}},"Ingredients"),
            ingredients,
            qrImage ? m("img.qr.print-show", {src:qrImage}) : null
          ),
          m(reformat ? "section.instructions.numbered" : "section.instructions", 
             m("caption.ingredients-title", {onclick:() => {reformat = !reformat; render(); return false;}},
             reformat ? "Steps" : "Instructions", 
             m("div.listtoggle.print-hide", {innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><mask id="a" width="16" height="16" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#D9D9D9" d="M0 0h16v16H0z"/></mask><g mask="url(#a)"><path fill="#000" d="M3.7 12.667 1.333 10.3l.934-.933 1.416 1.416L6.517 7.95l.933.95-3.75 3.767Zm0-5.334L1.333 4.967l.934-.934L3.683 5.45l2.834-2.833.933.95L3.7 7.333Zm4.967 4V10h6v1.333h-6Zm0-5.333V4.667h6V6h-6Z"/></g></svg>'}),
            ),
            instructions)
        ),
      )
    )
  )
}

function keepAwake() {
  let ctx = new AudioContext();

  let bufferSize = 2 * ctx.sampleRate, 
      emptyBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate), 
      output = emptyBuffer.getChannelData(0);

  for(let i = 0; i < bufferSize; i++) output[i] = 0;

  let source = ctx.createBufferSource();
  source.buffer = emptyBuffer;
  source.loop = true;

  let node = ctx.createMediaStreamDestination();
  source.connect(node);

  let audio = document.createElement("audio");
  audio.style.display = "none";
  document.body.appendChild(audio);

  audio.srcObject = node.stream;
  audio.play();
  console.log("playing", audio)
}


var path = window.script.substring(0, window.script.lastIndexOf("."));
var cssURL = path + ".css";
loadSyle(cssURL).then(render);