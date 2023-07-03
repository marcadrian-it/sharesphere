import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Comment } from "../entities/Comment";

@Resolver(Comment)
export class CommentResolver {
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
