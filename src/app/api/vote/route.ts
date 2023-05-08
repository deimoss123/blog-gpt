import { VoteType } from "@/typings";
import db from "@/utils/db";
import getCurrentUser from "@/utils/getCurrentUser";

function addVoteArr(arr: string[], id: string) {
  if (arr.includes(id)) {
    return arr;
  }
  return [...arr, id];
}

function removeVoteArr(arr: string[], id: string) {
  return arr.filter(i => i !== id)
}

type BodyType = {
  id?: string,
  type?: 'post' | 'comment',
  voteType?: VoteType,
  // if true then the vote will be removed
  // if false or undefined then the vote will be added instead
  remove?: true
} 

export async function PATCH(req: Request) {
  const { session, currentUser } = await getCurrentUser()

  if (!session || !currentUser) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const body = await req.json() as BodyType;
  const { id } = body;
  if (!body || !id) {
    return new Response('Invalid id', { status: 400 });
  }
  
  const { type, voteType } = body;
  if (!voteType || !['likes', 'dislikes'].includes(voteType)) {
    return new Response('Invalid voteType, should be "likes" or "dislikes"', { status: 400 })
  }
  
  if (!type || !['post', 'comment'].includes(type)) {
    return new Response('Invalid type, should be "post" or "comment"', { status: 400 })
  }
  
  // @ts-ignore
  const model = await db[type].findUnique({ where: { id } });

  if (!model) {
    return new Response(`${type} not found`, { status: 404 });
  }
  const newVoteArr = body?.remove ? removeVoteArr(model[voteType], currentUser.id) : addVoteArr(model[voteType], currentUser.id);

  // @ts-ignore
  await db[type].update({
    where: { id },
    data: {
      [voteType]: newVoteArr,
    },
  });

  return new Response('Success', { status: 200 });
}