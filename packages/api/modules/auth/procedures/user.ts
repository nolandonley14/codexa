import { TeamMembershipModel, TeamModel, UserModel } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const user = publicProcedure
  .input(z.void())
  .output(
    UserModel.pick({
      id: true,
      email: true,
      role: true,
      avatar_url: true,
      name: true,
    })
      .extend({
        teamMemberships: z
          .array(
            TeamMembershipModel.extend({
              team: TeamModel,
            }),
          )
          .nullable(),
      })
      .nullable(),
  )
  .query(async ({ ctx: { user, teamMemberships } }) => {
    if (!user) return null;

    return {
      ...user,
      id: user.userId,
      teamMemberships,
    };
  });
