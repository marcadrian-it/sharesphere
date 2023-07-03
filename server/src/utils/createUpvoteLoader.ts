import DataLoader from "dataloader";
import { Upvote } from "../entities/Upvote";

export const createUpvoteLoader = () =>
  new DataLoader<
    { postId?: number; commentId?: number; userId: number },
    Upvote | null
  >(async (keys) => {
    const upvotes = await Upvote.findBy(keys as any);
    const upvoteIdsToUpvote: Record<string, Upvote> = {};
    upvotes.forEach((upvote) => {
      if (upvote.postId) {
        upvoteIdsToUpvote[`${upvote.userId}|${upvote.postId}`] = upvote;
      } else if (upvote.commentId) {
        upvoteIdsToUpvote[`${upvote.userId}|${upvote.commentId}`] = upvote;
      }
    });

    return keys.map((key) =>
      key.postId
        ? upvoteIdsToUpvote[`${key.userId}|${key.postId}`]
        : upvoteIdsToUpvote[`${key.userId}|${key.commentId}`]
    );
  });
