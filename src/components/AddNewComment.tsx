"use client";

import { useState } from "react";
import UserIcon from "./UserIcon";
import { addDoc, collection } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "@/firebase";

type Props = {
  postId: string;
  avatarUrl?: string;
};

export default function AddNewComment({ postId, avatarUrl }: Props) {
  const [input, setInput] = useState("");
  const { data: session } = useSession();

  // TODO: make a cleaner textarea: https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/

  const canSubmit = !!input.length;

  const onSubmit = async () => {
    if (!session || !canSubmit) return;
    const comment: PostComment = {
      authorId: session.user?.email!,
      content: input,
      likedBy: [],
      postId,
    };
    setInput("");
    await addDoc(collection(db, "comments"), comment);
  };

  return (
    <div className="flex mt-4">
      <UserIcon className="mr-2" url={avatarUrl} />
      <div className="flex-1">
        <textarea
          className="bg-transparent border border-gray-700 rounded-lg w-full p-2 max-h-60 min-h-[4rem]"
          placeholder="Comment on this post"
          name=""
          id=""
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
        />
        <div className="mt-2">
          <button
            className="px-4 py-2 rounded-lg bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
