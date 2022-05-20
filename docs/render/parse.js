// let title = params.title  


parent.postMessage({title:"Parsing Content..."}, "*");
document.write("PARSING CONTENT…")


const parser = new DOMParser();
const doc = parser.parseFromString(params.body, "text/html");

let ldjson = doc.querySelector('script[type="application/ld+json"]')
if (ldjson) {
  ldjson = ldjson.innerText.trim();
  let f = new FileReader();
  f.onload = function(e) { 
    //top.location.href = ( '/#/' + e.target.result);
    parent.postMessage({replaceURL:'/#/' + e.target.result}, "*");
  };
  f.readAsDataURL(new Blob([ldjson],{type : 'application/ld+json;charset=utf-8'}));
} else {
  alert("No recipe found")
}