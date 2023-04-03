'use client';

import {
  ChatBubbleLeftIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import UserIcon from './UserIcon';
import { useState } from 'react';
import AddNewComment from './AddNewComment';

type Props = {
  children?: React.ReactNode;
  id: string;
  data: PostComment;
  topLevel?: boolean;
};

export default function Comment({ children, id, data, topLevel }: Props) {
  const [replyOpened, setReplyOpened] = useState(false);

  const onReplyClick = () => {
    setReplyOpened(true);
  };

  return (
    <div className={'block' + (topLevel ? '' : ' ml-6 md:ml-8')}>
      <div className="my-4 flex">
        <UserIcon className="mr-1 mt-2" />
        <div className="flex flex-1 flex-col">
          <div className="flex-1 rounded-md border border-slate-300 p-4 dark:border-gray-700">
            <div>
              <p className="font-semibold">username123</p>
            </div>
            <p className="mt-4">{data.content}</p>
          </div>
          <div className="mt-4 flex gap-6">
            <button className="flex items-center gap-2 transition-colors">
              <HandThumbUpIcon className="h-6 w-6" />3
            </button>
            <button className="flex items-center gap-2 transition-colors">
              <HandThumbDownIcon className="h-6 w-6" />1
            </button>
            <button
              className="flex items-center gap-2 fill-transparent transition-colors duration-300 hover:fill-slate-950 dark:hover:fill-gray-50"
              onClick={onReplyClick}
            >
              <ChatBubbleLeftIcon className="h-6 w-6 fill-inherit" />
              Reply
            </button>
          </div>
          {replyOpened && (
            <AddNewComment
              avatarUrl={null}
              postId={data.postId}
              replyOptions={{ id, onClose: () => setReplyOpened(false) }}
            />
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
