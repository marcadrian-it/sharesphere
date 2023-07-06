import NextDocument, { Html, Head, Main, NextScript } from "next/document";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="Sharesphere is a portal with the goal of aggregating content, where users can share and discover posts and photos"
          />
        </Head>
        <body>
          {}

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
