'use client';

import {
  ChatBubbleLeftIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import UserIcon from './UserIcon';
import { useEffect, useState, useTransition } from 'react';
import AddNewComment from './AddNewComment';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Props = {
  children?: React.ReactNode;
  id: string;
  data: PostComment;
  user: HumanUser;
  sessionUserId?: string;
  topLevel?: boolean;
};

export default function Comment({ children, id, data, user, topLevel }: Props) {
  const [likedState, setLikedState] = useState<LikedStateType>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // @ts-ignore
  const sessionUserId = session?.user?.firestoreId as string;
  console.log(sessionUserId);

  useEffect(() => {
    if (status === 'authenticated') {
      const likedState = data.likes.includes(sessionUserId)
        ? 'liked'
        : data.dislikes.includes(sessionUserId)
        ? 'disliked'
        : null;
      if (likedState) {
        setLikedState(likedState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const [replyOpened, setReplyOpened] = useState(false);

  console.log(likedState);

  // const [likes, setLikes] = useState(data.likes.length);
  // const [dislikes, setDislikes] = useState(data.dislikes.length);
  const likes = data.likes.length;
  const dislikes = data.dislikes.length;

  const removeVote = async (type: VoteType) => {
    await updateDoc(doc(db, 'comments', id), {
      [type]: arrayRemove(sessionUserId),
    });
  };

  const addVote = async (type: VoteType) => {
    await updateDoc(doc(db, 'comments', id), {
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
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh();
    });
  };

  const onReplyClick = () => {
    if (!session) {
      // TODO: show sign in modal
      return;
    }
    setReplyOpened(true);
  };

  // this isn't great to be honest
  const onLike = () => {
    if (isMutating) return;
    if (!session) {
      // TODO: show sign in modal
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
      // TODO: show sign in modal
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
    <div className={'block' + (topLevel ? '' : ' ml-6 md:ml-8')}>
      <div className="my-4 flex">
        <UserIcon className="mr-1 mt-2" />
        <div className="flex flex-1 flex-col">
          <div className="flex-1 rounded-md border border-accentLight p-4 dark:border-accentDark">
            <div>
              <p className="font-semibold">{user.username}</p>
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
