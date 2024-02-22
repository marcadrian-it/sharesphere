# Sharesphere

TS + GraphQL website resembling Reddit

To visit the website, click on the logo.

<a href="http://marcadrian.dev">
  <p align="center">
    <img height=80 src="https://raw.githubusercontent.com/marcadrian-it/sharesphere/main/client/sharesphere.png"/>
  </p>
</a>

<p align="center">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/marcadrian-it/sharesphere?style=flat-square">
  <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/marcadrian-it/sharesphere?style=flat-square">
</p>

# Stack

## Shared

- [TypeScript](https://www.typescriptlang.org/)
- [Apollo GraphQL](https://www.apollographql.com/) / [URQL](https://formidable.com/open-source/urql/)
- [NodeJSv18](https://nodejs.org/en/)
- [Yarn v1.22.19](https://yarnpkg.com/)
- [ESLint](https://eslint.org/)

## Backend

- [Express](https://expressjs.com/)
- [Redis](https://redis.io/)
- [TypeORM](https://typeorm.io/#/)
- [PostgreSQL](https://www.postgresql.org/)
- [Argon2](https://github.com/P-H-C/phc-winner-argon2)
- [Docker](https://www.docker.com/)
- [Dokku](https://dokku.com/)

## Frontend

- [Vercel](https://vercel.com/)
- [NextJS](https://nextjs.org/)
- [ChakraUI](https://chakra-ui.com/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)

## CDN

- [Cloudinary](https://cloudinary.com/)

## Instructions

- `npm run gen-env` - generates TypeScript types for environment variables based on the .env file.
- `npm run build` - compiles the TypeScript code into JavaScript using the TypeScript compiler.
- `npm run dev` - runs the compiled JavaScript code using nodemon.
- `npm run lint` - will run ESLint with --fix to auto-fix issues.
- `npm run lint:check` - will run ESLint without --fix to check for issues.
- `npm run start-dbs.sh` - runs the start-dbs.sh shell script to start Redis and PostgreSQL dbs.
- Sync schema directly from dist folder.
  Example: `npx typeorm schema:sync -d ./dist/data-source.js`

## Preview

https://user-images.githubusercontent.com/22295674/236194071-5debc1b5-3b1a-45ed-854d-5587aa007778.mp4
