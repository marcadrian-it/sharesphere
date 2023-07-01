import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { AppProps } from "next/app";

const theme = extendTheme({
  semanticTokens: {
    colors: {
      "chakra-body-bg": {
        _light: "#f3f2ef",
        _dark: "purple.800",
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
