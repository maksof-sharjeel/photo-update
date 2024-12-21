import { string, z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../[trpc]/trpc";
import { generateJwtToken } from "@/lib/services/jwt";
import { sendEmail } from "@/lib/services/sendEmail";
import { TRPCError } from "@trpc/server";
import {
  passwordResetTempEmail,
  resetPasswordEmail,
  verificationEmailTemp,
  welcomeEmailTemp,
} from "../../../../lib/services/emailTemp";
import { hashPassword, verifyPassword } from "@/lib/services/bcrypt";
import { log } from "console";

export const userAuth = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        password: z.string(),
        phoneNo: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.users.findFirst({
        where: { email: input.email },
      });
      if (user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email is already in use",
        });
      }
      const tokenPayload = { email: input.email };
      const token = await generateJwtToken(tokenPayload);

      const newUser = await ctx.prisma.users.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          password: await hashPassword(input.password),
          isVerified:true,
          phone: input.phoneNo,
        },
      });
      return {
     message:"User Register Successfully"
      };
    }),

  checkToken: publicProcedure
    .input(
      z.object({
        token: string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.sessions.findFirst({
        where: { sessionToken: input.token },
      })
      return user
    }),
  login: publicProcedure
    .input(
      z.object({
        email: string(),
        password: string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const loginUser = await ctx.prisma.users.findFirst({
        where: {
          email: input.email,
        },
      });
      if (!loginUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "No account found with this email. Please check your email or sign up.",
        });
      }
      const isTruePassword = await verifyPassword(
        input.password,
        loginUser.password
      );
      if (!isTruePassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid password. Please try again or reset your password.",
        });
      }
      const { password, ...userWithoutPassword } = loginUser;
      const tokenPayload = { email: loginUser.email };
      const token = await generateJwtToken(tokenPayload);
      const createSession = await ctx.prisma.sessions.create({
        data: {
          sessionToken: token,
          updatedAt: new Date(),
          userId: loginUser.id
        },
        select:{
          sessionToken:true
        }
      })
      return { message: "Login Successfully!", user:createSession  };
    }),

    logout: publicProcedure
    .input(
      z.object({
        sessionToken: string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createSession = await ctx.prisma.sessions.deleteMany({
        where:{
          sessionToken:input.sessionToken
        }
       
      })
      return { message: "LogOut Successfully!", user:createSession  };
    }),

});
