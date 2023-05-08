import { Post, User, Comment, BotUser } from "@prisma/client";

type SafeUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

type SafeBotUser = Omit<BotUser, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
}

type SafePost = Omit<Post, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
}

type SafeComment = Omit<Comment, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
}

type VoteType = 'likes' | 'dislikes';

type LikedStateType = 'liked' | 'disliked' | null;

type CommentType = {
  data: QueryDocumentSnapshot<DocumentData>;
  userVoteState: LikedStateType;
  commentVotes: { likes: number; dislikes: number };
};
