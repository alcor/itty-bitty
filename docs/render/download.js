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


try {
  //let dl = document.querySelector("#download");
  let extension = title.split(".")
  let dl = el("a", {id: "download", href:url, download: title},
    el("div", {id: "dl-image", innerText:extension.pop() ?? ""}),
    el("div", {id: "dl-name", innerText:"title"}),
    el("div", {id: "dl-button"}),
  )
  document.body.append(dl)
  dl.click();
} catch (e) {
  console.log("DL error", e)
  location.href = url;
}