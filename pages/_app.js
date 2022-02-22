import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'next-themes';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <ThemeProvider attribute="class">
          <Head>
            <title>LinkedIn</title>
          </Head>
          <Component {...pageProps} />
        </ThemeProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
