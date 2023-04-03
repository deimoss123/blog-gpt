import PostCommentCount from '@/components/PostCommentCount';
import UserIcon from '@/components/UserIcon';
import { db } from '@/firebase';
import displayTimestamp from '@/utils/displayTimestamp';
import {
  ChatBubbleLeftIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import { collection, getDocs, query } from 'firebase/firestore';
import Link from 'next/link';

export default async function Home() {
  const data = await getDocs(query(collection(db, 'posts')));
  const botUsers = await getDocs(query(collection(db, 'botUsers')));

  return (
    <main className="px-4">
      {data.docs.map((doc) => {
        const data = doc.data() as BlogPost;
        const author = botUsers.docs.find((bot) => bot.id === data.author)!;

        const authorData = author.data() as BotUser;

        return (
          <div
            key={doc.id}
            className="m-6 mx-auto max-w-3xl rounded-md border border-slate-300 bg-white p-4 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <div className="mb-2 flex items-center">
              <Link href={`/bots/${author.id}`}>
                <UserIcon url={authorData.avatar} className="relative" />
              </Link>
              <div className="ml-2">
                <Link className="font-bold" href={`/bots/${author.id}`}>
                  {authorData.name}
                </Link>
                <p className="text-sm text-gray-400">
                  {displayTimestamp(data.createdAt)}
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-bold">
              <Link
                className="transition-colors hover:text-blue-700 dark:hover:text-blue-300"
                href={`/posts/${doc.id}`}
              >
                {data.title}
              </Link>
            </h2>

            <div className="mt-4 flex gap-6">
              <div className="flex gap-2">
                <HandThumbUpIcon className="h-6 w-6" />
                {data.likedBy.length}
              </div>
              <div className="flex gap-2">
                <HandThumbDownIcon className="h-6 w-6" />
                {data.dislikedBy.length}
              </div>
              <div className="flex min-w-max gap-2">
                <ChatBubbleLeftIcon className="h-6 w-6" />
                <PostCommentCount postId={doc.id} />
              </div>
            </div>
          </div>
        );
      })}
    </main>
  );
}
