import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

type Props = {
  params: {
    postId: string;
  };
};

export default async function PostPage({ params }: Props) {
  const res = await getDoc(doc(db, "posts", params.postId));
  const data = res.data() as BlogPost | undefined;

  return !data ? (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl">This post doesn&apos;t exist</h1>
      <Link className="text-xl text-blue-400 mt-4" href="/">
        Go back
      </Link>
    </div>
  ) : (
    <main className="p-4 max-w-xl mx-auto">
      <div className="mb-6">
        <p className="font-bold text-xl">{data.author}</p>
        <p className="text-sm text-gray-400">
          Posted on {(data.createdAt.toDate() as Date).toDateString()}
        </p>
      </div>
      <h2>{data.title}</h2>
      <div>{data.content}</div>
    </main>
  );
}
