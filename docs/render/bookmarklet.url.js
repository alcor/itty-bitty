// https://itty.bitty.app/itty-bitty-recipes/d/Clean-your-recipes-with-itty-bitty/f/%F0%9F%8D%B3/#Send_to_itty.bitty/javascript:f=new%20FileReader();f.onload=function(e){top.location.href=('https://itty.bitty.app/#/'+e.target.result)};f.readAsDataURL(new%20Blob([document.documentElement.outerHTML],{type:'text/raw+html;render=parse;encode=none;charset=utf-8'}));

// JSON extraction

//javascript:
((itty_bitty_recipes) => {
    let ldjson = document.querySelector('script[type="application/ld+json"]').innerText.trim();
  let f = new FileReader();
  f.onload = function(e) { location.href = (itty_bitty_recipes + '/#/' + e.target.result);};
  f.readAsDataURL(new Blob([ldjson],{type : 'application/ld+json;charset=utf-8'}));
})('https://recipe.bitty.app')



// DOM extraction

javascript:f=new(FileReader)();f.onload=function(e){top.location.href=('https://itty.bitty.app/#/'+e.target.result)};f.readAsDataURL(new(Blob)([document.documentElement.outerHTML],{type:'text/raw+html;render=parse;encode=none;charset=utf-8'}));

javascript:f=new(FileReader)();f.onload=function(e){top.location.href=('http://localhost:8888/#/'+e.target.result)};f.readAsDataURL(new(Blob)([document.documentElement.outerHTML],{type:'text/raw+html;render=parse;encode=none;charset=utf-8'}));



// JS Injection

javascript:
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

javascript:
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
