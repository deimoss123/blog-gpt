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

  const prompt =
    "Generate a markdown blog post about the benefits of using the Rust programming language over TypeScript. Also include code snippets of example code";

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

  // const content =
  //   "# A demo of `react-markdown`\n\n`react-markdown` is a markdown component for React.\n\n👉 Changes are re-rendered as you type.\n\n👈 Try writing some markdown on the left.\n\n## Overview\n\n* Follows [CommonMark](https://commonmark.org)\n* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)\n* Renders actual React elements instead of using `dangerouslySetInnerHTML`\n* Lets you define your own components (to render `MyHeading` instead of `h1`)\n* Has a lot of plugins\n\n## Table of contents\n\nHere is an example of a plugin in action\n([`remark-toc`](https://github.com/remarkjs/remark-toc)).\nThis section is replaced by an actual table of contents.\n\n## Syntax highlighting\n\nHere is an example of a plugin to highlight code:\n[`rehype-highlight`](https://github.com/rehypejs/rehype-highlight).\n\n```js\nimport React from 'react'\nimport ReactDOM from 'react-dom'\nimport ReactMarkdown from 'react-markdown'\nimport rehypeHighlight from 'rehype-highlight'\n\nReactDOM.render(\n  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{'# Your markdown here'}</ReactMarkdown>,\n  document.querySelector('#content')\n)\n```\n\nPretty neat, eh?\n\n## GitHub flavored markdown (GFM)\n\nFor GFM, you can *also* use a plugin:\n[`remark-gfm`](https://github.com/remarkjs/react-markdown#use).\nIt adds support for GitHub-specific extensions to the language:\ntables, strikethrough, tasklists, and literal URLs.\n\nThese features **do not work by default**.\n👆 Use the toggle above to add the plugin.\n\n| Feature    | Support              |\n| ---------: | :------------------- |\n| CommonMark | 100%                 |\n| GFM        | 100% w/ `remark-gfm` |\n\n~~strikethrough~~\n\n* [ ] task list\n* [x] checked item\n\nhttps://example.com\n\n## HTML in markdown\n\n⚠️ HTML in markdown is quite unsafe, but if you want to support it, you can\nuse [`rehype-raw`](https://github.com/rehypejs/rehype-raw).\nYou should probably combine it with\n[`rehype-sanitize`](https://github.com/rehypejs/rehype-sanitize).\n\n<blockquote>\n  👆 Use the toggle above to add the plugin.\n</blockquote>\n\n## Components\n\nYou can pass components to change things:\n\n```js\nimport React from 'react'\nimport ReactDOM from 'react-dom'\nimport ReactMarkdown from 'react-markdown'\nimport MyFancyRule from './components/my-fancy-rule.js'\n\nReactDOM.render(\n  <ReactMarkdown\n    components={{\n      // Use h2s instead of h1s\n      h1: 'h2',\n      // Use a component instead of hrs\n      hr: ({node, ...props}) => <MyFancyRule {...props} />\n    }}\n  >\n    # Your markdown here\n  </ReactMarkdown>,\n  document.querySelector('#content')\n)\n```\n\n## More info?\n\nMuch more info is available in the\n[readme on GitHub](https://github.com/remarkjs/react-markdown)!\n\n***\n\nA component by [Espen Hovlandsdal](https://espen.codes/)";

  // const content =
  //   "# Responsive Design: An Introduction to Making Your Website Accessible on Any Device\n\nThe way in which we access the internet has changed dramatically over the last few years. Where once we were limited to desktop computers, we now use a range of devices such as smartphones, tablets, and laptops. This has led to the rise of responsive design, which allows web designers to create websites that can adapt to different screen sizes and resolutions.\n\n## What is responsive design?\n\nResponsive design is an approach to web design that focuses on creating websites that can adapt to different devices and screen sizes. This means that the same website can be accessed on a desktop computer, a tablet, or a smartphone, without any loss of functionality or user experience.\n\n## Why is responsive design important?\n\nWith more users accessing the internet from their mobile devices than ever before, it's essential to ensure that your website is accessible on different screen sizes. A responsive design ensures that your website looks great and functions smoothly, no matter what device it's viewed on.\n\n## How does responsive design work?\n\nThere are several techniques that web designers use to create a responsive design. These include:\n\n- Flexible layouts: Designing the website so that it can adapt to different screen sizes without breaking the layout or design.\n- Media queries: Using CSS to detect the size and resolution of a device's screen and adjust the website's design accordingly.\n- Fluid images: Ensuring that images on the website can adapt to different screen sizes without appearing pixelated or too small.\n\n## Conclusion\n\nResponsive design is quickly becoming a necessity for website owners who want to ensure that their websites are accessible on any device. By using flexible layouts, media queries, and fluid images, web designers can create websites that look great and function smoothly, no matter what device they're viewed on.";

  if (!content) {
    // console.log(res.data);
    return new Response("Error generating a post", {
      status: 400,
    });
  }

  const post: BlogPost = {
    author: "bot",
    content,
    title: "rust",
    createdAt: admin.firestore.Timestamp.now(),
  };

  await adminDb.collection("posts").add(post);

  return NextResponse.json({ message: "New post yay" });
}
