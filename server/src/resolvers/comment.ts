import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import { CommentUpvote } from "../entities/CommentUpvote";
import { MyPostgresDataSource } from "../data-source";

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => User)
  author(@Root() comment: Comment, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(comment.authorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() comment: Comment,
    @Ctx() { commentUpvoteLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }

    const upvote = await commentUpvoteLoader.load({
      commentId: comment.id,
      userId: req.session.userId,
    });

    return upvote ? upvote.value : null;
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async addComment(
    @Arg("postId", () => Int) postId: number,
    @Arg("text", () => String) text: string,
    @Ctx() { req }: MyContext
  ): Promise<Comment> {
    const authorId = req.session.userId;
    const comment = Comment.create({ postId, text, authorId });
    await comment.save();
    return comment;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async voteComment(
    @Arg("commentId", () => Int) commentId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const realValue = value === 1 ? 1 : value === -1 ? -1 : 0;
    const { userId } = req.session;

    const upvote = await CommentUpvote.findOne({
      where: { commentId, userId },
    });

    // the user has voted on the comment before
    // and they are changing their vote
    if (upvote && upvote.value !== realValue) {
      await MyPostgresDataSource.transaction(async (tm) => {
        if (realValue === 0) {
          await tm.query(
            `
            delete from comment_upvote
            where "commentId" = $1 and "userId" = $2
            `,
            [commentId, userId]
          );
        } else {
          await tm.query(
            `
            update comment_upvote
            set value = $1
            where "commentId" = $2 and "userId" = $3
            `,
            [realValue, commentId, userId]
          );
        }
        await tm.query(
          `
          update comment
          set points = points + $1
          where id = $2
          `,
          [realValue - upvote.value, commentId]
        );
      });
    } else if (!upvote && realValue !== 0) {
      // has never voted before
      await MyPostgresDataSource.transaction(async (tm) => {
        await tm.query(
          `
          insert into comment_upvote ("userId", "commentId", value)
          values ($1, $2, $3);
          `,
          [userId, commentId, realValue]
        );
        await tm.query(
          `
          update comment
          set points = points + $1
          where id = $2
          `,
          [realValue, commentId]
        );
      });
    }

    return true;
  }
}
