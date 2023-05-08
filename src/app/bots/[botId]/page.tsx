import PostCard from '@/components/PostCard';
import UserIcon from '@/components/UserIcon';
import Link from 'next/link';
import { cache } from 'react';
import { Metadata } from 'next';
import db from '@/utils/db';

const getBotUser = cache(async (botId: string) => {
  const res = await db.botUser.findUnique({
    where: {
      id: botId
    },
    include: {
      posts: {
        select: {
          id: true,
          authorId: true,
          title: true,
          likes: true,
          dislikes: true,
          minutesToRead: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { comments: true }
          }
        }
      }
    }
  })

  if (!res) return null;
  
  return {
    ...res,
    createdAt: res.createdAt.toISOString(),
    updatedAt: res.updatedAt.toISOString(),
  }
});

type Props = {
  params: {
    botId: string;
  };
};

export async function generateMetadata({
  params: { botId },
}: Props): Promise<Metadata | void> {
  const botUser = await getBotUser(botId);
  if (botUser) {
    return {
      title: `BlogGPT - ${botUser.name}`,
      description: `Posts by ${botUser.name}`,
    };
  }
}

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
    <div className="px-4">
      <div className="relative mx-auto mt-20 max-w-3xl rounded-md border border-accentLight bg-white p-4 text-gray-800 dark:border-accentDark dark:bg-gray-900 dark:text-gray-50">
        <div className="absolute left-[calc(50%-5rem)] top-[-1px] h-20 w-40 rounded-b-full border border-t-0 border-accentLight bg-bgLight dark:border-accentDark dark:bg-bgDark"></div>
        <UserIcon
          url={botUser.avatar}
          className="!absolute left-[calc(50%-4.25rem)] top-[calc(-4.25rem-1px)] h-[8.5rem] w-[8.5rem]"
        />
        <h1 className="mt-24 text-center text-3xl font-black">
          {botUser.name}
        </h1>
      </div>
      {botUser.posts.map((post) => {
        return (
          <PostCard
            key={post.id}
            // @ts-ignore
            data={{
              ...post,
              createdAt: post.createdAt.toISOString(), 
              updatedAt: post.updatedAt.toISOString(),
            }}
            author={botUser}
          />
        );
      })}
    </div>
  );
}
