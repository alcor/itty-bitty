export default async (request, context) => {
  const useragent = request.headers.get("user-agent");
  let url = new URL(request.url);
  let path = url.pathname;
  let metadataBots = [ "Twitterbot", "curl", "facebookexternalhit", "Slackbot-LinkExpanding", "Discordbot"]
  let isMetadataBot = metadataBots.some(bot => useragent.indexOf(bot) != -1);
  if (isMetadataBot) {
    let components = path.substring(1).split("/");
    // components.shift();
    let info = {}
    info.t = decodeURIComponent(components.shift()).replace(/_/g, " ");

    components.forEach(component => {
      let field = component.split(":");
      console.log("field", field)
      let key = field.shift();
      let value = decodeURIComponent(field.join(":"));
      if (key.length && value.length) info[key] = value;
    })
    info.d = info.d?.replace(/_/g, " ");

    let content = [];
    if (info.t) { content.push(`<title>${info.t}</title>`,`<meta property="og:title" content="${info.t}"/>`); }
    if (info.s) { content.push(`<meta property="og:site_name" content="${info.s}"/>`); }
    if (info.d) { content.push(`<meta property="og:description" content="${info.d}"/>`,`<meta name="description" content="${info.d}"/>`); }
    if (info.i) { content.push(`<meta property="og:image" content="${info.i}"/>`); } 
    if (info.f) {
      if (info.f.length > 9){
        content.push(`<link rel="icon" type="image/png" href="${info.f}">`);
      } else {
        let codepoints = Array.from(info.f).map(c => c.codePointAt(0).toString(16));
        content.push(`<link rel="icon" type="image/png" href="https://fonts.gstatic.com/s/e/notoemoji/14.0/${codepoints.join("_")}/128.png">`);
      }
    }
    
    context.log(info, content);

    return new Response(content.join("\n"), {
      headers: { "content-type": "text/html" },
    });
  }
}
