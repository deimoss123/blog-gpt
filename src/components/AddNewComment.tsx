'use client';

import { useState } from 'react';
import UserIcon from './UserIcon';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { db } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

type Props = {
  postId: string;
  replyOptions?: {
    id: string;
    onClose: () => void;
  };
  isFirstComment?: boolean;
  avatarUrl?: string | null; // null = hide avatar
};

export default function AddNewComment({
  postId,
  replyOptions,
  isFirstComment,
  avatarUrl,
}: Props) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // TODO: make a cleaner textarea: https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/

  const canSubmit = !!input.length;

  const onSubmit = async () => {
    if (!session || !canSubmit) return;
    const comment: PostComment = {
      // @ts-ignore
      authorId: session.user?.firestoreId,
      content: input,
      likes: [],
      dislikes: [],
      createdAt: serverTimestamp(),
      postId,
    };

    if (replyOptions) {
      comment.replyToId = replyOptions.id;
    }

    setInput('');
    setIsLoading(true);
    await addDoc(collection(db, 'comments'), comment);
    router.refresh();
    if (replyOptions) replyOptions.onClose();
    setIsLoading(false);
  };

  return (
    <div className="mt-4 flex">
      {avatarUrl !== null && <UserIcon className="mr-2" url={avatarUrl} />}
      <div className="flex-1">
        <textarea
          className="max-h-60 min-h-[4rem] w-full rounded-lg border border-accentLight bg-transparent p-2 dark:border-accentDark"
          placeholder={
            isFirstComment
              ? 'Be the first to comment!'
              : replyOptions
              ? 'Reply...'
              : 'Comment on this post'
          }
          name=""
          id=""
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
        />
        <div className="mt-2 flex gap-2">
          <button
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-white transition-opacity disabled:cursor-not-allowed disabled:text-gray-200 disabled:opacity-50"
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            {isLoading && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
            Submit
          </button>
          {replyOptions && (
            <button className="px-4 py-2" onClick={replyOptions.onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
