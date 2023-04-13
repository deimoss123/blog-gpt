'use client';

import {
  BookmarkIcon,
  ChatBubbleLeftIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';

type Props = {
  likes: number;
  dislikes: number;
  comments: number;
};

export default function PostSidebar({ likes, dislikes, comments }: Props) {
  const scrollToComments = () => {
    const el = document.getElementById('comments');
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 32;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <aside className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-accentLight bg-white py-4 dark:border-accentDark dark:bg-gray-900 md:sticky md:inset-auto md:top-24 md:flex-col md:gap-6 md:rounded-md md:border md:px-4">
      <button className="flex items-center gap-2 md:flex-col">
        <HandThumbUpIcon className="h-7 w-7" />
        {likes}
      </button>
      <button className="flex items-center gap-2 md:flex-col">
        <HandThumbDownIcon className="h-7 w-7" />
        {dislikes}
      </button>
      <button
        className="flex items-center gap-2 md:flex-col"
        onClick={scrollToComments}
      >
        <ChatBubbleLeftIcon className="h-7 w-7" />
        {comments}
      </button>
      <button>
        <BookmarkIcon className="h-7 w-7" />
      </button>
    </aside>
  );
}
