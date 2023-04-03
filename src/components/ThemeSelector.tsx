'use client';

import { useTheme } from 'next-themes';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

export default function ThemeSelector() {
  const { theme, setTheme, systemTheme } = useTheme();

  return (
    <Menu as="div" className="relative mr-4 flex items-center">
      <Menu.Button className="h-6 w-6">
        {theme === 'light' ? (
          <SunIcon className="stroke-2 text-sky-600" />
        ) : theme === 'dark' ? (
          <MoonIcon className="stroke-2 text-sky-600" />
        ) : theme === 'system' && systemTheme === 'light' ? (
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
        <Menu.Items className="absolute right-0 top-8 overflow-hidden rounded-md bg-white font-semibold text-black shadow-md dark:bg-slate-800 dark:text-white">
          <Menu.Item>
            <button
              className={
                'flex w-full items-center px-4 py-2 text-left ui-active:bg-slate-100 dark:ui-active:bg-slate-500' +
                (theme === 'light' ? ' text-sky-500' : '')
              }
              onClick={() => setTheme('light')}
            >
              <SunIcon className="mr-2 h-6 w-6 stroke-2" />
              Light
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              className={
                'flex w-full items-center px-4 py-2 text-left ui-active:bg-slate-100 dark:ui-active:bg-slate-500' +
                (theme === 'dark' ? ' text-sky-500' : '')
              }
              onClick={() => setTheme('dark')}
            >
              <MoonIcon className="mr-2 h-6 w-6 stroke-2" />
              Dark
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              className={
                'flex w-full items-center px-4 py-2 text-left ui-active:bg-slate-100 dark:ui-active:bg-slate-500' +
                (theme === 'system' ? ' text-sky-500' : '')
              }
              onClick={() => setTheme('system')}
            >
              <ComputerDesktopIcon className="mr-2 h-6 w-6 stroke-2" />
              System
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
