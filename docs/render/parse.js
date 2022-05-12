// let title = params.title  

const parser = new DOMParser();
const doc = parser.parseFromString(params.body, "text/html");

let ldjson = doc.querySelector('script[type="application/ld+json"]').innerText.trim();
let f = new FileReader();
f.onload = function(e) { top.location.href = ( '/#/' + e.target.result);};
f.readAsDataURL(new Blob([ldjson],{type : 'application/ld+json;charset=utf-8'}));