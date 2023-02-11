parent.postMessage({title:"Parsing Content..."}, "*");

let lca = (a,b) => {
  return a.parents().has(b).first();
}

const parser = new DOMParser();
const doc = parser.parseFromString(params.body, "text/html");
console.log("🛠️ Parsing Document ", doc)

let findLDJsonRecipe = (document) => {
  let lds = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
  .map(e => e.innerText)
  .sort((a,b) => a.length - b.length)
  
  for (const ld of lds) {
    let r = JSON.parse(ld);
    if (r["@type"] != "Recipe") {
      r = Array.isArray(r) ? r : r["@graph"]
      r = r?.find((item)=>item["@type"]=="Recipe")
    }
    if (!r) continue;
    
    delete r.review;
    delete r.video;
    if (!r.url) r.url = location.href;
    
    console.log("Found Recipe:", r)
    return r;
  }
}

function findMicrodataRecipe(doc) {
  return parseMicrodata(doc).find((item)=>item["@type"]=="Recipe");
}


let textRecipe = async document => {
console.log("text recipe", document, document.documentElement.textContent)
return {};
}

let scrapeRecipe =  async document => {
  
  // Get title
  let recipe = {};
  recipe.name = document.title
  
  // Get opengraph metadata
  let title = document.evaluate('//meta[@property="og:title"]/@content', document, null, XPathResult.STRING_TYPE)?.stringValue;
  if (title) recipe.name = title 
  
  let siteName = document.evaluate('//meta[@property="og:site_name"]/@content', document, null, XPathResult.STRING_TYPE)?.stringValue;
  if (siteName) recipe.publisher = {name:siteName}
  
  recipe.image = document.evaluate('//meta[@property="og:image"]/@content', document, null, XPathResult.STRING_TYPE)?.stringValue;
  
  // TODO: get siteLogo
  
  // Get microformat metadata
  // let microName = document.evaluate('//*[@itemprop="name"]/@content', document, null, XPathResult.STRING_TYPE)?.stringValue;
  // if (microName) recipe.name = microName;
  
  // recipe.recipeYield = document.evaluate('//*[@itemprop="recipeYield"]/text()', document, null, XPathResult.STRING_TYPE)?.stringValue;
  // recipe.totalTime = document.evaluate('//*[@itemprop="totalTime"]/text()', document, null, XPathResult.STRING_TYPE)?.stringValue;
  
  // let ingredients = []
  // var xpath = `//*[@itemprop="recipeIngredient"]`;
  // const match = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
  // let node = null;
  // while (node = match.iterateNext()) {
  //   ingredients.push(node.innerText)
  // } 
  // if (ingredients.length) recipe.recipeIngredient = ingredients;
  
  // {
  //   var xpath = `//*[@itemprop="recipeInstructions"]`;
  //   const match = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
  //   let node = null;
  //   let instructions = [];
  //   while (node = match.iterateNext()) {
  //     console.warn("match", node.innerText)  
  //     instructions.push(node.innerText);
  //   } 
    
  //   if (instructions.length == 1) instructions = instructions[0].trim().split("\n").filter((a)=>a.length > 1)
  //   recipe.recipeInstructions = instructions;
  // }


  
  // Scrape Yield
  if (!recipe.recipeYield) {
    for(let text in ["yield", "makes", "serv"]) {
      var xpath = `//div[starts-with(text(), '${text}')]`;
      const match = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
      let node = null;
      while (node = match.iterateNext()) {
        recipe.recipeYield = node.innerText 
      }  
    }
  }
  
  // Scrape ingredients
  if (!recipe.recipeIngredient) {
    var xpath = "//div[text()='Ingredients']";
    const match = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
    let node = null;
    while (node = match.iterateNext()) {
      console.warn("match", node.parentNode.innerText.split("\n"))  
      recipe.recipeIngredient = node.parentNode.innerText.trim().split("\n") 
    }  
  }
  
  // Scrape instructions
  if (!recipe.recipeInstructions) {
    var xpath = "//div[text()='Instructions']";
    const match = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
    let node = null;
    while (node = match.iterateNext()) {
      console.warn("Instructions", node.parentNode.innerText.split("\n"))  
      recipe.recipeInstructions = node.parentNode.innerText.trim().split("\n").filter((a)=>a.length > 1) 
    }
  }  
  
  console.warn("Extracted", JSON.stringify(recipe,undefined,2))

  if (!recipe.recipeInstructions) return undefined
  return recipe;
}



let recipe = findLDJsonRecipe(doc) || findMicrodataRecipe(doc) || await scrapeRecipe(doc) || await textRecipe(doc);

if (!recipe.recipeInstructions) recipe = undefined;

if (recipe) {
    
  let url = doc.evaluate('//meta[@property="og:url"]/@content', doc, null, XPathResult.STRING_TYPE)?.stringValue;
  if (url) recipe.mainEntityOfPage = url

  if (!recipe.image) {
    recipe.image = doc.evaluate('//meta[@property="og:image"]/@content', doc, null, XPathResult.STRING_TYPE)?.stringValue;
  }

  console.log(recipe);
  let f = new FileReader();
  f.onload = function(e) { 
    parent.postMessage({replaceURL:e.target.result, compressURL:"true"}, "*");
  };
  f.readAsDataURL(new Blob([JSON.stringify(recipe)],{type : 'application/ld+json;charset=utf-8'}));
} else {
  parent.postMessage({title:"No Recipe Found...", error:"No recipe was found on this page."}, "*");
}


function parseMicrodata(doc) {
  let parsedElements = []
  const microdata = [];

  let sanitize = (input) => input?.replace(/\s/gi, ' ').trim();
  
  function addValue(obj, key, value) {
    if (Array.isArray(obj[key])) {
      obj[key].push(value);
    } else if (obj[key]) {
      obj[key] = [obj[key], value];
    } else {
      obj[key] = value;
    }
  }
  
  function parseItem(elem) {
    const data = { }    
    data["@type"] = elem.getAttribute('itemtype')?.split("/").pop();
    if (elem.getAttribute('itemid')) data["@id"] = elem.getAttribute('itemid');
    traverseItem(elem, data);
    parsedElements.push(elem);
    return data;
  }
  
  function traverseItem(item, data) {
    for (const child of item.children) {      
      if (!child.hasAttribute('itemprop')) {
        traverseItem(child, data);
        continue;
      } 

      const itemProps = child.getAttribute('itemprop').split(' ');  
      if (child.hasAttribute('itemscope')) {
        const childData = parseItem(child)                              
        itemProps.forEach(key => addValue(data, key, childData));
      } else {        
        itemProps.forEach(key => {
          let value = key === 'url' ? child.href : sanitize(child.content || child.textContent || child.src);
          addValue(data, key, value)
        });
        traverseItem(child, data);
      }
    }
  }
  
  doc.querySelectorAll("[itemscope]").forEach(function(elem, i) {
    if (!parsedElements.includes(elem)) {
      microdata.push(parseItem(elem));
    }
  });
  return microdata;
}