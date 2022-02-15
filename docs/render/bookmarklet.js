let url = params.body
let title = params.title  
loadSyle(document.currentScript.src.replace("js", "css"))
document.body.appendChild(
  el("div", {id:"content"},
    el("a", {href:url, innerText:"Script: " + title || "Bookmarklet"}),
    el("p", {id:"emoji", innerText:"☝️"}),
    el("p", {innerText:"Drag this bookmarklet to your bookmarks / favorites to use it."}),
    el("p", {innerText:"On mobile, bookmark this page, then edit the address to remove everything to the left of 'javascript:'."})
  )
);
