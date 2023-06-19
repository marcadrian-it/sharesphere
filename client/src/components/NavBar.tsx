import React from "react";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { Img } from "@chakra-ui/react";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data } = useMeQuery({
    skip: isServer(),
  });
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);
  let body = null;
  if (!showContent) {
    // show loading state
    body = <Box>Loading...</Box>;
  } else if (!data?.me) {
    // user not logged in
    body = (
      <Box>
        <Link as={NextLink} href="/login" mr={2}>
          login
        </Link>
        <Link as={NextLink} href="/register">
          register
        </Link>
      </Box>
    );
  } else {
    // user is logged in
    body = (
      <Flex align="center">
        <Button as={NextLink} href="/create-post" mr={4}>
          create post
        </Button>

        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout({});
            await apolloClient.resetStore();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      p={4}
      borderBottom="1px solid silver"
      sx={{
        "::before": {
          content: '""',
          position: "absolute",
          top: -2,
          left: -1,
          right: 0,
          bottom: 0,
          bg: "rgba(210, 180, 140, 0.95)",
          filter: "blur(4px)",
          zIndex: -1,
        },
      }}
    >
      <Flex flex={1} m="auto" maxW={800} align="center">
        <Link as={NextLink} href="/">
          <Flex flexDirection="row" align="center">
            <Box boxSize="24">
              <Img
                src="https://res.cloudinary.com/dmzmqvehw/image/upload/v1682981008/cover1_p49abt.png"
                alt="logo"
              />
            </Box>
            <Heading>Sharesphere</Heading>
          </Flex>
        </Link>

        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
