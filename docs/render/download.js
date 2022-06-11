loadSyle(document.currentScript.src.replace("js", "css"))

try {
  let filename = params.title 
  let components = filename.split(".");
  let extension = params.args?.extension;
  let title = params.args?.filename ? [params.args?.filename, params.args?.extension].join(".") : filename || "";
  if (components.length > 1) {
    extension = components.pop();
    title = components.join(".");
  }

  let dl = el("a", {id: "download", href:params.url, download: title},
    el("div", {id: "dl-image", innerText:extension ?? ""}),
    el("div", {id: "dl-name", innerText:title}),
    el("div", {id: "dl-button"}),
  )
  document.body.append(dl)
  setTimeout(() => dl.click(), 1000);

} catch (e) {
  console.log("DL error", e)
  top.location.href = params.url;
}