import React, { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import {
  PostSnippetFragment,
  VoteMutation,
  useVoteMutation,
} from "../generated/graphql";
import { ApolloCache } from "@apollo/client";
import gql from "graphql-tag";

interface UpvoteSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
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
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={5}>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            await vote({
              variables: {
                postId: post.id,
                value: 0,
              },
              update: (cache) => updateAfterVote(0, post.id, cache),
            });
          } else {
            setLoadingState("upvote-loading");
            await vote({
              variables: {
                postId: post.id,
                value: 1,
              },
              update: (cache) => updateAfterVote(1, post.id, cache),
            });
            setLoadingState("not-loading");
          }
        }}
        fontSize="22px"
        colorScheme={post.voteStatus === 1 ? "blue" : undefined}
        isLoading={loadingState === "upvote-loading"}
        variant="ghost"
        isRound={true}
        aria-label="upvote post"
        icon={<TriangleUpIcon />}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
            await vote({
              variables: {
                postId: post.id,
                value: 0,
              },
              update: (cache) => updateAfterVote(0, post.id, cache),
            });
          } else {
            setLoadingState("downvote-loading");
            await vote({
              variables: {
                postId: post.id,
                value: -1,
              },
              update: (cache) => updateAfterVote(-1, post.id, cache),
            });
            setLoadingState("not-loading");
          }
        }}
        fontSize="22px"
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "downvote-loading"}
        variant="ghost"
        isRound={true}
        aria-label="downvote post"
        icon={<TriangleDownIcon />}
      />
    </Flex>
  );
};
