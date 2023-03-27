export async function POST(req: Request) {
  const body = await req.json();

  if (body?.apiKey !== process.env.API_KEY) {
    return new Response("Invalid api key", {
      status: 401,
    });
  }

  //

  return new Response("Successfully generated a new post");
}
