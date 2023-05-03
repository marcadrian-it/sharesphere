import React from "react";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { Layout } from "../../components/Layout";
import { Box, Heading, Img, Flex } from "@chakra-ui/react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { withApollo2 } from "../../utils/withApollo";
import { UpvoteSection } from "../../components/UpvoteSection";

export const Post = ({}) => {
  const { data, error, loading } = useGetPostFromUrl();

  if (loading) {
    return <Layout>Loading...</Layout>;
  }
  if (error) {
    return <Layout>{error.message}</Layout>;
  }

  if (!data?.post) {
    return <Layout>Could not find post</Layout>;
  }

  return (
    <Layout>
      <Heading mb={4}>{data?.post?.title}</Heading>
      <Box mb={4}>
        <Flex alignItems="center">
          <UpvoteSection post={{ ...data.post, textSnippet: data.post.text }} />
          <Img src={data?.post?.imageUrl} />
        </Flex>
        {data?.post?.text}
      </Box>
      <EditDeletePostButtons
        id={data.post.id}
        authorId={data.post.author.id}
        imageUrl={data.post.imageUrl}
      />
    </Layout>
  );
};

export default withApollo2({ ssr: true })(Post);
