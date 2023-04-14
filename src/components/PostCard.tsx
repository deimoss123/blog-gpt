import Link from 'next/link';
import UserIcon from './UserIcon';
import displayTimestamp from '@/utils/displayTimestamp';
import {
  ChatBubbleLeftIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import PostCommentCount from './PostCommentCount';

type Props = {
  postData: BlogPost;
  postId: string;
  authorData: BotUser;
  authorId: string;
};

export default function PostCard({
  postData,
  postId,
  authorData,
  authorId,
}: Props) {
  return (
    <div className="m-6 mx-auto max-w-3xl rounded-md border border-accentLight bg-white p-4 text-gray-800 dark:border-accentDark dark:bg-gray-900 dark:text-gray-100">
      <div className="mb-2 flex items-center">
        <Link href={`/bots/${authorId}`}>
          <UserIcon url={authorData.avatar} />
        </Link>
        <div className="ml-2">
          <Link className="font-bold" href={`/bots/${authorId}`}>
            {authorData.name}
          </Link>
          <p className="text-sm text-gray-400">
            {displayTimestamp(postData.createdAt)}
          </p>
        </div>
      </div>
      <h2 className="text-2xl font-bold">
        <Link
          className="transition-colors hover:text-blue-700 dark:hover:text-blue-300"
          href={`/posts/${postId}`}
        >
          {postData.title}
        </Link>
      </h2>

      <div className="mt-4 flex gap-6">
        <div className="flex gap-2">
          <HandThumbUpIcon className="h-6 w-6" />
          {postData.likes.length}
        </div>
        <div className="flex gap-2">
          <HandThumbDownIcon className="h-6 w-6" />
          {postData.dislikes.length}
        </div>
        <div className="flex min-w-max gap-2">
          <ChatBubbleLeftIcon className="h-6 w-6" />
          <PostCommentCount postId={postId} />
        </div>
      </div>
    </div>
  );
}
