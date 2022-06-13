/* eslint-disable react/jsx-props-no-spreading */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import createEmotionServer from '@emotion/server/create-instance';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import theme, { createEmotionCache } from '@styles/theme';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          {/* https://semidotinfotech.com/blog/wp-content/uploads/2021/05/A-Guide-to-Develop-NFT-Marketplace.jpg */}
          <title>NFT Launchpad - Le Huy Du</title>
          <meta
            name="description"
            content="NFT Launchpad Development Services | NFT Launchpad Development | NFT Launchpad Services | NFT Launchpad Development Solutions"
          />
          <meta name="keywords" content="nft, marketplace, staking" />
          <meta name="author" content="dusainbolt" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="NFT Launchpad - Le Huy Du" />
          <meta
            property="og:description"
            content="NFT Launchpad Development Services | NFT Launchpad Development | NFT Launchpad Services | NFT Launchpad Development Solutions"
          />
          <meta property="og:site_name" content="NFT Launchpad - Le Huy Du" />
          <meta
            property="og:image"
            content="https://semidotinfotech.com/blog/wp-content/uploads/2021/05/A-Guide-to-Develop-NFT-Marketplace.jpg"
          />
          <meta property="og:url" content="https://nft-launchpad-demo.vercel.app/" />
          <meta property="twitter:card" content="summary" />
          <meta
            name="twitter:image"
            content="https://semidotinfotech.com/blog/wp-content/uploads/2021/05/A-Guide-to-Develop-NFT-Marketplace.jpg"
          />
          <meta property="twitter:title" content="NFT Launchpad - Le Huy Du" />
          <meta
            property="twitter:description"
            content="NFT Launchpad Development Services | NFT Launchpad Development | NFT Launchpad Services | NFT Launchpad Development Solutions"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...emotionStyleTags, ...React.Children.toArray(initialProps.styles)],
  };
};
