'use state';

import { Dispatch, SetStateAction, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { signIn } from 'next-auth/react';
import GoogleIcon from './icons/GoogleIcon';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  titleText: string;
};

export default function LoginModal({ isOpen, setIsOpen, titleText }: Props) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[999]"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-0"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-0"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-bgLight p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-800 dark:text-white">
                <Dialog.Title
                  as="h3"
                  className="mb-4 text-center text-xl font-medium leading-6 text-gray-900 dark:text-slate-50"
                >
                  {titleText}
                </Dialog.Title>
                <div>
                  <button
                    className="flex w-full items-center justify-center rounded-md border border-accentLight p-2"
                    onClick={() => signIn('google')}
                  >
                    <div className="mx-auto flex gap-2">
                      <GoogleIcon className="fill-black dark:fill-white" />
                      Google
                    </div>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
