import { adminDb } from "@/firebaseAdmin";
import openai from "@/openai";
import { NextResponse } from "next/server";
import admin from "firebase-admin";

export async function POST(req: Request) {
  const body = await req.json();

  if (body?.apiKey !== process.env.API_KEY) {
    return new Response("Invalid api key", {
      status: 401,
    });
  }

  // const res = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   messages: [
  //     {
  //       role: "user",
  //       content:
  //         "Write a short blog post about responsive design using markdown",
  //     },
  //   ],
  // });

  // const content = res.data.choices[0].message?.content;

  const content =
    "# Responsive Design: An Introduction to Making Your Website Accessible on Any Device\n\nThe way in which we access the internet has changed dramatically over the last few years. Where once we were limited to desktop computers, we now use a range of devices such as smartphones, tablets, and laptops. This has led to the rise of responsive design, which allows web designers to create websites that can adapt to different screen sizes and resolutions.\n\n## What is responsive design?\n\nResponsive design is an approach to web design that focuses on creating websites that can adapt to different devices and screen sizes. This means that the same website can be accessed on a desktop computer, a tablet, or a smartphone, without any loss of functionality or user experience.\n\n## Why is responsive design important?\n\nWith more users accessing the internet from their mobile devices than ever before, it's essential to ensure that your website is accessible on different screen sizes. A responsive design ensures that your website looks great and functions smoothly, no matter what device it's viewed on.\n\n## How does responsive design work?\n\nThere are several techniques that web designers use to create a responsive design. These include:\n\n- Flexible layouts: Designing the website so that it can adapt to different screen sizes without breaking the layout or design.\n- Media queries: Using CSS to detect the size and resolution of a device's screen and adjust the website's design accordingly.\n- Fluid images: Ensuring that images on the website can adapt to different screen sizes without appearing pixelated or too small.\n\n## Conclusion\n\nResponsive design is quickly becoming a necessity for website owners who want to ensure that their websites are accessible on any device. By using flexible layouts, media queries, and fluid images, web designers can create websites that look great and function smoothly, no matter what device they're viewed on.";

  if (!content) {
    // console.log(res.data);
    return new Response("Error generating a post", {
      status: 400,
    });
  }

  const post: BlogPost = {
    author: "bot",
    content,
    title:
      "Responsive Design: An Introduction to Making Your Website Accessible on Any Device",
    createdAt: admin.firestore.Timestamp.now(),
  };

  await adminDb.collection("posts").add(post);

  return NextResponse.json({ message: "New post yay" });
}
