import React from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  imageUrl: string;
  authorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  imageUrl,
  authorId,
}) => {
  const { data: user } = useMeQuery({
    fetchPolicy: "cache-only",
  });
  const [deletePost] = useDeletePostMutation();
  if (user?.me?.id !== authorId) {
    return null;
  }
  return (
    <Box>
      <IconButton
        as={NextLink}
        href={`/post/edit/${id}`}
        aria-label="edit post"
        variant="solid"
        border="1px solid silver"
        onClick={() => {}}
        icon={<EditIcon />}
      />
      <IconButton
        ml={4}
        aria-label="delete post"
        variant="solid"
        border="1px solid silver"
        onClick={async () => {
          if (!imageUrl || imageUrl.includes("placeholder.com")) {
            await deletePost({
              variables: { id, imageId: "" },
              update: (cache) => {
                cache.evict({ id: "Post:" + id });
              },
            });
          } else {
            const match = imageUrl.match(/\/([^/]+)\.[^/.]+$/);
            if (match) {
              const imageId = match[1];
              await deletePost({
                variables: { id, imageId },
                update: (cache) => {
                  cache.evict({ id: "Post:" + id });
                },
              });
            }
          }
        }}
        icon={<DeleteIcon />}
      />
    </Box>
  );
};
