import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { Comment } from "./Comment";

//many to many relationship
//user <-> posts
// several users can upvote the same post
// user -> join table <- posts
// user -> upvote <- posts

@Entity()
export class Upvote extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.upvotes)
  user: User;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.upvotes, {
    onDelete: "CASCADE",
  })
  post: Post;

  @Column()
  commentId: number;

  @ManyToOne(() => Comment, (comment) => comment.upvotes, {
    onDelete: "CASCADE",
  })
  comment: Comment;
}
