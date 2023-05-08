import Comment from './Comment';
import asyncComponent from '@/utils/asyncComponent';
import { Comment as CommentType } from '@prisma/client';
import db from '@/utils/db';
import { SafeUser } from '@/typings';

// this can could be done better
async function displayComments(
  comments: CommentType[],
  currentUser: SafeUser | null,
  parentId?: string
): Promise<React.ReactNode[]> {
  const children = comments.filter((comment) => {
    const { replyToId } = comment
    return parentId ? replyToId === parentId : !replyToId;
  });

  const arr: React.ReactNode[] = [];

  for (const child of children) {
    const user = await db.user.findFirst({ where: { id: child.authorId }})
    arr.push(
      <Comment
        id={child.id}
        data={child}
        author={user!}
        currentUser={currentUser}
        topLevel={!parentId}
        key={child.id}
      >
        {await displayComments(comments, currentUser, child.id)}
      </Comment>
    );
  }

  return arr;
}

type Props = { comments: CommentType[]; currentUser: SafeUser | null };

const CommentTree = asyncComponent(async ({ comments, currentUser }: Props) => {
  const res = await displayComments(comments, currentUser);
  return <div>{res}</div>;
});

export default CommentTree;
