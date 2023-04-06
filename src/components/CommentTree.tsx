import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import Comment from './Comment';
import { getUser } from '@/utils/getUser';
import asyncComponent from '@/utils/asyncComponent';
import { getServerSession } from 'next-auth';

// this can could be done better
async function displayComments(
  comments: QueryDocumentSnapshot<DocumentData>[],
  parentId?: string
): Promise<React.ReactNode[]> {
  const children = comments.filter((comment) => {
    const { replyToId } = comment.data() as PostComment;
    return parentId ? replyToId === parentId : !replyToId;
  });

  const arr: React.ReactNode[] = [];

  for (const child of children) {
    const user = await getUser(child.data().authorId);
    arr.push(
      <Comment
        id={child.id}
        data={JSON.parse(JSON.stringify(child.data())) as PostComment}
        user={user}
        topLevel={!parentId}
        key={child.id}
      >
        {await displayComments(comments, child.id)}
      </Comment>
    );
  }

  return arr;
}

type Props = { comments: QueryDocumentSnapshot<DocumentData>[] };

const CommentTree = asyncComponent(async ({ comments }: Props) => {
  const res = await displayComments(comments);
  return <div>{res}</div>;
});

export default CommentTree;
