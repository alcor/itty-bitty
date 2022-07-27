function decodePrettyComponent(s) {
  let replacements = {'---': ' - ', '--': '-','-' : ' '}
  return decodeURIComponent(s.replace(/-+/g, e => replacements[e] ?? '-'))
}

function pathToMetadata(path) {
  let components = path.substring(1).split("/");
  let info = {title: decodePrettyComponent(components.shift())}
  for (let i = 0; i < components.length; i+=2) {
    let key = components[i];
    let value = components[i+1];
    if (!value) continue;
    if (key == "d") { value = decodePrettyComponent(value); }
    else if (value.includes("%")) { value = decodeURIComponent(value); }
    if (key.length && value.length) info[key] = value;
  }
  return info;
}

export default async (request, context) => {
  const ua = request.headers.get("user-agent");
  let url = new URL(request.url);
  let path = url.pathname;
  let geo = context.geo.city + ", " + context?.geo?.subdivision?.code + ", " + context?.geo?.country?.code

  let uaArray = Deno.env.get("UA_ARRAY")?.split(",") || [];
  let uaMatch = uaArray.some(a => ua.indexOf(a) != -1);

  if (uaMatch) {
    //console.log("Redirecting legacy client", )
    return new Response('', { status: 401 });
  }
  
  if (path != "/" ) {
    // context.log(path, request.headers, geo);
    let metadataBots = [ "Twitterbot", "curl", "facebookexternalhit", "Slackbot-LinkExpanding", "Discordbot", "snapchat"]
    let isMetadataBot = metadataBots.some(bot => ua.indexOf(bot) != -1);

    if (isMetadataBot && path.endsWith("/")) {
      let info = pathToMetadata(path)

      let content = ['<meta charset="UTF-8">'];
      if (info.title) { content.push(`<title>${info.title}</title>`,`<meta property="og:title" content="${info.title}"/>`); }
      if (info.s) { content.push(`<meta property="og:site_name" content="${info.s}"/>`); }
      if (info.t) { content.push(`<meta property="og:type" content="${info.t}"/>`); }
      if (info.d) { content.push(`<meta property="og:description" content="${info.d}"/>`,`<meta name="description" content="${info.d}"/>`); }
      if (info.i) { 
        if (!info.i.startsWith("http")) info.i = atob(info.i.replace(/=/g,''));
        content.push(`<meta property="og:image" content="${info.i}"/>`); 
        content.push(`<meta name="twitter:card" content="summary_large_image">`);
        if (info.iw) content.push(`<meta property="og:image:width" content="${info.iw}"/>`); 
        if (info.ih) content.push(`<meta property="og:image:width" content="${info.ih}"/>`); 
      } 
      if (info.c) { content.push(`<meta name="theme-color" content="#${info.c}"/>`); }
      if (info.v) { 
        if (!info.v.startsWith("http")) info.v = atob(info.v.replace(/=/g,''));
        content.push(`<meta property="og:video" content="${info.v}"/>`); 
        if (info.vw) content.push(`<meta property="og:image:width" content="${info.vw}"/>`); 
        if (info.vh) content.push(`<meta property="og:image:width" content="${info.vh}"/>`); 
      } 
      if (info.f) {
        if (info.f.length > 9){
          if (!info.f.startsWith("http")) info.f = atob(info.f.replace(/=/g,''));
          content.push(`<link rel="icon" type="image/png" href="${info.f}">`);
        } else {
          let codepoints = Array.from(info.f).map(c => c.codePointAt(0).toString(16));
          content.push(`<link rel="icon" type="image/png" href="https://fonts.gstatic.com/s/e/notoemoji/14.0/${codepoints.join("_")}/128.png">`);
        }
      }
      content.push(`<meta property="og:url" content="${request.url}" />`);
      
      console.log(["Metadata Request", JSON.stringify(info), geo, ua].join('\t')); 

      return new Response(content.join("\n"), {
        headers: { "content-type": "text/html" },
      });
    } 
  } else {
    console.log(["Request", path, geo, request.headers.get("referer"), ua].join('\t'));
  }
}
