import { publicProcedure, router } from "./trpc";
import { AuthCredentialsValidator } from "../lib/validators/accountCredentialsValidator";
import { getPayloadClient } from "../getPayload";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayloadClient();

      // check if the user exists
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });
      if (users.length !== 0) throw new TRPCError({ code: "CONFLICT" });

      // create user
      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });
      // this operation will trigger a verification email to be sent

      return { success: true, sentToEmail: email };
    }),
});
