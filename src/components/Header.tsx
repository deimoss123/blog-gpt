"use client";

import Link from "next/link";
import Login from "./Login";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

export default function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-slate-600 p-4 text-white flex items-center">
      <Link href="/" className="font-bold text-xl mr-auto">
        BlogGPT
      </Link>
      <button
        className="bg-slate-700 rounded-md p-2 mr-2"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        Toggle Theme
      </button>
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
