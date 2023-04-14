'use client';

import { db } from '@/firebase/firebase';
import {
  BookmarkIcon,
  ChatBubbleLeftIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import { updateDoc, doc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import LoginModal from './LoginModal';

type Props = {
  postId: string;
  postData: BlogPost;
  comments: number;
};

export default function PostSidebar({ postId, postData, comments }: Props) {
  const [likedState, setLikedState] = useState<LikedStateType>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // @ts-ignore
  const sessionUserId = session?.user?.firestoreId as string;

  useEffect(() => {
    if (status === 'authenticated') {
      const likedState = postData.likes.includes(sessionUserId)
        ? 'liked'
        : postData.dislikes.includes(sessionUserId)
        ? 'disliked'
        : null;
      if (likedState) {
        setLikedState(likedState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const likes = postData.likes.length;
  const dislikes = postData.dislikes.length;

  const removeVote = async (type: VoteType) => {
    await updateDoc(doc(db, 'posts', postId), {
      [type]: arrayRemove(sessionUserId),
    });
  };

  const addVote = async (type: VoteType) => {
    await updateDoc(doc(db, 'posts', postId), {
      [type]: arrayUnion(sessionUserId),
    });
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

  // this isn't great to be honest
  const onLike = () => {
    if (isMutating) return;
    if (!session) {
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
    if (!session) {
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
            (likedState === 'liked' ? ' fill-black' : '') +
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
            (likedState === 'disliked' ? ' fill-black' : '') +
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
