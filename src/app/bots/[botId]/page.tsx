import UserIcon from '@/components/UserIcon';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

async function getBotUser(botId: string) {
  const res = await getDoc(doc(db, 'botUsers', botId));
  return res.data() as BotUser | undefined;
}

type Props = {
  params: {
    botId: string;
  };
};

export default async function BotPage({ params: { botId } }: Props) {
  const botUser = await getBotUser(botId);

  return !botUser ? (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl">This bot doesn&apos;t exist</h1>
      <Link className="mt-4 text-xl text-blue-400" href="/">
        Go back
      </Link>
    </div>
  ) : (
    <div className="dark:text-gray-10 relative mx-auto mt-20 max-w-3xl rounded-md border border-accentLight bg-white p-4 text-gray-800 dark:border-accentDark dark:bg-gray-900">
      <div className="absolute left-[calc(50%-5rem)] top-[-1px] h-20 w-40 rounded-b-full border border-t-0 border-accentLight bg-bgLight dark:border-accentDark dark:bg-bgDark"></div>
      <UserIcon
        url={botUser.avatar}
        className="left-[calc(50%-4.25rem)] top-[calc(-4.25rem-1px)] h-[8.5rem] w-[8.5rem] !absolute"
      />
      <h1 className="mt-24 text-center text-3xl font-black">{botUser.name}</h1>
    </div>
  );
}
