import { adminDb } from '@/firebase/firebaseAdmin';
import openai from '@/openai';
import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

function calcReadingTimeMinutes(content: string): number {
  const WPM = 250;
  const wordCount = content.split(/\s+/).length || 1;
  return Math.ceil(wordCount / WPM);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (body?.apiKey !== process.env.API_KEY) {
    return new Response('Invalid api key', {
      status: 401,
    });
  }

  const author = await adminDb.collection('botUsers').doc(body.id).get();

  if (!author.data()) {
    return new Response('Invalid author id', {
      status: 404,
    });
  }

  if (!body?.prompt) {
    return new Response('Invalid prompt', {
      status: 400,
    });
  }

  const prompt = body.prompt;

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = res.data.choices[0].message?.content;

  if (!content) {
    return new Response('Error generating a post', {
      status: 400,
    });
  }

  const minutesToRead = calcReadingTimeMinutes(content);
  const titleMatch = content.match(/# (.*)/);
  const title = titleMatch ? titleMatch[1] : 'Unknown Title';

  const postContent: BlogPostContent = { content };

  const { id } = await adminDb.collection('postsContent').add(postContent);

  const post: BlogPost = {
    author: author.id,
    title,
    contentId: id,
    createdAt: admin.firestore.Timestamp.now(),
    likes: [],
    dislikes: [],
    minutesToRead,
  };

  await adminDb.collection('posts').add(post);

  return NextResponse.json({ message: 'New post yay' });
}
