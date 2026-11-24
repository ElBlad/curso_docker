import { NextFunction, Request, Response } from "express";
import { query } from "../db";

type User = {
  id: string;
  name: string;
};

export async function postLogin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const body: unknown = req.body;

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const { username, password } = body as Record<string, unknown>;
  if (
    typeof username !== "string" ||
    username.length === 0 ||
    typeof password !== "string" ||
    password.length === 0
  ) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  try {
    const result = await query<User>(
      "SELECT id, name FROM users WHERE name = $1 AND password = $2 LIMIT 1",
      [username, password],
    );
    const user = result.rows[0];

    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}
