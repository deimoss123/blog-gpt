'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import ThemeSelector from './ThemeSelector';
import { useState } from 'react';
import LoginModal from './LoginModal';
import Image from 'next/image';
import { SafeUser } from '@/typings';

type Props = {
  currentUser: SafeUser | null;
};

export default function Header({ currentUser }: Props) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-accentLight bg-inherit dark:border-accentDark">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-2">
          <Link href="/" className="mr-auto flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <span
              className="text-xl font-bold dark:text-white sm:text-2xl"
              // style={{ WebkitTextStroke: '1px white' }}
            >
              BlogGPT
            </span>
          </Link>

          <ThemeSelector />
          {!currentUser ? (
            <button
              className="rounded-md border border-accentLight bg-white px-4 py-2 dark:border-accentDark dark:bg-gray-900"
              onClick={() => setModalOpen(true)}
            >
              Login
            </button>
          ) : (
            <>
              <p className="mr-4 hidden sm:block">{currentUser.username}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://firebasestorage.googleapis.com/v0/b/blog-gpt-af3da.appspot.com/o/tdQckCjYzazzxI1Gcoaf.png?alt=media&token=ec8917f7-58a1-4584-9092-915b576d1b5a"
                alt="Profile picture"
                className="h-9 w-9 cursor-pointer rounded-full hover:opacity-70"
                onClick={() => signOut()}
              />
            </>
          )}
        </div>
      </header>
      <LoginModal
        isOpen={isModalOpen}
        setIsOpen={setModalOpen}
        titleText="Login"
      />
    </>
  );
}
