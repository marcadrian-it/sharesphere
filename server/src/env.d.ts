declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REDIS_URL: string;
      REDIS_PORT: string;
      SESSION_SECRET: string;
      CORS_ORIGIN: string;
    }
  }
}

export {}
