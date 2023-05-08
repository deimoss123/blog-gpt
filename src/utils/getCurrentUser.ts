import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import db from '@/utils/db';
import { Session } from 'next-auth';
import { SafeUser } from '@/typings';

export default async function getCurrentUser(): Promise<{
  currentUser: SafeUser | null;
  session: Session | null;
}> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { currentUser: null, session };
  }

  const currentUser = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    return { currentUser: null, session };
  }

  return {
    currentUser: {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null
    } as SafeUser,
    session,
  };
}
