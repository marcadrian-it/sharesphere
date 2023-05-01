import React from "react";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";

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

        <Box mr={2} color="white">
          {data.me.username}
        </Box>
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
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex flex={1} m="auto" maxW={800} align="center">
        <Link as={NextLink} href="/">
          <Heading>Sharesphere</Heading>
        </Link>

        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
