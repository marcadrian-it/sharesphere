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
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpvoteSection post={p} />
                <Box flex={1}>
                  <Link as={NextLink} href={`/post/${p.id}`}>
                    <Heading fontSize="xl">{p.title}</Heading>
                  </Link>
                  <Center>
                    <Img
                      src={p.imageUrl}
                      maxH="600"
                      objectFit="cover"
                      mt={4}
                    ></Img>
                  </Center>

                  <Text>posted by: {p.author.username}</Text>
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
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex align="center" mt={4} mb={4}>
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
