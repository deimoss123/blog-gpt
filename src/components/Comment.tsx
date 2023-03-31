"use client";

import {
  ChatBubbleLeftIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import UserIcon from "./UserIcon";
import { useState } from "react";
import AddNewComment from "./AddNewComment";

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
    <div className={"block" + (topLevel ? "" : " ml-6 md:ml-8")}>
      <div className="flex my-4">
        <UserIcon className="mr-1 mt-2" />
        <div className="flex flex-col flex-1">
          <div className="p-4 border border-slate-300 dark:border-gray-700 rounded-md flex-1">
            <div>
              <p className="font-semibold">username123</p>
            </div>
            <p className="mt-4">{data.content}</p>
          </div>
          <div className="flex gap-6 mt-4">
            <button className="flex items-center gap-2 transition-colors">
              <HandThumbUpIcon className="w-6 h-6" />3
            </button>
            <button className="flex items-center gap-2 transition-colors">
              <HandThumbDownIcon className="w-6 h-6" />1
            </button>
            <button
              className="flex items-center gap-2 transition-colors duration-300 fill-transparent hover:fill-slate-950 dark:hover:fill-gray-50"
              onClick={onReplyClick}
            >
              <ChatBubbleLeftIcon className="w-6 h-6 fill-inherit" />
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
