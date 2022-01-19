const functions = require("firebase-functions");

exports.index = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", );
  const agent = request.headers["user-agent"];
  let path = request.path;
  if (agent.indexOf("Twitterbot") != -1 || agent.indexOf("facebookexternalhit") != -1) {
    let components = path.split("/");
    components.shift();
    components.pop();
    let title = components.shift().replace("_", " ");
    let desc = components.shift().replace("_", " ");
    let image = components.join("/");
    console.log("components", title, desc, image)

    let content = "";
    if (title) content += `<title>${title}</title><meta property="og:title" content="${title}"/>`;
    if (desc) content += `<meta name="description" content="${desc}"/><meta property="og:description" content="${desc}"/>`;
    if (image) {
      if (image.startsWith("http")) {
        content += `<meta property="og:image" content="${image}"/>`;
      } else {
        image = decodeURIComponent(image)
        console.log("image", image);
        let codepoints = [];
        for (const char of image) {
          codepoints.push(char.codePointAt(0).toString(16));
        }
        content += `<link rel="apple-touch-icon" href="https://fonts.gstatic.com/s/e/notoemoji/14.0/${codepoints.join("_")}/72.png">`;
        // https://fonts.gstatic.com/s/e/notoemoji/14.0/1f468_1f3fd_200d_1f91d_200d_1f468_1f3fc/72.png
        // https://fonts.gstatic.com/s/e/notoemoji/14.0/1f468-1f3fd-200d-1f91d-200d-1f468-1f3fc/72.png
      }
    }
    response.send(content);
  } else {
    response.redirect("/?" + path);
  }

});