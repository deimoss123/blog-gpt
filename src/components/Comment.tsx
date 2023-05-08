'use client';

import {
  ChatBubbleLeftIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import UserIcon from './UserIcon';
import { useState, useTransition } from 'react';
import AddNewComment from './AddNewComment';
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModal';
import { LikedStateType, SafeUser, VoteType } from '@/typings';
import axios from 'axios';
import { Comment as CommentType, User } from '@prisma/client';

type Props = {
  children?: React.ReactNode;
  id: string;
  author: User;
  currentUser: SafeUser | null;
  data: CommentType;
  topLevel?: boolean;
};

export default function Comment({ children, id, author, currentUser, data, topLevel }: Props) {
  const defaultLikedState = currentUser ? data.likes.includes(currentUser.id) ? 'liked' : data.dislikes.includes(currentUser.id) ? 'disliked' : null : null;

  const [likedState, setLikedState] = useState<LikedStateType>(defaultLikedState);
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const [replyOpened, setReplyOpened] = useState(false);

  const likes = data.likes.length;
  const dislikes = data.dislikes.length;

  const removeVote = async (type: VoteType) => {
    await axios.patch('/api/vote', { id: data.id, type: 'comment', voteType: type, remove: true })
  };

  const addVote = async (type: VoteType) => {
    await axios.patch('/api/vote', { id: data.id, type: 'comment', voteType: type })
  };

  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

  const isMutating = isFetching || isPending;

  const vote = async (type: VoteType, action: 'add' | 'remove' | 'change') => {
    setIsFetching(true);
    switch (action) {
      case 'add': {
        await addVote(type);
        break;
      }
      case 'remove': {
        await removeVote(type);
        break;
      }
      case 'change': {
        await Promise.all([
          addVote(type),
          removeVote(type === 'likes' ? 'dislikes' : 'likes'),
        ]);
      }
    }
    setIsFetching(false);

    startTransition(() => {
      router.refresh();
    });
  };

  const onReplyClick = () => {
    if (!currentUser) {
      setModalOpen(true);
      return;
    }
    setReplyOpened(true);
  };

  // this isn't great to be honest
  const onLike = () => {
    if (isMutating) return;
    if (!currentUser) {
      setModalOpen(true);
      return;
    }
    if (likedState === 'liked') {
      vote('likes', 'remove');
      setLikedState(null);
    } else {
      vote('likes', likedState === 'disliked' ? 'change' : 'add');
      setLikedState('liked');
    }
  };

  const onDislike = () => {
    if (isMutating) return;
    if (!currentUser) {
      setModalOpen(true);
      return;
    }
    if (likedState === 'disliked') {
      vote('dislikes', 'remove');
      setLikedState(null);
    } else {
      vote('dislikes', likedState === 'liked' ? 'change' : 'add');
      setLikedState('disliked');
    }
  };

  return (
    <>
      <div className={'block' + (topLevel ? '' : ' ml-6 md:ml-8')}>
        <div className="my-4 flex">
          <UserIcon className="mr-1 mt-2" />
          <div className="flex flex-1 flex-col">
            <div className="flex-1 rounded-md border border-accentLight p-4 dark:border-accentDark">
              <div>
                <p className="font-semibold">{author.username}</p>
              </div>
              <p className="mt-4">{data.content}</p>
            </div>
            <div className="mt-4 flex gap-6">
              <button
                className="flex items-center gap-2 transition-colors"
                onClick={onLike}
              >
                <HandThumbUpIcon
                  className={
                    'h-6 w-6' +
                    (likedState === 'liked' ? ' fill-black' : '') +
                    (isMutating ? ' opacity-30' : '')
                  }
                />
                {likes}
              </button>
              <button
                className="flex items-center gap-2 transition-colors"
                onClick={onDislike}
              >
                <HandThumbDownIcon
                  className={
                    'h-6 w-6' +
                    (likedState === 'disliked' ? ' fill-black' : '') +
                    (isMutating ? ' opacity-30' : '')
                  }
                />
                {dislikes}
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
                currentUser={currentUser}
                postId={data.postId}
                replyOptions={{ id, onClose: () => setReplyOpened(false) }}
              />
            )}
          </div>
        </div>
        {children}
      </div>
      <LoginModal isOpen={isModalOpen} setIsOpen={setModalOpen} titleText="Login to continue"/>
    </>
  );
}
