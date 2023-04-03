'use client';

import { ThemeProvider as Provider } from 'next-themes';

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  return (
    <Provider attribute="class" themes={['light', 'dark']}>
      {children}
    </Provider>
  );
}
