import Markdown from "@/components/Markdown";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import Link from "next/link";

async function getPost(postId: string) {
  const res = await getDoc(doc(db, "posts", postId));
  return res.data() as BlogPost | undefined;
}

type Props = {
  params: {
    postId: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getPost(params.postId);
  return {
    title: data?.title || "BlogGPT",
  };
}

export default async function PostPage({ params }: Props) {
  const data = await getPost(params.postId);

  console.log(data);

  return !data ? (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl">This post doesn&apos;t exist</h1>
      <Link className="text-xl text-blue-400 mt-4" href="/">
        Go back
      </Link>
    </div>
  ) : (
    <main className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="font-bold text-xl">{data.author}</p>
        <p className="text-sm text-gray-400">
          Posted on {(data.createdAt.toDate() as Date).toDateString()}
        </p>
      </div>
      {/* <h2>{data.title}</h2> */}
      <article className="prose max-w-none dark:prose-invert">
        <Markdown markdown={data.content} />
        {/* <ReactMarkdown>{data.content}</ReactMarkdown> */}
      </article>
    </main>
  );
}
