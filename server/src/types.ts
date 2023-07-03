import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpvoteLoader } from "./utils/createUpvoteLoader";
import { createCommentLoader } from "./utils/createCommentLoader";

export type MyContext = {
  req: Request & {
    session: Session;
  };
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  upvoteLoader: ReturnType<typeof createUpvoteLoader>;
  commentLoader: ReturnType<typeof createCommentLoader>;
};

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
