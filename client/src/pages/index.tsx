import React from "react";
import { usePostsQuery } from "../generated/graphql";
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
} from "@chakra-ui/react";
import { UpvoteSection } from "../components/UpvoteSection";

import NextLink from "next/link";

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
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
        <Box>loading...</Box>
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
                <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  <UpvoteSection post={p} />
                  <Box flex={1}>
                    <Link as={NextLink} href={`/post/${p.id}`}>
                      <Heading fontSize="xl">{p.title}</Heading>
                    <Center>
                      <Img
                        src={p.imageUrl}
                        maxH="600"
                        objectFit="cover"
                        mt={4}
                      ></Img>
                    </Center>
                    </Link>

                    <Text mt={4}>posted by: {p.author.username}</Text>
                    <Flex align="center">
                      <Text flex={1} mt={4}>
                        {p.textSnippet}
                      </Text>
                      <Box ml="auto">
                        <EditDeletePostButtons
                          id={p.id}
                          authorId={p.author.id}
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
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withApollo2({ ssr: true })(Index);
