'use client';

import {
  BookmarkIcon,
  ChatBubbleLeftIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import LoginModal from './LoginModal';
import { Post } from '@prisma/client';
import { LikedStateType, SafeUser, VoteType } from '@/typings';
import axios from 'axios';

type Props = {
  postData: Post,
  currentUser: SafeUser | null;
  comments: number;
};

export default function PostSidebar({ postData, currentUser, comments }: Props) {
  const defaultLikedState = currentUser ? postData.likes.includes(currentUser.id) ? 'liked' : postData.dislikes.includes(currentUser.id) ? 'disliked' : null : null;
  const [likedState, setLikedState] = useState<LikedStateType>(defaultLikedState);
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const likes = postData.likes.length;
  const dislikes = postData.dislikes.length;
  
  const removeVote = async (type: VoteType) => {
    await axios.patch('/api/vote', { id: postData.id, type: 'post', voteType: type, remove: true })
  };

  const addVote = async (type: VoteType) => {
    await axios.patch('/api/vote', { id: postData.id, type: 'post', voteType: type })
  };

  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

  const isMutating = isFetching || isPending;

  const vote = async (type: VoteType, action: 'add' | 'remove' | 'change') => {
    setIsFetching(true);
    switch (action) {
      case 'add': {
        await addVote(type);
      } break;
      case 'remove': {
        await removeVote(type);
      } break;
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

  const scrollToComments = () => {
    const el = document.getElementById('comments');
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 32;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
    <aside className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-accentLight bg-white py-4 dark:border-accentDark dark:bg-gray-900 md:sticky md:inset-auto md:top-24 md:flex-col md:gap-6 md:rounded-md md:border md:px-4">
      <button className="flex items-center gap-2 md:flex-col" onClick={onLike}>
        <HandThumbUpIcon
          className={
            'h-7 w-7' +
            (likedState === 'liked' ? ' fill-black dark:fill-white' : '') +
            (isMutating ? ' opacity-30' : '')
          }
        />
        {likes}
      </button>
      <button
        className="flex items-center gap-2 md:flex-col"
        onClick={onDislike}
      >
        <HandThumbDownIcon
          className={
            'h-7 w-7' +
            (likedState === 'disliked' ? ' fill-black dark:fill-white' : '') +
            (isMutating ? ' opacity-30' : '')
          }
        />
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
    <LoginModal isOpen={isModalOpen} setIsOpen={setModalOpen} titleText="Login to continue"/>
    </>
  );
}
