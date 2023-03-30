"use client";

import { UserCircleIcon } from "@heroicons/react/24/solid";

type Props = {
  url?: string;
  className?: string;
};

export default function UserIcon({ url, className }: Props) {
  if (!url) {
    return (
      <UserCircleIcon
        className={
          "w-12 h-12 text-slate-500" + (className ? ` ${className}` : "")
        }
      />
    );
  }

  return <div>UserIcon</div>;
}
