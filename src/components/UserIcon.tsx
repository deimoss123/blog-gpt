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
    <div className={'w-12 h-12 flex justify-center items-center' + (className ? ` ${className}` : '')}>
    <div
      className={'relative h-10 w-10 overflow-hidden rounded-full'}
    >
      <Image src={url} alt="Post author profile picture" width={40} height={40} />
    </div>
    </div>
  );
}
