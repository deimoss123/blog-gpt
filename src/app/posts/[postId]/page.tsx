import AddNewComment from '@/components/AddNewComment';
import CommentTree from '@/components/CommentTree';
import Markdown from '@/components/Markdown';
import PostSidebar from '@/components/PostSidebar';
import UserIcon from '@/components/UserIcon';
import db from '@/utils/db';
import displayTimestamp from '@/utils/displayTimestamp';
import getCurrentUser from '@/utils/getCurrentUser';
import { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';

const getPost = cache(async (postId: string) => {
  const res = await db.post.findUnique({
    where: {
      id: postId
    },
    include: {
      author: true,
      comments: true,
    }
  })
  
  if (!res) return null;

  return {
    ...res,
    createdAt: res.createdAt.toISOString(),
    updatedAt: res.updatedAt.toISOString(),
  }; 
});

type Props = {
  params: {
    postId: string;
  };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | void> {
  const data = await getPost(params.postId);
  if (data) {
    return {
      title: data?.title,
      description: `A post by ${data.author.name}`,
    };
  }
}

export default async function PostPage({ params: { postId } }: Props) {
  const { currentUser, session } = await getCurrentUser()
  const data = await getPost(postId);

  if (!data) {
    return (
      <div className="flex flex-col items-center p-8">
        <h1 className="text-2xl">This post doesn&apos;t exist</h1>
        <Link className="mt-4 text-xl text-blue-400" href="/">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="justify-center px-4 md:flex md:gap-8 md:px-8">
      <div className="sticky z-10">
        <PostSidebar
          // @ts-ignore
          postData={data}
          currentUser={currentUser}
          comments={data.comments.length}
        />
      </div>
      <main className="mb-16 mt-4 max-w-4xl py-4">
        <div className="mb-6 flex items-center">
          <Link href={`/bots/${data.author.id}`}>
            <UserIcon url={data.author.avatar} />
          </Link>
          <div className="ml-2">
            <Link href={`/bots/${data.author.id}`} className="text-xl font-bold">
              {data.author.name}
            </Link>
            <p className="text-sm text-gray-400">
              Posted on {displayTimestamp(data.createdAt)}
              {` • ${data.minutesToRead} min read`}
            </p>
          </div>
        </div>
        <article className="prose mb-8 max-w-none dark:prose-invert prose-h1:text-3xl md:prose-h1:text-4xl">
          <Markdown markdown={data.content} />
        </article>
        <section
          id="comments"
          className="border-t border-t-accentLight pt-8 dark:border-t-accentDark"
        >
          <h2 className="text-3xl font-bold">Comments ({data.comments.length})</h2>
          <AddNewComment isFirstComment={!data.comments.length} postId={postId} currentUser={currentUser} />
          <CommentTree comments={data.comments} currentUser={currentUser} />
        </section>
      </main>
    </div>
  );
}
