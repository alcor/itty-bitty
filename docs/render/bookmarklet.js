let url = params.body
let title = params.title  
let ua = navigator.userAgent;

var b = document.documentElement;
b.setAttribute('data-useragent',  navigator.userAgent);
b.setAttribute('data-platform', navigator.platform );

let mobile = ua.match(/Mobile/i) 

let barName = ua.match(/Chrome/i) ? "Bookmarks" : "Favorites"
let managerName = ua.match(/Edge/i) ? "Favorites" : "Bookmarks"
let cmdKey = ua.match(/Mac/i) ? "⇧⌘B" : "Ctrl + Shift + B"

loadSyle(document.currentScript.src.replace("js", "css")).then(() => {
  document.body.appendChild(
    el("div", {id:"content"},
    el("div", {className:"description"}, params.info?.d ?? ""),
    el("a", {className:"bookmarklet", href:url}, el("span", {className:"capsule", innerText:"" + title || "Bookmarklet"})),
    el("p", {id:"emoji", innerText:"☝️"}),
      el("p", {innerHTML:`This page contains a <a target="_blank" href="https://en.wikipedia.org/wiki/Bookmarklet">bookmarklet</a>.`}),

      el("p", {className:"", innerText:`Drag this bookmarklet to your ${managerName} to use it.`}),
      el("p", {className:"hint desktop", innerText:`(Hit ${cmdKey} to toggle the ${managerName} bar)`}),
      el("p", {className:"hint mobile", innerText:`To open ${managerName} while dragging, hold on top of it, or tap bookmarks with a second finger to open`}),
      // el("p", {innerText:`Or bookmark this page, then edit the address to remove everything to the left of "javascript:"`}),
      
    )
  );  
})
