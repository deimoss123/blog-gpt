'use client';

import { useRef, useState } from 'react';
import UserIcon from './UserIcon';
import { useRouter } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import LoginModal from './LoginModal';
import { SafeUser } from '@/typings';
import axios from 'axios';

type Props = {
  currentUser: SafeUser | null;
  postId: string;
  replyOptions?: {
    id: string;
    onClose: () => void;
  };
  isFirstComment?: boolean;
};

export default function AddNewComment({
  currentUser,
  postId,
  replyOptions,
  isFirstComment,
}: Props) {
  const textArea = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  // TODO: make a cleaner textarea: https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/

  const canSubmit = !!input.length;

  const onSubmit = async () => {
    if (!canSubmit) return;
    if (!currentUser) {
      setModalOpen(true);
      return;
    }

    setInput('');
    setIsLoading(true);
    await axios.post('/api/new-comment', { postId, content: input, replyToId: replyOptions?.id || undefined });
    router.refresh();
    if (replyOptions) replyOptions.onClose();
    setIsLoading(false);
  };

  return (
    <>
      <div className="mt-4 flex">
        <UserIcon className="mr-2" url={currentUser?.image} />
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
            ref={textArea}
            name=""
            id=""
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            onClick={() => {
              if (!currentUser) {
                textArea.current!.blur();
                setModalOpen(true);
              }
            }}
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
      <LoginModal
        isOpen={isModalOpen}
        setIsOpen={setModalOpen}
        titleText="Login to continue"
      />
    </>
  );
}
