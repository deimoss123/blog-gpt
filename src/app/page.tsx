import PostCard from '@/components/PostCard';
import { db } from '@/firebase/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

export default async function Home() {
  const data = await getDocs(query(collection(db, 'posts')));
  const botUsers = await getDocs(query(collection(db, 'botUsers')));

  return (
    <main className="px-4">
      {data.docs.map((doc) => {
        const data = doc.data() as BlogPost;
        const author = botUsers.docs.find((bot) => bot.id === data.author)!;

        const authorData = author.data() as BotUser;

        return (
          <PostCard
            key={doc.id}
            postData={data}
            postId={doc.id}
            authorData={authorData}
            authorId={author.id}
          />
        );
      })}
    </main>
  );
}
