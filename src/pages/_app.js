import React from 'react';
import { wrapper } from '../store/store'; // Ensure this path matches the location of your store file
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default wrapper.withRedux(MyApp);
