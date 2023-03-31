"use client";

import Link from "next/link";
import Login from "./Login";
import { signOut, useSession } from "next-auth/react";
import ThemeSelector from "./ThemeSelector";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="z-10 bg-inherit py-3 px-6 dark:text-white flex items-center fixed top-0 left-0 right-0 border-b border-b-slate-300 dark:border-b-gray-700">
      <Link href="/" className="font-bold text-xl mr-auto">
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
            className="h-10 w-10 rounded-full cursor-pointer hover:opacity-70"
            onClick={() => signOut()}
          />
        </>
      )}
    </header>
  );
}
