import "reflect-metadata";
import "dotenv-safe/config";
import { COOKIE_NAME, __prod__ } from "./constants";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { ApolloServer } from "@apollo/server";
import http from "http";
import { buildSchema } from "type-graphql";
import { CommentResolver } from "./resolvers/comment";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import cors from "cors";
import { json } from "body-parser";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpvoteLoader } from "./utils/createUpvoteLoader";

import session from "express-session";
import RedisStore from "connect-redis";
import Redis from "ioredis";
import { MyContext } from "./types";
import { MyPostgresDataSource } from "./data-source";
import { createCommentLoader } from "./utils/createCommentLoader";

const main = async () => {
  await MyPostgresDataSource.initialize();
  await MyPostgresDataSource.runMigrations();

  const app = express();

  let redis = new Redis(process.env.REDIS_URL as string);

  let redisStore = new RedisStore({
    client: redis,
    disableTouch: true,
  });
  app.set("trust proxy", 1);
  app.use(
    cors<cors.CorsRequest>({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  const httpServer = http.createServer(app);

  app.use(
    session({
      name: COOKIE_NAME,
      store: redisStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__, // cookie only works in https
        sameSite: "strict", // csrf
        domain: __prod__ ? ".marcadrian.dev" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const server = new ApolloServer<MyContext>({
    schema: await buildSchema({
      resolvers: [CommentResolver, PostResolver, UserResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
        redis,
        userLoader: createUserLoader(),
        upvoteLoader: createUpvoteLoader(),
        commentLoader: createCommentLoader(),
      }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
};

main().catch((err) => {
  console.error(err);
});
