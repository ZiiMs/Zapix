import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession as $getServerSession } from "next-auth";

import { authOptions } from "./auth-options";

export const getServerSession = (ctx: { req: any; res: any }) => {
  return $getServerSession(ctx.req, ctx.res, authOptions);
};
