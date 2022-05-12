export default async (request, context) => {
  const useragent = request.headers.get("user-agent");
  let url = new URL(request.url);
  let path = url.pathname;
  let metadataBots = [ "Twitterbot", "curl", "facebookexternalhit", "Slackbot-LinkExpanding", "Discordbot"]
  let isMetadataBot = metadataBots.some(bot => useragent.indexOf(bot) != -1);
  if (isMetadataBot) {
    let components = path.split("/");
    components.shift();
    let title = decodeURIComponent(components.shift()).replace(/_/g, " ");
    let desc = decodeURIComponent(components.shift()).replace(/_/g, " ");
    let image = decodeURIComponent(components.join("/"));
    let content = "";
    if (title) {
      content += `<title>${title}</title><meta property="og:title" content="${title}"/>`;
      // content += `<meta property="og:site_name" content=""/>`
    }
    if (desc && desc.length > 1) {
      content += `<meta name="description" content="${desc}"/><meta property="og:description" content="${desc}"/>`;
    }
    if (image) {
      if (image.startsWith("http")) {
        content += `<meta property="og:image" content="${image.replace(":/", "://")}"/>`;
      } else {
        image = decodeURIComponent(image)
        let codepoints = [];
        for (const char of image) {
          codepoints.push(char.codePointAt(0).toString(16));
        }
        content += `<link rel="icon" type="image/png" href="https://fonts.gstatic.com/s/e/notoemoji/14.0/${codepoints.join("_")}/128.png">`
      }
    }
    
    context.log(title, "|", desc || "-", "|", image || "-");

    return new Response(content, {
      headers: { "content-type": "text/html" },
    });
  }
  // else {
  //   console.log("Forward: " + "/?" + path)
  //   return (context.rewrite("/?" + path))
  // } 
}
