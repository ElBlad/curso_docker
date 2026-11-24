import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const database = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: required("DATABASE_HOST"),
      port: Number(process.env.DATABASE_PORT ?? 5432),
      database: required("DATABASE_NAME"),
      user: required("DATABASE_USER"),
      password: required("DATABASE_PASSWORD"),
    };

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  database,
};
