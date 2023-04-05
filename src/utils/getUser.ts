import { db } from '@/firebase/firebase';
import {  doc, getDoc } from 'firebase/firestore';
import { cache } from 'react';

export const getUser = cache(async (id: string) => {
  const user = await (async () => {
    console.log(`fetching user: ${id}`);
    const user = await getDoc(doc(db, 'users', id));
    return user.data();
  })();
  return user as HumanUser;
});
