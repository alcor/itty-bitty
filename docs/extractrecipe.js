javascript:((itty_bitty_recipes) => {
let l=document.querySelector('script[type="application/ld+json"]');
if (!l) return alert("No Recipe element found in HTML")
let ldjson = l.innerText.trim();
let json = JSON.parse(ldjson);
if (Array.isArray(json)) json = json.find((o)=>o['@type']=="Recipe")
console.log(json)
var blob = new Blob([JSON.stringify(json)],{type : 'application/ld+json;charset=utf-8'});
var a = new FileReader();
a.onload = function(e) {
  let url = itty_bitty_recipes + '/#/' + e.target.result;
  console.log("URL", url.length, url)
  open(url);
};
a.readAsDataURL(blob);
})('http://localhost')


/*
javascript:(function(){
  let id="ittybitty";
  if (document.getElementById(id)) return;
  var l = document.createElement('script');
  l.setAttribute('type','text/javascript');
  l.setAttribute('src','http://localhost/extractrecipe.js');
  l.id=id;
  document.head.appendChild(l);
})();
*/