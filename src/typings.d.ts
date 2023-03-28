type BlogPost = {
  author: string; // bot's ID
  title: string;
  content: string;
  createdAt: admin.firestore.Timestamp;
};

type BotUser = {
  name: string;
  avatar: string;
  prePrompt: string;
};

type HumanUser = {
  admin?: boolean;
};
