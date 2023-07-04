import React, { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import {
  CommentSnippetFragment,
  VoteMutation,
  useVoteCommentMutation,
} from "../generated/graphql";
import { ApolloCache } from "@apollo/client";
import gql from "graphql-tag";
import { useRouter } from "next/router";

interface CommentUpvoteSectionProps {
  comment: CommentSnippetFragment;
  user: any;
}

const updateAfterVote = (
  value: number,
  commentId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Comment:" + commentId,
    fragment: gql`
      fragment _ on Comment {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) +
      (!data.voteStatus ? value : value - data.voteStatus);
    cache.writeFragment({
      id: "Comment:" + commentId,
      fragment: gql`
        fragment __ on Comment {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

export const CommentUpvoteSection: React.FC<CommentUpvoteSectionProps> = ({
  comment: comment,
  user,
}) => {
  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteCommentMutation();
  const router = useRouter();

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={5}>
      <IconButton
        onClick={async () => {
          if (!user) {
            router.push("/login");
            return;
          }
          if (comment.voteStatus === 1) {
            await vote({
              variables: {
                commentId: comment.id,
                value: 0,
              },
              update: (cache) => updateAfterVote(0, comment.id, cache),
            });
          } else {
            setLoadingState("upvote-loading");
            await vote({
              variables: {
                commentId: comment.id,
                value: 1,
              },
              update: (cache) => updateAfterVote(1, comment.id, cache),
            });
            setLoadingState("not-loading");
          }
        }}
        fontSize="15x"
        colorScheme={comment.voteStatus === 1 ? "blue" : undefined}
        isLoading={loadingState === "upvote-loading"}
        variant="ghost"
        isRound={true}
        aria-label="upvote comment"
        icon={<TriangleUpIcon />}
      />
      {comment.points}
      <IconButton
        onClick={async () => {
          if (!user) {
            router.push("/login");
            return;
          }
          if (comment.voteStatus === -1) {
            await vote({
              variables: {
                commentId: comment.id,
                value: 0,
              },
              update: (cache) => updateAfterVote(0, comment.id, cache),
            });
          } else {
            setLoadingState("downvote-loading");
            await vote({
              variables: {
                commentId: comment.id,
                value: -1,
              },
              update: (cache) => updateAfterVote(-1, comment.id, cache),
            });
            setLoadingState("not-loading");
          }
        }}
        fontSize="15px"
        colorScheme={comment.voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "downvote-loading"}
        variant="ghost"
        isRound={true}
        aria-label="downvote comment"
        icon={<TriangleDownIcon />}
      />
    </Flex>
  );
};
