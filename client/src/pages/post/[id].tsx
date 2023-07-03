import React from "react";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { Layout } from "../../components/Layout";
import {
  Box,
  Img,
  Flex,
  Container,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  ModalCloseButton,
  Badge,
  Center,
} from "@chakra-ui/react";
import { timeDifference } from "../../utils/timeUtil";
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
      <Text pl={4} color={"grey"} fontSize={12}>
        Posted: {timeDifference(new Date(parseInt(data.post.createdAt)))}
      </Text>
      <Text
        mb={4}
        pl={4}
        fontSize="4xl"
        fontWeight="bold"
        letterSpacing="wide"
        textTransform="uppercase"
      >
        {data?.post?.title}
      </Text>
      <Container
        mb={4}
        maxW="container.md"
        border="1px solid"
        bg={"#ffff"}
        borderColor="gray.200"
        borderRadius="lg"
      >
        <Box>
          <Flex alignItems="center" justifyContent="space-between">
            <UpvoteSection
              post={{ ...data.post, textSnippet: data.post.text }}
            />
            <Box flexGrow={1} mt={4}>
              <Center>
                <Img
                  src={data?.post?.imageUrl}
                  onClick={onOpen}
                  cursor="pointer"
                />
              </Center>
            </Box>
          </Flex>
        </Box>
        <Text mt={4}>
          by: <Badge colorScheme="green">{data.post.author.username}</Badge>
        </Text>
        <Flex p={5}>
          <EditDeletePostButtons
            id={data.post.id}
            authorId={data.post.author.id}
            imageUrl={data.post.imageUrl}
          />
        </Flex>
      </Container>
      {data.post.text ? (
        <Text mb={4} pl={4} fontWeight="bold">
          Description:
        </Text>
      ) : (
        <Text mb={4} pl={4} fontWeight="bold">
          No description
        </Text>
      )}
      {data.post.text && (
        <Container
          mb={4}
          mt={4}
          bg={"#ffff"}
          maxW="container.md"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
        >
          <Box pb={2} pt={2}>
            {data?.post?.text}
          </Box>
        </Container>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={{ base: "md", md: "3xl" }}>
          <ModalCloseButton />
          <ModalBody justifyContent="center">
            <Center>
              <Img src={data?.post?.imageUrl} />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default withApollo2({ ssr: true })(Post);
