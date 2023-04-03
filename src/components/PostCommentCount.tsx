import { db } from '@/firebase';
import asyncComponent from '@/utils/asyncComponent';
import {
  collection,
  getCountFromServer,
  query,
  where,
} from 'firebase/firestore';

type Props = {
  postId: string;
};

const PostCommentCount = asyncComponent(async ({ postId }: Props) => {
  const count = await getCountFromServer(
    query(collection(db, 'comments'), where('postId', '==', postId))
  );
  return <p>{count.data().count} comments</p>;
});

export default PostCommentCount;
