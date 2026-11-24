import { Request, Response } from "express";
import { isDbConnected } from "../db";

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const connected = await isDbConnected();

  if (connected) {
    res.status(200).send("ok");
  } else {
    res.status(503).send("database unavailable");
  }
}
