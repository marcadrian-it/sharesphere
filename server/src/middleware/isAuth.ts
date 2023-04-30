import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  console.log("isAuth middleware called");
  if (!context.req.session.userId) {
    console.log("User not authenticated");
    throw new Error("not authenticated");
  }
  return next();
};
