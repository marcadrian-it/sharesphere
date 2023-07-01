import React from "react";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { Layout } from "../../components/Layout";
import {
  Box,
  Heading,
  Img,
  Flex,
  Container,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  ModalCloseButton
} from "@chakra-ui/react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { withApollo2 } from "../../utils/withApollo";
import { UpvoteSection } from "../../components/UpvoteSection";

export const Post = ({}) => {
  const { data, error, loading } = useGetPostFromUrl();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <Text mb={4} pl={4} fontSize="4xl" fontWeight="bold" letterSpacing="wide" textTransform="uppercase">
        {data?.post?.title}
      </Text>
      <Container mb={4} maxW="container.md" border="1px solid" borderColor="gray.200" borderRadius="lg">
        <Box>
          <Flex alignItems="center">
            <UpvoteSection post={{ ...data.post, textSnippet: data.post.text }} />
            <Flex alignItems="center" mb={4}>
              <Img src={data?.post?.imageUrl} onClick={onOpen} />
            </Flex>
          </Flex>
        </Box>
        <Flex p={5}>
          <EditDeletePostButtons
            id={data.post.id}
            authorId={data.post.author.id}
            imageUrl={data.post.imageUrl}
          />
        </Flex>
      </Container>
      {data.post.text && (
  <Container mb={4} mt={4} maxW="container.md" border="1px solid" borderColor="gray.200" borderRadius="lg">
    <Box>
      {data?.post?.text}
    </Box>
  </Container>
)}



      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={{ base: "md", md: "3xl" }}>
        <ModalCloseButton />
          <ModalBody justifyContent="center">
            <Img src={data?.post?.imageUrl} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default withApollo2({ ssr: true })(Post);
