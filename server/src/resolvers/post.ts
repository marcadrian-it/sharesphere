import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Field,
  InputType,
  Ctx,
  UseMiddleware,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { MyPostgresDataSource } from "../data-source";
import { Int } from "type-graphql";
import { PostUpvote } from "../entities/PostUpvote";
import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
  @Field()
  imageUrl: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 50);
  }

  @FieldResolver(() => User)
  author(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.authorId);
  }

  @FieldResolver(() => [Comment], { nullable: true })
  async comments(@Root() post: Post, @Ctx() { commentLoader }: MyContext) {
    const comments = await commentLoader.load(post.id);
    return comments || [];
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { postUpvoteLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }

    const upvote = await postUpvoteLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });

    return upvote ? upvote.value : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const realValue = value === 1 ? 1 : value === -1 ? -1 : 0;
    const { userId } = req.session;

    const upvote = await PostUpvote.findOne({
      where: { postId, userId },
    });

    // the user has voted on the post before
    // and they are changing their vote
    if (upvote && upvote.value !== realValue) {
      await MyPostgresDataSource.transaction(async (tm) => {
        if (realValue === 0) {
          await tm.query(
            `
            delete from post_upvote
            where "postId" = $1 and "userId" = $2
            `,
            [postId, userId]
          );
        } else {
          await tm.query(
            `
            update post_upvote
            set value = $1
            where "postId" = $2 and "userId" = $3
            `,
            [realValue, postId, userId]
          );
        }
        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2
          `,
          [realValue - upvote.value, postId]
        );
      });
    } else if (!upvote && realValue !== 0) {
      // has never voted before
      await MyPostgresDataSource.transaction(async (tm) => {
        await tm.query(
          `
          insert into post_upvote ("userId", "postId", value)
          values ($1, $2, $3);
          `,
          [userId, postId, realValue]
        );
        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2
          `,
          [realValue, postId]
        );
      });
    }

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await MyPostgresDataSource.query(
      `
    select p.* 
    from post p 
    ${cursor ? `where p."createdAt" < $2` : ""}
    order by p."createdAt" DESC
    limit $1
  `,
      replacements
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | null> {
    return Post.findOne({ where: { id }, relations: ["author", "comments"] });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    if (!input.imageUrl) {
      input.imageUrl = " https://via.placeholder.com/600";
    }
    const post = Post.create({
      ...input,
      authorId: req.session.userId,
    }).save();

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Arg("imageUrl") imageUrl: string,
    @Arg("prevImagePublicId", { nullable: true }) prevImagePublicId: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const result = await MyPostgresDataSource.createQueryBuilder()
      .update(Post)
      .set({ title, text, imageUrl })
      .where('id = :id and "authorId" = :authorId', {
        id,
        authorId: req.session.userId,
      })
      .returning("*")
      .execute();

    // Delete the previous Cloudinary image if there was one
    if (prevImagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(prevImagePublicId);
      } catch (error) {
        console.error(error);
      }
    }

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Arg("imageId", () => String) imageId: string,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    // Delete the image using the provided image ID
    if (imageId) {
      try {
        await cloudinary.v2.uploader.destroy(imageId);
      } catch (error) {
        console.error(error);
      }
    }

    // Delete the post from the database
    await Post.delete({ id, authorId: req.session.userId });
    return true;
  }
}
