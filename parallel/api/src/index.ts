import app from "./app";
import { env } from "./config/env";
import { closeDb, isDbConnected } from "./db";

async function main() {
  const dbOk = await isDbConnected();
  if (!dbOk) {
    console.warn("Warning: could not reach the database at startup.");
  }

  const server = app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await closeDb();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
