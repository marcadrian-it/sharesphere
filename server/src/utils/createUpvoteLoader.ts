import DataLoader from "dataloader";
import { PostUpvote } from "../entities/PostUpvote";
import { CommentUpvote } from "../entities/CommentUpvote";

export const createPostUpvoteLoader = () =>
  new DataLoader<{ postId: number; userId: number }, PostUpvote | null>(
    async (keys) => {
      const postUpvotes = await PostUpvote.findBy(keys as any);
      const postUpvoteIdsToUpvote: Record<string, PostUpvote> = {};
      postUpvotes.forEach((upvote) => {
        postUpvoteIdsToUpvote[`${upvote.userId}|${upvote.postId}`] = upvote;
      });

      return keys.map(
        (key) => postUpvoteIdsToUpvote[`${key.userId}|${key.postId}`]
      );
    }
  );

export const createCommentUpvoteLoader = () =>
  new DataLoader<{ commentId: number; userId: number }, CommentUpvote | null>(
    async (keys) => {
      const commentUpvotes = await CommentUpvote.findBy(keys as any);
      const commentUpvoteIdsToUpvote: Record<string, CommentUpvote> = {};
      commentUpvotes.forEach((upvote) => {
        commentUpvoteIdsToUpvote[`${upvote.userId}|${upvote.commentId}`] =
          upvote;
      });

      return keys.map(
        (key) => commentUpvoteIdsToUpvote[`${key.userId}|${key.commentId}`]
      );
    }
  );
