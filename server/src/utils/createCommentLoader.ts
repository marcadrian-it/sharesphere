import DataLoader from "dataloader";
import { In } from "typeorm";
import { Comment } from "../entities/Comment";

export const createCommentLoader = () =>
  new DataLoader<number, Comment[]>(async (postIds) => {
    const comments = await Comment.find({
      where: { postId: In(postIds as number[]) },
    });
    const postIdToComments: Record<number, Comment[]> = {};
    comments.forEach((c) => {
      if (c.postId in postIdToComments) {
        postIdToComments[c.postId].push(c);
      } else {
        postIdToComments[c.postId] = [c];
      }
    });

    const sortedComments = postIds.map(
      (postId) => postIdToComments[postId] || []
    );
    return sortedComments;
  });
