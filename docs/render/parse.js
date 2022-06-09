// let title = params.title  


parent.postMessage({title:"Parsing Content..."}, "*");
document.body.appendChild(document.createTextNode("• • •"))


const parser = new DOMParser();
const doc = parser.parseFromString(params.body, "text/html");


let ldjson = doc.querySelector('script[type="application/ld+json"]')
if (ldjson) {
  cleanRecipe(ldjson)
} else {
  alert("No recipe found")
}



function cleanRecipe(ldjson) {

  try {
    var json = JSON.parse(ldjson.innerText); //JSON.parse(data);
    if (json["@type"] != "Recipe") {
      json = (json["@graph"] ?? json).find((item) => item["@type"] == "Recipe")
    }
    
    delete json.review;
    delete json.video;

    let f = new FileReader();
    f.onload = function(e) { 
      parent.postMessage({replaceURL:e.target.result, compressURL:"true"}, "*");
    };
    f.readAsDataURL(new Blob([JSON.stringify(json)],{type : 'application/ld+json;charset=utf-8'}));

  } catch (e) {
    console.debug("Data", e, {ldjson});
  }
}

