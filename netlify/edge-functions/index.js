export default async (request, context) => {
  const ua = request.headers.get("user-agent");
  let url = new URL(request.url);
  let path = url.pathname;

  let uaArray = Deno.env.get("UA_ARRAY")?.split(",") || [];
  let uaMatch = uaArray.some(a => ua.indexOf(a) != -1);

  if (uaMatch) {
    //console.log("Redirecting legacy client", context.geo.city + ", " + context.geo.subdivision.code)
    return new Response('', { status: 401 });
  }
  
  if (path != "/" ) {
    // context.log(request.headers, request.headers.get("user-agent"), request.headers.get("referer"), JSON.stringify(context.geo));
    let metadataBots = [ "Twitterbot", "curl", "facebookexternalhit", "Slackbot-LinkExpanding", "Discordbot", "snapchat"]
    let isMetadataBot = metadataBots.some(bot => ua.indexOf(bot) != -1);

    if (isMetadataBot && path.endsWith("/")) {
      let components = path.substring(1).split("/");
      let info = {}
      info.title = decodeURIComponent(components.shift()).replace(/-/g, " ").replace(/–/g, "-");
      
      let i;
      for (i = 0; i < components.length; i+=2) {
        let key = components[i];
        let value = decodeURIComponent(components[i+1]);
        if (key.length && value.length) info[key] = value;
      }
      info.d = info.d?.replace(/-/g, " ").replace(/–/g, "-");

      let content = ['<meta charset="UTF-8">'];
      if (info.title) { content.push(`<title>${info.title}</title>`,`<meta property="og:title" content="${info.title}"/>`); }
      if (info.s) { content.push(`<meta property="og:site_name" content="${info.s}"/>`); }
      if (info.t) { content.push(`<meta property="og:type" content="${info.t}"/>`); }
      if (info.d) { content.push(`<meta property="og:description" content="${info.d}"/>`,`<meta name="description" content="${info.d}"/>`); }
      if (info.i) { 
        if (!info.i.startsWith("http")) info.i = atob(info.i);
        content.push(`<meta property="og:image" content="${info.i}"/>`); 
        if (info.iw) content.push(`<meta property="og:image:width" content="${info.iw}"/>`); 
        if (info.ih) content.push(`<meta property="og:image:width" content="${info.ih}"/>`); 
      } 
      if (info.v) { 
        if (!info.v.startsWith("http")) info.v = atob(info.v);
        content.push(`<meta property="og:video" content="${info.v}"/>`); 
        if (info.vw) content.push(`<meta property="og:image:width" content="${info.vw}"/>`); 
        if (info.vh) content.push(`<meta property="og:image:width" content="${info.vh}"/>`); 
      } 
      if (info.f) {
        if (info.f.length > 9){
          if (!info.f.startsWith("http")) info.f = atob(info.f);
          content.push(`<link rel="icon" type="image/png" href="${info.f}">`);
        } else {
          let codepoints = Array.from(info.f).map(c => c.codePointAt(0).toString(16));
          content.push(`<link rel="icon" type="image/png" href="https://fonts.gstatic.com/s/e/notoemoji/14.0/${codepoints.join("_")}/128.png">`);
        }
      }
      
      context.log("Providing Metadata",ua,  info, content); 

      return new Response(content.join("\n"), {
        headers: { "content-type": "text/html" },
      });
    } 
  } else {
  console.log("Request", path, 
    context.geo.city + ", " + context.geo.subdivision.code,
    request.headers.get("referer"), 
    ua);
  }
}
