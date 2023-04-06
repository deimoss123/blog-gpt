import { db } from '@/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { cache } from 'react';

export const getUser = cache(async (id: string) => {
  const user = await getDoc(doc(db, 'users', id));
  return user.data() as HumanUser;
});
