import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

const DEV_ADMIN: User = {
  id: 1,
  openId: "dev-admin-per-voi",
  name: "Responsable Per Voi",
  email: "contact@pervoi.tn",
  loginMethod: "local",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  // En local ou sans session externe, accès administrateur automatique
  if (!user) {
    user = DEV_ADMIN;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
