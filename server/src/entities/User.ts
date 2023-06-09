import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { CommentUpvote } from "./CommentUpvote";
import { PostUpvote } from "./PostUpvote";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => CommentUpvote, (commentupvote) => commentupvote.user)
  commentupvotes: CommentUpvote[];

  @OneToMany(() => PostUpvote, (postupvote) => postupvote.user)
  postupvotes: PostUpvote[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
