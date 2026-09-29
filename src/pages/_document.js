import { Html, Head, Main, NextScript } from 'next/document';
import { DocumentHeadTags, documentGetInitialProps } from '@mui/material-nextjs/v16-pagesRouter';

export default function MyDocument(props) {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#16121C" />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx) => documentGetInitialProps(ctx);