import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../[trpc]/trpc";

export const manageUploads = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        base64url: z.string(),
        userId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const photoUpload = await ctx.prisma.photo.create({
        data: {
          url: input.base64url,
          userId: input.userId
        }
      })
      return photoUpload
    }),
  createComment: publicProcedure
    .input(
      z.object({
        content: z.string(),
        photoId: z.string(),
        userId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          photoId: input.photoId,
          userId: input.userId
        }
      })
      return comment
    }),
  getAll: publicProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.photo.findMany({
        where: {
          userId: input.userId
        },
        include:{
          comments:true,
          user:true
        }
      })
      return comment
    }),

});
