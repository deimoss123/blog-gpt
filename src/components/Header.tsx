"use client";

import Link from "next/link";
import Login from "./Login";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const { data: session } = useSession();
  const { theme, setTheme, systemTheme } = useTheme();

  return (
    <header className="bg-slate-600 p-4 text-white flex items-center">
      <Link href="/" className="font-bold text-xl mr-auto">
        BlogGPT
      </Link>
      <Menu as="div" className="relative mr-4 flex items-center">
        <Menu.Button className="w-6 h-6">
          {theme === "light" ? (
            <SunIcon className="stroke-2 text-sky-600" />
          ) : theme === "dark" ? (
            <MoonIcon className="stroke-2 text-sky-600" />
          ) : theme === "system" && systemTheme === "light" ? (
            <SunIcon className="stroke-2" />
          ) : (
            <MoonIcon className="stroke-2" />
          )}
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 top-12 w-32 bg-white dark:bg-slate-800 text-black dark:text-white font-semibold shadow-md rounded-md overflow-hidden">
            <Menu.Item>
              <button
                className={
                  "py-2 px-4 w-full text-left flex items-center ui-active:bg-slate-100 dark:ui-active:bg-slate-500" +
                  (theme === "light" ? " text-sky-500" : "")
                }
                onClick={() => setTheme("light")}
              >
                <SunIcon className="w-6 h-6 mr-2 stroke-2" />
                Light
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={
                  "py-2 px-4 w-full text-left flex items-center ui-active:bg-slate-100 dark:ui-active:bg-slate-500" +
                  (theme === "dark" ? " text-sky-500" : "")
                }
                onClick={() => setTheme("dark")}
              >
                <MoonIcon className="w-6 h-6 mr-2 stroke-2" />
                Dark
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={
                  "py-2 px-4 w-full text-left flex items-center ui-active:bg-slate-100 dark:ui-active:bg-slate-500" +
                  (theme === "system" ? " text-sky-500" : "")
                }
                onClick={() => setTheme("system")}
              >
                <ComputerDesktopIcon className="w-6 h-6 mr-2 stroke-2" />
                System
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>

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
