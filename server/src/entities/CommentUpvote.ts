import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class CommentUpvote extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.commentupvotes)
  user: User;

  @PrimaryColumn()
  commentId: number;

  @ManyToOne(() => Comment, (comment) => comment.commentupvotes, {
    onDelete: "CASCADE",
  })
  comment: Comment;
}
