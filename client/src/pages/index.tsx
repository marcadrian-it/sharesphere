import React from "react";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { withApollo2 } from "../utils/withApollo";

import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Img,
  Link,
  Stack,
  Text,
  ScaleFade,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { UpvoteSection } from "../components/UpvoteSection";

import NextLink from "next/link";
import { timeDifference } from "../utils/timeUtil";

const Index = () => {
  const { data: user } = useMeQuery({
    fetchPolicy: "cache-only",
  });
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 10,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <Box>
        query failed for some reason
        <Box>{error?.message}</Box>
      </Box>
    );
  }

  return (
    <Layout>
      {!data && loading ? (
        <Flex flexDirection="column">
          Loading
          <Spinner />
        </Flex>
      ) : (
        <Stack spacing={8} mb={4} p={4}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <ScaleFade
                key={p.id}
                initialScale={0.9}
                in={true}
                whileHover={{ scale: 1.05 }}
              >
                <Flex
                  key={p.id}
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  bg={"#ffff"}
                >
                  <UpvoteSection post={p} user={user} />
                  <Box flex={1}>
                    <Text color={"grey"} fontSize={12}>
                      Posted: {timeDifference(new Date(parseInt(p.createdAt)))}
                    </Text>
                    <Link as={NextLink} href={`/post/${p.id}`}>
                      <Heading fontSize="xl">{p.title}</Heading>

                      <Center>
                        <Img
                          src={p.imageUrl}
                          maxH="600"
                          objectFit="cover"
                          mt={4}
                          alt={p.title}
                        ></Img>
                      </Center>
                    </Link>

                    <Text mt={4}>
                      by: <Badge colorScheme="green">{p.author.username}</Badge>
                    </Text>
                    <Flex align="center">
                      <Text flex={1} mt={4}>
                        {p.textSnippet}
                      </Text>
                      <Box ml="auto">
                        <EditDeletePostButtons
                          authorId={p.author.id}
                          id={p.id}
                          imageUrl={p.imageUrl}
                        />
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </ScaleFade>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex align="center" mt={6} mb={8}>
          <Button
            border="1px solid silver"
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              });
            }}
            isLoading={loading}
            m="auto"
            aria-label="Load more posts"
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withApollo2({ ssr: true })(Index);
