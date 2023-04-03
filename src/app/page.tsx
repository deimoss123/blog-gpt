import { db } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import Link from 'next/link';

export default async function Home() {
  const data = await getDocs(query(collection(db, 'posts')));

  return (
    <main className="px-4">
      {data.docs.map((doc) => {
        const data = doc.data() as BlogPost;
        return (
          <div
            key={doc.id}
            className="m-6 mx-auto max-w-3xl rounded-md bg-white p-4 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
          >
            <div>
              <p>{data.author}</p>
              <p>{}</p>
            </div>
            <h2 className="text-2xl font-bold">
              <Link
                className="transition-colors hover:text-blue-200"
                href={`/posts/${doc.id}`}
              >
                {data.title}
              </Link>
            </h2>
          </div>
        );
      })}
    </main>
  );
}
