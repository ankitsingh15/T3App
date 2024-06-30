import type { NextApiRequest } from "next";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { db as prisma } from "./db";

export const getUserFromRequest = async (req: NextApiRequest | NextRequest) => {
  let token: string | undefined;

  if ('headers' in req) {
    if (req.headers instanceof Headers) {
      // NextRequest (App Router)
      console.log("header is ",req.headers);
      token = req.headers.get("authorization")?.split(" ")[1];
    } else {
      // NextApiRequest (Pages Router)
      token = req.headers.authorization?.split(" ")[1];
    }
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    return user;
  } catch (error) {
    return null;
  }
};