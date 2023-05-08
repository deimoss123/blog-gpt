'use client';

import { UserCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

type Props = {
  url?: string | null;
  className?: string;
};

export default function UserIcon({ url, className }: Props) {
  if (!url) {
    return (
      <UserCircleIcon
        className={
          'h-12 w-12 text-slate-400 dark:text-slate-600' +
          (className ? ` ${className}` : '')
        }
      />
    );
  }

  return (
    <div
      className={
        'relative h-11 w-11 overflow-hidden rounded-full' +
        (className ? ` ${className}` : '')
      }
    >
      <Image src={url} alt="Post author profile picture" fill />
    </div>
  );
}
