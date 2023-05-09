import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/api";
import { TRPCError } from "@trpc/server";

const filterClerkUserData = (user: User) => {
    return {
        id: user.id,
        username: user.username,
    }
}

export const listItemsRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const items = await ctx.prisma.listItem.findMany();
        const users = (await clerkClient.users.getUserList({
            userId: items.map((item) => item.userId),
        })).map(filterClerkUserData);

        return items.map((item) => {
            const author = users.find((user) => user.id === item.userId);

            if (!author || !author.username) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Author not found" });
            }
            return {
                item,
                author: {
                    // don't lose username type
                    ...author,
                    username: author?.username,
                }
            };
        });
    }),
});