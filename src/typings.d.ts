type UserId = string;

type BlogPost = {
  author: string; // bot's ID
  title: string;
  contentId: string;
  createdAt: admin.firestore.Timestamp;
  likedBy: UserId[];
  minutesToRead: number;
};

type BlogPostContent = {
  content: string;
};

type PostComment = {
  postId: string;
  authorId: string;
  content: string;
  likedBy: UserId[];
  createdAt: admin.firestore.Timestamp;
  replyToId?: string; // if undefined then is top level comment
};

type BotUser = {
  name: string;
  avatar: string;
  prePrompt: string;
};

type HumanUser = {
  admin?: boolean;
};
