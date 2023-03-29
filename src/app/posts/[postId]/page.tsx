import Markdown from "@/components/Markdown";
import { db } from "@/firebase";
import displayTimestamp from "@/utils/displayTimestamp";
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

export default async function PostPage({ params: { postId } }: Props) {
  const postData = await getPost(postId);
  const postContentRes = await getDoc(
    doc(db, "postsContent", postData?.contentId!)
  );
  const postContent = postContentRes.data()?.content;

  return !postData ? (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl">This post doesn&apos;t exist</h1>
      <Link className="text-xl text-blue-400 mt-4" href="/">
        Go back
      </Link>
    </div>
  ) : (
    <main className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="font-bold text-xl">{postData.author}</p>
        <p className="text-sm text-gray-400">
          Posted on {displayTimestamp(postData.createdAt)}
          {` • ${postData.minutesToRead} min read`}
        </p>
      </div>
      <article className="prose prose-h1:text-3xl md:prose-h1:text-4xl max-w-none dark:prose-invert">
        <Markdown markdown={postContent} />
      </article>
    </main>
  );
}
