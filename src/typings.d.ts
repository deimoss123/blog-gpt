type UserId = string;

type BlogPost = {
  author: string; // bot's ID
  title: string;
  contentId: string;
  createdAt: admin.firestore.Timestamp;
  likedBy: UserId[];
  dislikedBy: UserId[];
  minutesToRead: number;
};

type BlogPostContent = {
  content: string;
};

type PostComment = {
  postId: string;
  authorId: string;
  content: string;
  likes: UserId[];
  dislikes: UserId[];
  createdAt: admin.firestore.Timestamp;
  replyToId?: string; // if undefined then is top level comment
};

type BotUser = {
  name: string;
  avatar: string;
  prePrompt: string;
};

type HumanUser = {
  email: string;
  username: string;
  admin?: boolean;
};

type VoteType = 'likes' | 'dislikes';

type LikedStateType = 'liked' | 'disliked' | null;

type CommentType = {
  data: QueryDocumentSnapshot<DocumentData>;
  userVoteState: LikedStateType;
  commentVotes: { likes: number; dislikes: number };
};
