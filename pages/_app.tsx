// pages/_app.tsx

import '../styles/globals.css';
import type { AppProps } from 'next/app'; // Import AppProps type from next/app

function MyApp({ Component, pageProps }: AppProps) { // Explicitly type Component and pageProps as AppProps
  return <Component {...pageProps} />;
}

export default MyApp;
