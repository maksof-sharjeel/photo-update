import { userAuth } from "./routes/userAuth";
import { createTRPCRouter, publicProcedure } from "./[trpc]/trpc";
import { manageUploads } from "./routes/mangeUploads";

export const appRouter = createTRPCRouter({
  userAuth: userAuth,
  manageUploads:manageUploads,
  hello: publicProcedure.query(() => "Hello World"),
});

export type AppRouter = typeof appRouter;
