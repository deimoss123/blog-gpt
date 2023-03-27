import { db } from "@/firebase";
import { collection, getDocs, query } from "firebase/firestore";

export default async function Home() {
  const data = await getDocs(query(collection(db, "posts")));

  return (
    <main>
      {/* fetch posts */}
      {/* show posts */}
      {data.docs.map((doc) => (
        <div
          key={doc.id}
          className="bg-slate-400 rounded-md m-6 p-8 text-white"
        >
          {doc.id}
        </div>
      ))}
    </main>
  );
}
