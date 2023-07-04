import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";
import { createPostUpvoteLoader } from "./utils/createUpvoteLoader";
import { createCommentUpvoteLoader } from "./utils/createUpvoteLoader";
import { createCommentLoader } from "./utils/createCommentLoader";

export type MyContext = {
  req: Request & {
    session: Session;
  };
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  postUpvoteLoader: ReturnType<typeof createPostUpvoteLoader>;
  commentUpvoteLoader: ReturnType<typeof createCommentUpvoteLoader>;
  commentLoader: ReturnType<typeof createCommentLoader>;
};

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
