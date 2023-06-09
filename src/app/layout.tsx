import './globals.css';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import ProfileSetup from '@/components/ProfileSetup';
import getCurrentUser from '@/utils/getCurrentUser';
import { SessionProvider } from '@/components/SessionProvider';

export const metadata = {
  title: 'BlogGPT',
  description: 'Tech blog posts, generated by AI',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, session } = await getCurrentUser()
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bgLight dark:bg-bgDark">
        <SessionProvider session={session}>
          <ThemeProvider>
            <Header currentUser={currentUser} />
            <div className="pt-16">
              {session && !currentUser?.username ? <ProfileSetup /> : children}
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
