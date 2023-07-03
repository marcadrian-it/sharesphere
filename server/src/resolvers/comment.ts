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

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() comment: Comment,
    @Ctx() { upvoteLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }

    const upvote = await upvoteLoader.load({
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
}
