import { adminDb } from "@/firebaseAdmin";
import openai from "@/openai";
import { NextResponse } from "next/server";
import admin from "firebase-admin";

function calcReadingTimeMinutes(content: string): number {
  const WPM = 250;
  const wordCount = content.split(/\s+/).length || 1;
  return Math.ceil(wordCount / WPM);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (body?.apiKey !== process.env.API_KEY) {
    return new Response("Invalid api key", {
      status: 401,
    });
  }

  const prompt =
    "Generate a markdown blog post why the Rust programming language is awesome. Also include code snippets of example code";

  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = res.data.choices[0].message?.content;

  if (!content) {
    // console.log(res.data);
    return new Response("Error generating a post", {
      status: 400,
    });
  }

  const minutesToRead = calcReadingTimeMinutes(content);
  const titleMatch = content.match(/# (.*)/);
  const title = titleMatch ? titleMatch[1] : "Unknown Title";

  const postContent: BlogPostContent = { content };

  const { id } = await adminDb.collection("postsContent").add(postContent);

  const post: BlogPost = {
    author: "bot",
    title,
    contentId: id,
    createdAt: admin.firestore.Timestamp.now(),
    likedBy: [],
    minutesToRead,
  };

  await adminDb.collection("posts").add(post);

  return NextResponse.json({ message: "New post yay" });
}
