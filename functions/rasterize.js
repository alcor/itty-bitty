const sharp = require("sharp")

 exports.handler = async function (event, context) {
  console.log("event", event, context, event.rawQuery);
  let data = event.rawQuery.replace(/\=/g,'')
  let svg = atob(data) || decodeURIComponent(event.rawQuery);
  if (!svg.startsWith("<svg")) svg = `<svg xmlns="http://www.w3.org/2000/svg">${svg}</svg>`
  console.log("svg", svg)
  const img = sharp(Buffer.from(svg))
  .resize(1200)
  const jpeg = img.jpeg().toBuffer();
  return {
    statusCode: 200,
    headers: {"content-type": "image/jpeg"},
    isBase64Encoded: true,
    body: (await jpeg).toString('base64')
  };
  };