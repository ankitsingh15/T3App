import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db as prisma } from "../db";
import { getUserFromRequest } from "../auth";

type CreateContextOptions = {
  req: CreateNextContextOptions["req"] | NextRequest;
};

export const createTRPCContext = async (opts: CreateContextOptions) => {
  const user = await getUserFromRequest(opts.req);
  return {
    prisma,
    user,
    req: opts.req,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);