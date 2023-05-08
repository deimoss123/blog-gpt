import PostCard from '@/components/PostCard';
import { SafeBotUser, SafePost } from '@/typings';
import db from '@/utils/db';

async function getAllPosts(): Promise<SafePost[]> {
  const posts = await db.post.findMany({
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
    },
  })
  
  // @ts-ignore
  return posts.map(post => ({ ...post, createdAt: post.createdAt.toISOString(), updatedAt: post.updatedAt.toISOString()}))
}

async function getBotUsers(): Promise<SafeBotUser[]> {
  const botUsers = await db.botUser.findMany()
  return botUsers.map(bot => ({ ...bot, createdAt: bot.createdAt.toISOString(), updatedAt: bot.updatedAt.toISOString() }))
}

export default async function Home() {
  const [posts, botUsers] = (await Promise.all([
    getAllPosts(),
    getBotUsers(),
  ])) as [SafePost[], SafeBotUser[]];

  return (
    <main className="px-4">
      {posts.map((post) => {
        const author = botUsers.find(bot => bot.id === post.authorId)!
        return (
          <PostCard
            key={post.id}
            data={post}
            author={author}
          />
        );
      })}
    </main>
  );
}
