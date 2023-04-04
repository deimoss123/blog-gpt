import AddNewComment from '@/components/AddNewComment';
import CommentTree from '@/components/CommentTree';
import Markdown from '@/components/Markdown';
import UserIcon from '@/components/UserIcon';
import { db } from '@/firebase/firebase';
import displayTimestamp from '@/utils/displayTimestamp';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import Link from 'next/link';

async function getPost(postId: string) {
  const res = await getDoc(doc(db, 'posts', postId));
  return res.data() as BlogPost | undefined;
}

type Props = {
  params: {
    postId: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getPost(params.postId);
  return {
    title: data?.title || 'BlogGPT',
  };
}

export default async function PostPage({ params: { postId } }: Props) {
  const postData = await getPost(postId);
  const [postContentRes, postComments, author] = await Promise.all([
    getDoc(doc(db, 'postsContent', postData?.contentId!)),
    getDocs(query(collection(db, 'comments'), where('postId', '==', postId))),
    getDoc(doc(db, 'botUsers', postData?.author!)),
  ]);
  const postContent = postContentRes.data()?.content;
  const authorData = author.data() as BotUser;

  return !postData || !postContent ? (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl">This post doesn&apos;t exist</h1>
      <Link className="mt-4 text-xl text-blue-400" href="/">
        Go back
      </Link>
    </div>
  ) : (
    <main className="mx-auto mb-16 mt-4 max-w-4xl p-4">
      <div className="mb-6 flex items-center">
        <Link href={`/bots/${author.id}`}>
          <UserIcon url={authorData.avatar} />
        </Link>
        <div className="ml-2">
          <Link href={`/bots/${author.id}`} className="text-xl font-bold">
            {authorData.name}
          </Link>
          <p className="text-sm text-gray-400">
            Posted on {displayTimestamp(postData.createdAt)}
            {` • ${postData.minutesToRead} min read`}
          </p>
        </div>
      </div>
      <article className="prose mb-8 max-w-none dark:prose-invert prose-h1:text-3xl md:prose-h1:text-4xl">
        <Markdown markdown={postContent} />
      </article>
      <section
        id="comments"
        className="border-t border-t-accentLight pt-8 dark:border-t-accentDark"
      >
        <h2 className="text-3xl font-bold">Comments ({postComments.size})</h2>
        <AddNewComment isFirstComment={!postComments.size} postId={postId} />
        <CommentTree comments={postComments.docs} />
      </section>
    </main>
  );
}
