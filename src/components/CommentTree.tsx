import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import Comment from './Comment';

// this can could be done better
function displayComments(
  comments: QueryDocumentSnapshot<DocumentData>[],
  parentId?: string
): React.ReactNode[] {
  const children = comments.filter((comment) => {
    const { replyToId } = comment.data() as PostComment;
    return parentId ? replyToId === parentId : !replyToId;
  });

  const arr: React.ReactNode[] = [];

  for (const child of children) {
    arr.push(
      <Comment
        id={child.id}
        data={JSON.parse(JSON.stringify(child.data())) as PostComment}
        topLevel={!parentId}
        key={child.id}
      >
        {displayComments(comments, child.id)}
      </Comment>
    );
  }

  return arr;
}

type Props = {
  comments: QueryDocumentSnapshot<DocumentData>[];
};

export default function CommentTree({ comments }: Props) {
  const res = displayComments(comments);
  return <div>{res}</div>;
}
