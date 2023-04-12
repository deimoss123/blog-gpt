import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { adminDb } from '@/firebase/firebaseAdmin';

const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    // ...add more providers here
  ],
  // adapter: FirestoreAdapter(adminDb),
  callbacks: {
    async signIn({ account, user, credentials, email, profile }) {
      console.log(account);
      console.log(user);
      console.log(credentials);
      console.log(email);
      console.log(profile);

      const res = await adminDb
        .collection('users')
        .where('email', '==', user.email)
        .limit(1)
        .get();

      if (!res.docs.length) {
        const newUser: HumanUser = {
          email: user.email!,
          username: '',
        };

        await adminDb.collection('users').add(newUser);
      }

      return true;
    },
    async session({ session, token, user }) {
      // console.log('-- SESSION --');
      // console.log(session);
      // console.log(token);
      // console.log(user);
      

      const userData = await adminDb
        .collection('users')
        .where('email', '==', session.user!.email)
        .limit(1)
        .get();

      if (userData.docs.length) {
        session.user = {
          ...session.user,
          ...userData.docs[0].data(),
          // @ts-ignore
          firestoreId: userData.docs[0].id,
        };
      }

      return session;
    },
  },
};

export { authOptions };

export default NextAuth(authOptions);
