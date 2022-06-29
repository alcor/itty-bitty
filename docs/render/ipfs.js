loadSyle(document.currentScript.src.replace("js", "css"))

loadScript("https://unpkg.com/ipfs@0.63.2/dist/index.min.js", (scr) => {
  let cid = params.url.replace("ipfs:",'');
  getData(cid);
})

// async function test(cid) {
//   let file = {
//     path: "hello.txt",
//     content: "Hello World 101",
//   }
//   console.log("adding", file)

//   const node = await Ipfs.create()
//   console.log("adding", file)

//   const fileAdded = await node.add(file);
//   console.log("added", fileAdded)
// }

// async function addData(data) {
//   const node = await Ipfs.create()
//   const results = node.add(data)
//   for await (const { cid } of results) {
//     console.log(cid.toString())
//   }
// }

async function getData(cid) {
  const node = await Ipfs.create()
  const stream = node.cat(cid)
  let data = ''
  let chunks = []
  for await (const chunk of stream) { chunks.push(chunk) }
  var a = new FileReader();
  a.onload = function(e) { 

  console.log("Got IPFS Data", e.target.result)
    location.href=e.target.result

  }
  a.readAsDataURL(new Blob(chunks, {encoding:"UTF-8",type:"text/plain"}));

  console.log("Got IPFS Data", data)
  return data;


}


let url = params.url.replace("ipfs:", "https://ipfs.io/ipfs/");
// location.href = url;