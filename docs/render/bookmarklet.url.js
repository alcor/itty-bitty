
// Minification:
// pbpaste | uglifyjs | xargs -0 printf "javascript:%s\n"

// LD+JSON extraction
((ib) => {
  ld = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map(e => e.innerText)
    .sort((a,b) => a.length - b.length)
    .pop();
  if (!ld) alert("No recipe data found on this page. Sorry!");
  ld = JSON.parse(ld);
  if (ld["@type"] != "Recipe"){ ld=(ld["@graph"]??ld).find((item)=>item["@type"]=="Recipe") }
  delete ld.review;
  delete ld.video;
  if (!ld.url) ld.url = location.href;
  f = new FileReader();
  f.onload = function(e) {location.href=(ib + '/#/' + e.target.result);};
  f.readAsDataURL(new Blob([JSON.stringify(ld)],{type:'application/ld+json;compress=true;charset=utf-8'}));
})('https://itty.bitty.app')

// Full DOM extraction
((ib) => {
  let f = new(FileReader)();
  f.onload = function(e){ top.location.href=(ib + '/#/' + e.target.result) };
  f.readAsDataURL(new(Blob)([document.documentElement.outerHTML.substring(0,750000)],{type:'text/raw+html;render=parse;encode=none;charset=utf-8'}));
})('https://itty.bitty.app')


// JS Injection
(function(ittybitty){
  let id="ittybitty";
  if (document.getElementById(id)) return;
  var l = document.createElement('script');
  l.setAttribute('type','text/javascript');
  l.setAttribute('src',ittybitty + '/extractrecipe.js');
  l.id=id;
  document.head.appendChild(l);
})("https://itty.bitty.app");

// JS Injection with fallback
(function(host){
  document.getElementById(host)?.remove();
  var l = document.createElement('script');
  l.setAttribute('type','text/javascript');
  l.setAttribute('src', host + '/extract.js');
  l.onerror = () => {
    let html = document.documentElement.innerHTML;
    let f = new FileReader();
    f.onload = function(e) { location.href = (host + '/#/' + e.target.result);};
    f.readAsDataURL(new Blob([html],{type : 'text/rawhtml;charset=utf-8'}));
  };
  l.id = id;
  document.head.appendChild(l);
})("https://itty.bitty.app");
