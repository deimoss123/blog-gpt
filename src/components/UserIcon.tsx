'use client';

import { UserCircleIcon } from '@heroicons/react/24/solid';

type Props = {
  url?: string;
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

  return <div>UserIcon</div>;
}
