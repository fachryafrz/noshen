import { query } from "./_generated/server";
import { getUser } from "./utils";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);

    if (!user) return;

    return user;
  },
});
