"use client";

import Link from "next/link";
import Login from "./Login";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-slate-600 p-4 text-white flex items-center">
      <Link href="/" className="font-bold text-xl mr-auto">
        BlogGPT
      </Link>
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
