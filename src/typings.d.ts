interface BlogPost {
  author: string;
  title: string;
  content: string;
  createdAt: admin.firestore.Timestamp;
}
