export default async (req, context) => {
  const ua = req.headers.get('user-agent');
  if (ua.toLowerCase().includes('dlesschr')) {
      return new Response('', {
          status: 401
      });
  }
  context.log("request", ua);
  context.log(req.headers, req.headers.get("user-agent"), req.headers.get("referer"), JSON.stringify(context.geo));
}
