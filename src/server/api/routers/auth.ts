import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
      });
      return { success: true, userId: user.id };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("Login attempt for email:", input.email);
        const user = await ctx.prisma.user.findUnique({ where: { email: input.email } });
        console.log("User found:", user ? "Yes" : "No");
        if (!user) throw new Error("User not found");
        const validPassword = await bcrypt.compare(input.password, user.password);
        console.log("Password valid:", validPassword);
        if (!validPassword) throw new Error("Invalid password");
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
        return { token, userId: user.id };
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    }),

  getCategories: protectedProcedure
    .input(z.object({ page: z.number().int().positive(), limit: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      try {
        const { page, limit } = input;
      const skip = (page - 1) * limit;
      const categories = await ctx.prisma.category.findMany({
        skip,
        take: limit,
      });
      const total = await ctx.prisma.category.count();
      return { categories, total };
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
      
    }),
    getUserCategories: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        include: { categories: true },
      });
      return user?.categories || [];
    }),

  updateUserCategories: protectedProcedure
    .input(z.object({ categoryIds: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          categories: {
            set: input.categoryIds.map(id => ({ id })),
          },
        },
      });
      return { success: true };
    }),
});