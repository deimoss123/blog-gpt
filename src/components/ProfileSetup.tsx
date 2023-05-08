'use client';

import { CheckIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import validateUsername from '@/utils/validateUsername';

async function findUsername(username: string) {
  const res = await axios.get(`/api/check-username?username=${username}`)
   
  return res.data.isTaken as boolean;
}

export default function ProfileSetup() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const validateRes = validateUsername(input);

  const router = useRouter();

  useEffect(() => {
    setAvailable(null);
    if (validateRes.valid) {
      const timeout = setTimeout(async () => {
        setLoading(true);
        const [res] = await Promise.all([
          findUsername(input),
          new Promise<void>((res) => setTimeout(() => res(), 300)),
        ]);
        setLoading(false);
        setAvailable(!res);
      }, 1000);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const onBtnClick = async () => {
    const res = await axios.patch('/api/change-username', { newUsername: input })
    router.refresh();
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-lg rounded-md border border-accentLight bg-white p-4 text-gray-800 dark:border-accentDark dark:bg-gray-900 dark:text-gray-100">
        <h1 className="mb-4 text-2xl font-bold">Enter your username</h1>
        <input
          className={
            'text-md mx-auto mb-[2px] w-full rounded-md border border-accentLight bg-inherit p-2 outline-none dark:border-accentDark' +
            ((input && !validateRes.valid) || available === false
              ? ' border-red-400 dark:border-red-400'
              : available
              ? ' border-green-500 dark:border-green-500'
              : '')
          }
          type="text"
          value={input}
          placeholder="TestUsername123"
          onChange={(e) => setInput(e.target.value)}
        />
        {input && !validateRes.valid ? (
          <div className="absolute flex items-center text-sm text-red-400">
            <XMarkIcon className="h-6 w-6" />
            <p className="text-sm">{validateRes.msg}</p>
          </div>
        ) : loading ? (
          <div className="absolute flex items-center text-sm text-gray-600">
            <ArrowPathIcon className="mr-1 h-5 w-5 animate-spin" />
            <p>Loading...</p>
          </div>
        ) : available ? (
          <div className="absolute flex items-center text-sm text-green-500">
            <CheckIcon className="h-6 w-6" />
            <p>Username available</p>
          </div>
        ) : available === false ? (
          <div className="absolute flex items-center text-sm text-red-400">
            <XMarkIcon className="h-6 w-6" />
            <p>Username taken</p>
          </div>
        ) : (
          ''
        )}
        <button
          onClick={onBtnClick}
          className="mt-12 block rounded-md bg-gray-100 px-4 py-2 text-lg dark:bg-slate-800"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
