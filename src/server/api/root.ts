import { createTRPCRouter } from "@/server/api/trpc";
import { listItemsRouter } from "@/server/api/routers/listitems";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  items: listItemsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
