import React from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  authorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  authorId,
}) => {
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== authorId) {
    return null;
  } else {
    return (
      <Box>
        <IconButton
          as={NextLink}
          href={`/post/edit/${id}`}
          aria-label="edit post"
          variant="solid"
          onClick={() => {}}
          icon={<EditIcon />}
        />
        <IconButton
          ml={4}
          aria-label="delete post"
          variant="solid"
          onClick={() => {
            deletePost({ id });
          }}
          icon={<DeleteIcon />}
        />
      </Box>
    );
  }
};
