loadSyle(document.currentScript.src.replace("js", "css"))

loadScript("https://unpkg.com/ipfs@0.63.2/dist/index.min.js", (scr) => {
  let cid = params.url.replace("ipfs:",'');
  console.log("script", scr, Ipfs, params)

  getData(cid);
})

async function test(cid) {
  let file = {
    path: "hello.txt",
    content: "Hello World 101",
  }
  console.log("adding", file)

  const node = await Ipfs.create()
  console.log("adding", file)

  const fileAdded = await node.add(file);
  console.log("added", fileAdded)
}
async function addData(data) {
  const node = await Ipfs.create()
  const results = node.add(data)
  for await (const { cid } of results) {
    console.log(cid.toString())
  }
}

async function getData(cid) {
  const node = await Ipfs.create()
  const stream = node.cat(cid)
  const decoder = new TextDecoder()
  let data = ''
  console.log("Got IPFS Data", data)

  for await (const chunk of stream) {
    data += decoder.decode(chunk, { stream: true })
  }

  console.log("Got IPFS Data", data)
  return data;
}


let url = params.url.replace("ipfs:", "https://ipfs.io/ipfs/");
location.href = url;