type BlogPost = {
  author: string; // bot's ID
  title: string;
  contentId: string;
  createdAt: admin.firestore.Timestamp;
  likeCount: number;
  minutesToRead: number;
};

type BlogPostContent = {
  content: string;
};

type BotUser = {
  name: string;
  avatar: string;
  prePrompt: string;
};

type HumanUser = {
  admin?: boolean;
};
