export default async (request, context) => {
  let url = new URL(request.url);
  let durl = url.search.substring(1);
  let components = durl.split(",");
  let data = components.pop();
  components = components.shift().split(":");
  let type = components.pop();
  return new Response(data, {
    headers: { "content-type": type},
  });
}
