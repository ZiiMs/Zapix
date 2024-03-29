import type { IncomingHttpHeaders } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { buffer } from "micro";
import { Webhook, type WebhookRequiredHeaders } from "svix";

import { appRouter, createTRPCContext } from "@zapix/api";

import { env } from "../../../env.mjs";

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};

const handler = async (
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse,
) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);
  // Verify the webhook signature
  // See https://docs.svix.com/receiving/verifying-payloads/how
  const payload = (await buffer(req)).toString();
  const headers = req.headers;
  const wh = new Webhook(env.NEXT_PUBLIC_CLERK_WEBHOOK_SECRET);
  let evt: WebhookEvent;
  console.log("verifying secret");
  try {
    // res.send("verifying secret");
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
  // res.send("done verifying secret");
  console.log("done verifying secret", evt.type);

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const {
      id,
      first_name,
      last_name,
      username,
      email_addresses,
      profile_image_url,
      // birthday,
      // gender,
      // created_at,
      // updated_at,
      // last_sign_in_at,
    } = evt.data;

    if (!email_addresses[0]) return res.status(405).end("email not defined");
    const email = email_addresses[0].email_address;
    const emailVerified =
      email_addresses[0].verification?.status === "verified";
    // const createdAt: Date = new Date(created_at);
    // const updatedAt: Date = new Date(updated_at);
    // const lastSignInAt: Date = new Date(last_sign_in_at);

    try {
      console.log("attempt to call trpc", emailVerified);

      const user = await caller.user.upsert({
        id,
        name: `${first_name} ${last_name}`,
        username,
        email,
        emailVerified,
        image: profile_image_url,
      });
      console.log("User created", user);
      return res.status(200).end(`${eventType.toString()} event success`);
    } catch (error) {
      console.log(error);
      if (error instanceof TRPCError) {
        // An error from tRPC occured
        const httpCode = getHTTPStatusCodeFromError(error);
        return res.status(httpCode).json(error);
      }
      // Another error occured
      res.status(500).json({ message: "Internal server error" });
    }
  } else if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (!id) {
      console.log("Invalid ID");
      return res
        .status(405)
        .end("Failed to delete user. Most propably user does not exists");
    }
    try {
      await caller.user.delete({ id });
      console.log("User Deleted");
      return res.status(200).end("user deleted");
    } catch (error) {
      console.error(error);

      if (error instanceof TRPCError) {
        // An error from tRPC occured
        const httpCode = getHTTPStatusCodeFromError(error);
        return res.status(httpCode).json(error);
      }
      // Another error occured
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Important! do not remove
// Disable the bodyParser so we can access the raw
// request body for verification.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
