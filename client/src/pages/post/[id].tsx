import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { Layout } from "../../components/Layout";
import { Box, Heading } from "@chakra-ui/react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";

export const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl();

  if (fetching) {
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
      <Box mb={4}>{data?.post?.text}</Box>
      <EditDeletePostButtons id={data.post.id} authorId={data.post.author.id} />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
