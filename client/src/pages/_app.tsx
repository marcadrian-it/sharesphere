import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Head from "next/head";
import { AppProps } from "next/app";

const theme = extendTheme({
  semanticTokens: {
    colors: {
      "chakra-body-bg": {
        _light: "#f3f2ef",
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme} cssVarsRoot=":root">
      <Head>
        <title>Sharesphere</title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
