'use client';

import Link from 'next/link';
import Login from './Login';
import { signOut, useSession } from 'next-auth/react';
import ThemeSelector from './ThemeSelector';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed left-0 right-0 top-0 z-10 flex items-center border-b border-b-accentLight bg-inherit px-6 py-3 dark:border-b-accentDark dark:text-white">
      <Link href="/" className="mr-auto text-xl font-bold">
        BlogGPT
      </Link>
      <ThemeSelector />
      {!session ? (
        <Login />
      ) : (
        <>
          <p className="mr-4">Logged in</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={session.user?.image!}
            alt="Profile picture"
            className="h-10 w-10 cursor-pointer rounded-full hover:opacity-70"
            onClick={() => signOut()}
          />
        </>
      )}
    </header>
  );
}
