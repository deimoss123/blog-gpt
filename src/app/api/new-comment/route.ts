import db from "@/utils/db";
import getCurrentUser from "@/utils/getCurrentUser";

type BodyType = {
  postId?: string,
  content?: string,
  replyToId?: string,
}

export async function POST(req: Request) {
  const { session, currentUser } = await getCurrentUser()

  if (!session || !currentUser) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const body = await req.json() as BodyType;
  
  if (!body) {
    return new Response('Invalid request body', { status: 400 });
  }
  
  const { postId, content } = body 
  if (!content || !content.length) {
    return new Response('Invalid comment content', { status: 400 });
  }
  
  if (!postId) {
    return new Response('Invalid postId', { status: 400 });
  }

  const post = db.post.findFirst({ where: { id: postId }, select: { id: true }})
  if (!post) {
    return new Response('Post not found', { status: 400 });
  }
  
  await db.comment.create({ data: { authorId: currentUser.id, postId, content, replyToId: body.replyToId || undefined }})
  return new Response('Successfully created a new comment!', { status: 200 })
}