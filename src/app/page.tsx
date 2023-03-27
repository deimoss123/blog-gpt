import { db } from "@/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import Link from "next/link";

export default async function Home() {
  const data = await getDocs(query(collection(db, "posts")));

  return (
    <main>
      {/* fetch posts */}
      {/* show posts */}
      {data.docs.map((doc) => (
        <div
          key={doc.id}
          className="bg-slate-400 rounded-md m-6 p-4 text-white"
        >
          <p>{doc.id}</p>
          <h2 className="font-bold text-2xl">
            <Link
              className="hover:text-blue-200 transition-colors"
              href={`/posts/${doc.id}`}
            >
              {doc.data().title}
            </Link>
          </h2>
        </div>
      ))}
    </main>
  );
}
