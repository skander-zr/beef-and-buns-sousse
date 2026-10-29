// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
var OAUTH_STATE_COOKIE = "__Host-oauth_state";
var decodeOAuthState = (state) => {
  let decoded;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
  }
  return { redirectUri: decoded };
};

// server/_core/oauth.ts
import { parse as parseCookieHeader2 } from "cookie";

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var menuItems = mysqlTable("menu_items", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 80 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description"),
  priceDt: int("priceDt").notNull(),
  active: boolean("active").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var slotControls = mysqlTable("slot_controls", {
  id: int("id").autoincrement().primaryKey(),
  serviceDate: varchar("serviceDate", { length: 10 }).notNull(),
  serviceTime: varchar("serviceTime", { length: 5 }).notNull(),
  status: mysqlEnum("status", ["available", "full", "closed"]).default("available").notNull(),
  note: varchar("note", { length: 255 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var reservations = mysqlTable("reservations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  email: varchar("email", { length: 320 }),
  serviceDate: varchar("serviceDate", { length: 10 }).notNull(),
  serviceTime: varchar("serviceTime", { length: 5 }).notNull(),
  guests: int("guests").notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  orderType: mysqlEnum("orderType", ["pickup", "delivery"]).default("pickup").notNull(),
  address: text("address"),
  notes: text("notes"),
  totalDt: int("totalDt").notNull(),
  status: mysqlEnum("status", ["new", "accepted", "preparing", "ready", "completed", "cancelled"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  menuItemId: int("menuItemId"),
  name: varchar("name", { length: 160 }).notNull(),
  unitPriceDt: int("unitPriceDt").notNull(),
  quantity: int("quantity").notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN ?? "",
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? "",
  whatsappHostPhone: process.env.WHATSAPP_HOST_PHONE ?? "21628151503",
  callmebotApiKey: process.env.CALLMEBOT_API_KEY ?? "",
  whatsappTemplateName: process.env.WHATSAPP_TEMPLATE_NAME ?? "per_voi_new_event",
  whatsappTemplateLanguage: process.env.WHATSAPP_TEMPLATE_LANGUAGE ?? "fr",
  whatsappApiVersion: process.env.WHATSAPP_API_VERSION ?? "v23.0",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "9194319608:AAFh739rW2GzXpyVB14BCWN1gfKzJ4KQ3_k",
  telegramChatId: process.env.TELEGRAM_CHAT_ID ?? "6048748092"
};

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    return decodeOAuthState(state).redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    let sessionToken = cookies.get(COOKIE_NAME);
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.slice(7);
      }
    }
    const session = await this.verifySession(sessionToken);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader2(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/restaurant.ts
import { and, asc, desc, eq as eq2, inArray, sql } from "drizzle-orm";
import { z as z2 } from "zod";

// server/localStore.ts
import fs from "fs";
import path from "path";
var INITIAL_MENU_ITEMS = [
  // --- SMASH BURGERS ---
  {
    category: "Smash Burgers",
    name: "Truffle Mushroom",
    description: "Double smash beef patty, american cheese, grilled mushrooms, truffle mayo, rocket salad, artisanal potato bun.",
    priceDt: 29.5,
    active: true,
    sortOrder: 1
  },
  {
    category: "Smash Burgers",
    name: "OG Smash",
    description: "Double smash beef patty, american cheese, grilled caramelized onions, signature OG sauce, artisanal potato bun.",
    priceDt: 22.7,
    active: true,
    sortOrder: 2
  },
  {
    category: "Smash Burgers",
    name: "OG Smash Oklahoma",
    description: "Double smash beef patty smash\xE9 avec fines lamelles d'oignons caram\xE9lis\xE9s, double american cheese, sauce OG, potato bun.",
    priceDt: 22.7,
    active: true,
    sortOrder: 3
  },
  {
    category: "Smash Burgers",
    name: "Hot Smash",
    description: "Double smash beef patty, american cheese, jalape\xF1os \xE9pic\xE9s, sauce hot \xE9pic\xE9e maison, oignons caram\xE9lis\xE9s, potato bun.",
    priceDt: 25,
    active: true,
    sortOrder: 4
  },
  // --- CRISPY CHICKEN ---
  {
    category: "Crispy Chicken",
    name: "OG Chicken",
    description: "Filet de poulet croustillant pan\xE9 minute, coleslaw frais cr\xE9meux, sauce signature OG, artisanal potato bun.",
    priceDt: 17.5,
    active: true,
    sortOrder: 5
  },
  {
    category: "Crispy Chicken",
    name: "Classic Chicken",
    description: "Filet de poulet pan\xE9 croustillant, salade croquante, rondelles de tomate fra\xEEche, oignons rouges, mayonnaise maison, potato bun.",
    priceDt: 17.5,
    active: true,
    sortOrder: 6
  },
  {
    category: "Crispy Chicken",
    name: "Hot Chicken",
    description: "Filet de poulet pan\xE9 \xE9pic\xE9 croustillant, rondelles de jalape\xF1os marin\xE9s, sauce hot \xE9pic\xE9e, coleslaw cr\xE9meux, potato bun.",
    priceDt: 20,
    active: true,
    sortOrder: 7
  },
  // --- CHICKEN TENDERS ---
  {
    category: "Chicken Tenders",
    name: "Chicken Tenders (2 Pi\xE8ces)",
    description: "2 aiguillettes de poulet marin\xE9es ultra-croustillantes dor\xE9es \xE0 la perfection avec 1 sauce au choix.",
    priceDt: 6,
    active: true,
    sortOrder: 8
  },
  {
    category: "Chicken Tenders",
    name: "Chicken Tenders (4 Pi\xE8ces)",
    description: "4 aiguillettes de poulet marin\xE9es ultra-croustillantes dor\xE9es \xE0 la perfection avec 1 sauce au choix.",
    priceDt: 12,
    active: true,
    sortOrder: 9
  },
  {
    category: "Chicken Tenders",
    name: "Chicken Tenders (8 Pi\xE8ces)",
    description: "8 aiguillettes de poulet marin\xE9es ultra-croustillantes dor\xE9es \xE0 la perfection avec 2 sauces au choix.",
    priceDt: 22,
    active: true,
    sortOrder: 10
  },
  // --- FRITES & SIDES ---
  {
    category: "Frites & Sides",
    name: "Frites Crinkle Croustillantes",
    description: "Frites ondul\xE9es ultra-croustillantes et dor\xE9es, assaisonn\xE9es au sel d'\xE9pices Beef & Buns.",
    priceDt: 3,
    active: true,
    sortOrder: 11
  },
  // --- EXTRAS & SAUCES ---
  {
    category: "Extras & Sauces",
    name: "Extra Smash Patty (B\u0153uf)",
    description: "Steak de b\u0153uf smash\xE9 suppl\xE9mentaire 100% pur b\u0153uf.",
    priceDt: 6,
    active: true,
    sortOrder: 12
  },
  {
    category: "Extras & Sauces",
    name: "Bacon de B\u0153uf Croustillant",
    description: "Tranches de bacon de b\u0153uf grill\xE9es croustillantes.",
    priceDt: 5,
    active: true,
    sortOrder: 13
  },
  {
    category: "Extras & Sauces",
    name: "Pastrami B\u0153uf Artisanal",
    description: "Tranches de pastrami de b\u0153uf artisanal grill\xE9 \xE0 la plancha.",
    priceDt: 5,
    active: true,
    sortOrder: 14
  },
  {
    category: "Extras & Sauces",
    name: "Tranche American Cheese",
    description: "Fromage am\xE9ricain fondant suppl\xE9mentaire.",
    priceDt: 3,
    active: true,
    sortOrder: 15
  },
  {
    category: "Extras & Sauces",
    name: "Smoked Cheese (Fum\xE9)",
    description: "Tranche de fromage fum\xE9 cr\xE9meux.",
    priceDt: 3,
    active: true,
    sortOrder: 16
  },
  {
    category: "Extras & Sauces",
    name: "Champignons Saut\xE9s Grill\xE9s",
    description: "Portion de champignons frais revenus au beurre et herbes.",
    priceDt: 3,
    active: true,
    sortOrder: 17
  },
  {
    category: "Extras & Sauces",
    name: "Sauce Truffle Mayo",
    description: "Mayonnaise onctueuse infus\xE9e \xE0 la truffe noire d'Italie.",
    priceDt: 3,
    active: true,
    sortOrder: 18
  },
  {
    category: "Extras & Sauces",
    name: "Sauce Hot Spicy Maison",
    description: "Sauce piquante artisanale aux piments fum\xE9s.",
    priceDt: 3.5,
    active: true,
    sortOrder: 19
  },
  {
    category: "Extras & Sauces",
    name: "Sauce OG Signature",
    description: "Notre sauce secr\xE8te culte, douce, relev\xE9e et fum\xE9e.",
    priceDt: 2.5,
    active: true,
    sortOrder: 20
  },
  {
    category: "Extras & Sauces",
    name: "Jalape\xF1os \xC9pic\xE9s",
    description: "Rondelles de piments jalape\xF1os croquants marin\xE9s.",
    priceDt: 2.5,
    active: true,
    sortOrder: 21
  },
  {
    category: "Extras & Sauces",
    name: "Pickles Croquants",
    description: "Rondelles de cornichons marin\xE9s \xE0 l'aneth maison.",
    priceDt: 2,
    active: true,
    sortOrder: 22
  },
  // --- BOISSONS ---
  {
    category: "Boissons",
    name: "Coca-Cola / Zero (33cl)",
    description: "Canette fra\xEEche 33cl servie frapp\xE9e.",
    priceDt: 3,
    active: true,
    sortOrder: 23
  },
  {
    category: "Boissons",
    name: "Boga Cidre / Boga Lim (33cl)",
    description: "Boisson gazeuse tunisienne embl\xE9matique bien fra\xEEche.",
    priceDt: 3,
    active: true,
    sortOrder: 24
  },
  {
    category: "Boissons",
    name: "Fanta Orange / Sprite (33cl)",
    description: "Canette fra\xEEche 33cl.",
    priceDt: 3,
    active: true,
    sortOrder: 25
  },
  {
    category: "Boissons",
    name: "Eau Min\xE9rale 0.5L",
    description: "Bouteille 0.5L servie fra\xEEche.",
    priceDt: 1.5,
    active: true,
    sortOrder: 26
  },
  {
    category: "Boissons",
    name: "Eau Min\xE9rale 1L",
    description: "Bouteille 1L servie fra\xEEche.",
    priceDt: 3,
    active: true,
    sortOrder: 27
  }
];
var DATA_DIR = path.resolve(import.meta.dirname, "../data");
var DATA_FILE = path.join(DATA_DIR, "local_db.json");
function loadState() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return data;
    }
  } catch (err) {
    console.warn("[LocalStore] Warning loading data, resetting to defaults:", err);
  }
  const items = INITIAL_MENU_ITEMS.map((item, index) => ({
    ...item,
    id: index + 1
  }));
  const initial = {
    menuItems: items,
    reservations: [],
    orders: [],
    orderItems: [],
    slotControls: [],
    nextId: {
      menu: items.length + 1,
      reservation: 1,
      order: 1,
      orderItem: 1,
      slot: 1
    }
  };
  saveState(initial);
  return initial;
}
function saveState(state) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("[LocalStore] Error saving state:", err);
  }
}
var LocalStore = class {
  state;
  constructor() {
    this.state = loadState();
  }
  // --- MENU ---
  getMenuItems(onlyActive = true) {
    const items = onlyActive ? this.state.menuItems.filter((i) => i.active) : this.state.menuItems;
    return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  }
  upsertMenuItem(input) {
    if (input.id) {
      const idx = this.state.menuItems.findIndex((i) => i.id === input.id);
      if (idx !== -1) {
        this.state.menuItems[idx] = {
          ...this.state.menuItems[idx],
          category: input.category,
          name: input.name,
          description: input.description ?? null,
          priceDt: input.priceDt,
          active: input.active ?? true,
          sortOrder: input.sortOrder ?? 0
        };
        saveState(this.state);
        return { id: input.id };
      }
    }
    const newId = this.state.nextId.menu++;
    const newItem = {
      id: newId,
      category: input.category,
      name: input.name,
      description: input.description ?? null,
      priceDt: input.priceDt,
      active: input.active ?? true,
      sortOrder: input.sortOrder ?? 0
    };
    this.state.menuItems.push(newItem);
    saveState(this.state);
    return { id: newId };
  }
  toggleMenuItem(id, active) {
    const item = this.state.menuItems.find((i) => i.id === id);
    if (item) {
      item.active = active;
      saveState(this.state);
    }
  }
  // --- AVAILABILITY / SLOTS ---
  getSlotControls(serviceDate) {
    return this.state.slotControls.filter((s) => s.serviceDate === serviceDate);
  }
  setSlotControl(input) {
    const existing = this.state.slotControls.find(
      (s) => s.serviceDate === input.serviceDate && s.serviceTime === input.serviceTime
    );
    if (existing) {
      existing.status = input.status;
      existing.note = input.note ?? null;
    } else {
      this.state.slotControls.push({
        id: this.state.nextId.slot++,
        serviceDate: input.serviceDate,
        serviceTime: input.serviceTime,
        status: input.status,
        note: input.note ?? null
      });
    }
    saveState(this.state);
  }
  getBookedGuests(serviceDate, serviceTime) {
    return this.state.reservations.filter(
      (r) => r.serviceDate === serviceDate && r.serviceTime === serviceTime && (r.status === "pending" || r.status === "confirmed")
    ).reduce((sum, r) => sum + r.guests, 0);
  }
  // --- RESERVATIONS ---
  createReservation(input) {
    const id = this.state.nextId.reservation++;
    const res = {
      id,
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      serviceDate: input.serviceDate,
      serviceTime: input.serviceTime,
      guests: input.guests,
      notes: input.notes ?? null,
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.state.reservations.push(res);
    saveState(this.state);
    return { id, status: "pending" };
  }
  getReservations(serviceDate) {
    let list = this.state.reservations;
    if (serviceDate) {
      list = list.filter((r) => r.serviceDate === serviceDate);
    }
    return [...list].sort(
      (a, b) => b.serviceDate.localeCompare(a.serviceDate) || a.serviceTime.localeCompare(b.serviceTime) || b.createdAt.localeCompare(a.createdAt)
    );
  }
  updateReservationStatus(id, status) {
    const res = this.state.reservations.find((r) => r.id === id);
    if (res) {
      res.status = status;
      saveState(this.state);
    }
  }
  // --- ORDERS ---
  createOrder(input) {
    const orderId = this.state.nextId.order++;
    const menuMap = new Map(this.state.menuItems.map((m) => [m.id, m]));
    const orderLines = [];
    let totalDt = 0;
    for (const item of input.items) {
      const menuItem = menuMap.get(item.menuItemId);
      if (!menuItem) {
        throw new Error("Un article du panier n'est plus disponible.");
      }
      const lineTotal = menuItem.priceDt * item.quantity;
      totalDt += lineTotal;
      orderLines.push({
        id: this.state.nextId.orderItem++,
        orderId,
        menuItemId: menuItem.id,
        name: menuItem.name,
        unitPriceDt: menuItem.priceDt,
        quantity: item.quantity
      });
    }
    const order = {
      id: orderId,
      customerName: input.customerName,
      phone: input.phone,
      orderType: input.orderType,
      address: input.address ?? null,
      notes: input.notes ?? null,
      totalDt,
      status: "new",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.state.orders.push(order);
    this.state.orderItems.push(...orderLines);
    saveState(this.state);
    return { id: orderId, totalDt, status: "new" };
  }
  getOrders(status) {
    let list = this.state.orders;
    if (status) {
      list = list.filter((o) => o.status === status);
    }
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  getOrderItems(orderId) {
    return this.state.orderItems.filter((i) => i.orderId === orderId);
  }
  updateOrderStatus(id, status) {
    const order = this.state.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      saveState(this.state);
    }
  }
  recordVisit() {
    if (!this.state.visits) {
      this.state.visits = [];
    }
    const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    this.state.visits.push({ date, timestamp: Date.now() });
    if (this.state.visits.length > 5e3) {
      this.state.visits = this.state.visits.slice(-5e3);
    }
    saveState(this.state);
  }
  getVisitStats() {
    const list = this.state.visits || [];
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1e3;
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const monthStr = todayStr.slice(0, 7);
    const yearStr = todayStr.slice(0, 4);
    let today = 0;
    let week = 0;
    let month = 0;
    let year = 0;
    for (const v of list) {
      if (v.date === todayStr) today++;
      if (v.timestamp >= sevenDaysAgo) week++;
      if (v.date.startsWith(monthStr)) month++;
      if (v.date.startsWith(yearStr)) year++;
    }
    return {
      today,
      week,
      month,
      year,
      total: list.length
    };
  }
};
var localStore = new LocalStore();

// server/whatsapp.ts
var normalizePhone = (value) => value.replace(/[^\d]/g, "");
function isWhatsAppConfigured() {
  return Boolean(
    ENV.callmebotApiKey || ENV.whatsappAccessToken && ENV.whatsappPhoneNumberId && ENV.whatsappHostPhone && ENV.whatsappTemplateName
  );
}
var templateParameters = (notification) => {
  if (notification.kind === "reservation") {
    return [
      String(notification.id),
      notification.name,
      `${notification.date} \xE0 ${notification.time}`,
      `${notification.guests} personne${notification.guests > 1 ? "s" : ""}`,
      notification.phone
    ];
  }
  return [
    String(notification.id),
    notification.customerName,
    `${notification.totalDt} DT`,
    notification.orderType === "delivery" ? "Livraison" : "\xC0 emporter",
    notification.phone
  ];
};
async function notifyHostOnWhatsApp(notification) {
  if (!isWhatsAppConfigured()) {
    console.info(`[WhatsApp] Notification ${notification.kind} #${notification.id} non envoy\xE9e : int\xE9gration non configur\xE9e.`);
    return false;
  }
  if (ENV.callmebotApiKey) {
    const phone = normalizePhone(ENV.whatsappHostPhone || "21620217090");
    const msg = notification.kind === "reservation" ? `\u{1F37D}\uFE0F *Nouvelle r\xE9servation Per Voi (#${notification.id})*
\u{1F464} Client: ${notification.name}
\u{1F4DE} T\xE9l: ${notification.phone}
\u{1F4C5} Date: ${notification.date} \xE0 ${notification.time}
\u{1F465} Couverts: ${notification.guests} pers.` : `\u{1F355} *Nouvelle commande Per Voi (#${notification.id})*
\u{1F464} Client: ${notification.customerName}
\u{1F4DE} T\xE9l: ${notification.phone}
\u{1F4E6} Type: ${notification.orderType === "delivery" ? "Livraison" : "\xC0 emporter"}
\u{1F4B0} Total: ${notification.totalDt} DT`;
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=+${phone}&text=${encodeURIComponent(msg)}&apikey=${ENV.callmebotApiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        console.info(`[WhatsApp CallMeBot] Notification ${notification.kind} #${notification.id} envoy\xE9e avec succ\xE8s.`);
        return true;
      }
      console.warn(`[WhatsApp CallMeBot] \xC9chec HTTP (${res.status})`, await res.text().catch(() => ""));
    } catch (err) {
      console.warn("[WhatsApp CallMeBot] Erreur r\xE9seau", err);
    }
  }
  if (ENV.whatsappAccessToken && ENV.whatsappPhoneNumberId) {
    const version = ENV.whatsappApiVersion || "v23.0";
    const endpoint = `https://graph.facebook.com/${version}/${ENV.whatsappPhoneNumberId}/messages`;
    const body = {
      messaging_product: "whatsapp",
      to: normalizePhone(ENV.whatsappHostPhone),
      type: "template",
      template: {
        name: ENV.whatsappTemplateName,
        language: { code: ENV.whatsappTemplateLanguage || "fr" },
        components: [{ type: "body", parameters: templateParameters(notification).map((text2) => ({ type: "text", text: text2 })) }]
      }
    };
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${ENV.whatsappAccessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        console.warn(`[WhatsApp Meta] Envoi \xE9chou\xE9 (${response.status})`, await response.text().catch(() => ""));
        return false;
      }
      return true;
    } catch (error) {
      console.warn("[WhatsApp Meta] Erreur r\xE9seau lors de l\u2019envoi", error);
      return false;
    }
  }
  return false;
}

// server/telegram.ts
async function notifyOnTelegram(notification) {
  const token = ENV.telegramBotToken;
  const chatId = ENV.telegramChatId;
  if (!token || !chatId) return false;
  let text2 = "";
  if (notification.kind === "order") {
    text2 = `\u{1F355} *NOUVELLE COMMANDE PER VOI (#${notification.id})*

\u{1F464} *Client :* ${notification.customerName}
\u{1F4DE} *T\xE9l :* ${notification.phone}
\u{1F4E6} *Mode :* ${notification.orderType === "delivery" ? `Livraison \u{1F6F5} (${notification.address || "Adresse non fournie"})` : "\xC0 emporter \u{1F961}"}
\u{1F4B0} *Total :* ${notification.totalDt} DT
${notification.notes ? `\u{1F4DD} *Note :* ${notification.notes}
` : ""}
\u{1F449} [Ouvrir l'Espace G\xE9rant](https://per-voi-sousse-2.onrender.com/hote)`;
  } else {
    text2 = `\u{1F37D}\uFE0F *NOUVELLE R\xC9SERVATION PER VOI (#${notification.id})*

\u{1F464} *Client :* ${notification.name}
\u{1F4DE} *T\xE9l :* ${notification.phone}
\u{1F4C5} *Date :* ${notification.date} \xE0 ${notification.time}
\u{1F465} *Couverts :* ${notification.guests} personnes
${notification.notes ? `\u{1F4DD} *Notes :* ${notification.notes}
` : ""}
\u{1F449} [Ouvrir l'Espace G\xE9rant](https://per-voi-sousse-2.onrender.com/hote)`;
  }
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text2,
        parse_mode: "Markdown"
      })
    });
    if (!response.ok) {
      console.warn(`[Telegram] Erreur envoi (${response.status})`, await response.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Telegram] Erreur r\xE9seau", err);
    return false;
  }
}

// server/restaurant.ts
var SERVICE_TIMES = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30"
];
var menuItemInput = z2.object({
  category: z2.string().min(1).max(80),
  name: z2.string().min(1).max(160),
  description: z2.string().max(1e3).optional().nullable(),
  priceDt: z2.number().nonnegative(),
  active: z2.boolean().default(true),
  sortOrder: z2.number().int().default(0)
});
function isClosedDay(_serviceDate) {
  return false;
}
function isServiceTime(serviceTime) {
  return SERVICE_TIMES.includes(serviceTime);
}
function calculateOrderTotal(lines) {
  const sum = lines.reduce((total, line) => total + line.priceDt * line.quantity, 0);
  return Math.round(sum * 100) / 100;
}
async function getAvailabilityForDate(serviceDate) {
  const db = await getDb();
  const closedDay = isClosedDay(serviceDate);
  if (db) {
    const controls2 = await db.select().from(slotControls).where(eq2(slotControls.serviceDate, serviceDate));
    const booked = await db.select({ serviceTime: reservations.serviceTime, guests: sql`COALESCE(SUM(${reservations.guests}), 0)` }).from(reservations).where(and(eq2(reservations.serviceDate, serviceDate), sql`${reservations.status} IN ('pending', 'confirmed')`)).groupBy(reservations.serviceTime);
    const controlByTime2 = new Map(controls2.map((control) => [control.serviceTime, control]));
    const bookedByTime = new Map(booked.map((row) => [row.serviceTime, Number(row.guests ?? 0)]));
    return SERVICE_TIMES.map((serviceTime) => {
      const control = controlByTime2.get(serviceTime);
      const bookedGuests = bookedByTime.get(serviceTime) ?? 0;
      const capacityFull = bookedGuests >= 24;
      const status = closedDay ? "closed" : control?.status === "closed" || control?.status === "full" || capacityFull ? "full" : "available";
      return {
        serviceDate,
        serviceTime,
        status,
        bookedGuests,
        note: control?.note ?? (closedDay ? "Restaurant ferm\xE9 le lundi" : capacityFull ? "Cr\xE9neau complet" : "")
      };
    });
  }
  const controls = localStore.getSlotControls(serviceDate);
  const controlByTime = new Map(controls.map((c) => [c.serviceTime, c]));
  return SERVICE_TIMES.map((serviceTime) => {
    const control = controlByTime.get(serviceTime);
    const bookedGuests = localStore.getBookedGuests(serviceDate, serviceTime);
    const capacityFull = bookedGuests >= 24;
    const status = closedDay ? "closed" : control?.status === "closed" || control?.status === "full" || capacityFull ? "full" : "available";
    return {
      serviceDate,
      serviceTime,
      status,
      bookedGuests,
      note: control?.note ?? (closedDay ? "Restaurant ferm\xE9 le lundi" : capacityFull ? "Cr\xE9neau complet" : "")
    };
  });
}
var restaurantRouter = router({
  notifications: router({
    status: publicProcedure.query(() => ({
      whatsapp: "configured",
      message: "Les alertes instantan\xE9es Telegram et WhatsApp sont actives."
    }))
  }),
  visits: router({
    record: publicProcedure.mutation(() => {
      localStore.recordVisit();
      return { success: true };
    }),
    stats: publicProcedure.query(() => {
      return localStore.getVisitStats();
    })
  }),
  menu: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (db) {
        return db.select().from(menuItems).where(eq2(menuItems.active, true)).orderBy(asc(menuItems.sortOrder), asc(menuItems.id));
      }
      return localStore.getMenuItems(true);
    }),
    adminList: publicProcedure.query(async () => {
      const db = await getDb();
      if (db) {
        return db.select().from(menuItems).orderBy(asc(menuItems.category), asc(menuItems.sortOrder), asc(menuItems.id));
      }
      return localStore.getMenuItems(false);
    }),
    upsert: publicProcedure.input(menuItemInput.extend({ id: z2.number().int().positive().optional() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (db) {
        if (input.id) {
          await db.update(menuItems).set({
            category: input.category,
            name: input.name,
            description: input.description ?? null,
            priceDt: input.priceDt,
            active: input.active,
            sortOrder: input.sortOrder
          }).where(eq2(menuItems.id, input.id));
          return { id: input.id };
        }
        const result = await db.insert(menuItems).values(input);
        return { id: Number(result[0].insertId) };
      }
      return localStore.upsertMenuItem(input);
    }),
    toggle: publicProcedure.input(z2.object({ id: z2.number().int().positive(), active: z2.boolean() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (db) {
        await db.update(menuItems).set({ active: input.active }).where(eq2(menuItems.id, input.id));
        return { success: true };
      }
      localStore.toggleMenuItem(input.id, input.active);
      return { success: true };
    })
  }),
  availability: router({
    forDate: publicProcedure.input(z2.object({ serviceDate: z2.string().regex(/^\d{4}-\d{2}-\d{2}$/) })).query(({ input }) => getAvailabilityForDate(input.serviceDate)),
    set: publicProcedure.input(z2.object({
      serviceDate: z2.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      serviceTime: z2.string(),
      status: z2.enum(["available", "full", "closed"]),
      note: z2.string().max(255).optional().nullable()
    })).mutation(async ({ input }) => {
      if (!isServiceTime(input.serviceTime)) throw new Error("Cr\xE9neau invalide.");
      const db = await getDb();
      if (db) {
        const existing = await db.select({ id: slotControls.id }).from(slotControls).where(and(eq2(slotControls.serviceDate, input.serviceDate), eq2(slotControls.serviceTime, input.serviceTime))).limit(1);
        if (existing[0]) {
          await db.update(slotControls).set({ status: input.status, note: input.note ?? null }).where(eq2(slotControls.id, existing[0].id));
        } else {
          await db.insert(slotControls).values(input);
        }
        return { success: true };
      }
      localStore.setSlotControl(input);
      return { success: true };
    })
  }),
  reservations: router({
    create: publicProcedure.input(z2.object({
      name: z2.string().min(2).max(160),
      phone: z2.string().min(6).max(40),
      email: z2.string().email().optional().or(z2.literal("")),
      serviceDate: z2.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      serviceTime: z2.string(),
      guests: z2.number().int().min(1).max(30),
      notes: z2.string().max(1e3).optional()
    })).mutation(async ({ input }) => {
      if (isClosedDay(input.serviceDate)) throw new Error("Le restaurant est ferm\xE9 le lundi.");
      if (!isServiceTime(input.serviceTime)) throw new Error("Cet horaire n'est pas disponible.");
      const availability = await getAvailabilityForDate(input.serviceDate);
      const slot = availability.find((item) => item.serviceTime === input.serviceTime);
      if (!slot || slot.status !== "available" || slot.bookedGuests + input.guests > 24) {
        throw new Error("Ce cr\xE9neau est complet. Choisissez un autre horaire.");
      }
      const db = await getDb();
      let id = 1;
      if (db) {
        const result = await db.insert(reservations).values({ ...input, email: input.email || null, status: "pending" });
        id = Number(result[0].insertId);
      } else {
        const res = localStore.createReservation(input);
        id = res.id;
      }
      void notifyHostOnWhatsApp({ kind: "reservation", id, name: input.name, phone: input.phone, date: input.serviceDate, time: input.serviceTime, guests: input.guests });
      void notifyOnTelegram({ kind: "reservation", id, name: input.name, phone: input.phone, date: input.serviceDate, time: input.serviceTime, guests: input.guests, notes: input.notes || void 0 });
      return { id, status: "pending" };
    }),
    adminList: publicProcedure.input(z2.object({ serviceDate: z2.string().optional() }).optional()).query(async ({ input }) => {
      const db = await getDb();
      if (db) {
        return db.select().from(reservations).where(input?.serviceDate ? eq2(reservations.serviceDate, input.serviceDate) : void 0).orderBy(desc(reservations.serviceDate), asc(reservations.serviceTime), desc(reservations.createdAt));
      }
      return localStore.getReservations(input?.serviceDate);
    }),
    updateStatus: publicProcedure.input(z2.object({ id: z2.number().int().positive(), status: z2.enum(["pending", "confirmed", "cancelled", "rejected"]) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (db) {
        await db.update(reservations).set({ status: input.status }).where(eq2(reservations.id, input.id));
        return { success: true };
      }
      localStore.updateReservationStatus(input.id, input.status);
      return { success: true };
    })
  }),
  orders: router({
    create: publicProcedure.input(z2.object({
      customerName: z2.string().min(2).max(160),
      phone: z2.string().min(6).max(40),
      orderType: z2.enum(["pickup", "delivery"]),
      address: z2.string().max(500).optional(),
      notes: z2.string().max(1e3).optional(),
      items: z2.array(z2.object({ menuItemId: z2.number().int().positive(), quantity: z2.number().int().min(1).max(20) })).min(1)
    })).mutation(async ({ input }) => {
      if (input.orderType === "delivery" && !input.address) throw new Error("Une adresse est n\xE9cessaire pour la livraison.");
      const db = await getDb();
      if (db) {
        const ids = input.items.map((item) => item.menuItemId);
        const menu = await db.select().from(menuItems).where(and(inArray(menuItems.id, ids), eq2(menuItems.active, true)));
        const byId = new Map(menu.map((item) => [item.id, item]));
        const lines = input.items.map((item) => {
          const menuItem = byId.get(item.menuItemId);
          if (!menuItem) throw new Error("Un article du panier n'est plus disponible.");
          return { menuItemId: menuItem.id, name: menuItem.name, unitPriceDt: menuItem.priceDt, quantity: item.quantity };
        });
        const totalDt = calculateOrderTotal(lines.map((line) => ({ priceDt: line.unitPriceDt, quantity: line.quantity })));
        const orderResult = await db.insert(orders).values({ customerName: input.customerName, phone: input.phone, orderType: input.orderType, address: input.address ?? null, notes: input.notes ?? null, totalDt, status: "new" });
        const orderId = Number(orderResult[0].insertId);
        await db.insert(orderItems).values(lines.map((line) => ({ ...line, orderId })));
        void notifyHostOnWhatsApp({ kind: "order", id: orderId, customerName: input.customerName, phone: input.phone, orderType: input.orderType, totalDt });
        void notifyOnTelegram({ kind: "order", id: orderId, customerName: input.customerName, phone: input.phone, orderType: input.orderType, totalDt, address: input.address, notes: input.notes });
        return { id: orderId, totalDt, status: "new" };
      }
      const res = localStore.createOrder(input);
      void notifyHostOnWhatsApp({ kind: "order", id: res.id, customerName: input.customerName, phone: input.phone, orderType: input.orderType, totalDt: res.totalDt });
      void notifyOnTelegram({ kind: "order", id: res.id, customerName: input.customerName, phone: input.phone, orderType: input.orderType, totalDt: res.totalDt, address: input.address, notes: input.notes });
      return res;
    }),
    adminList: publicProcedure.input(z2.object({ status: z2.string().optional() }).optional()).query(async ({ input }) => {
      const db = await getDb();
      if (db) {
        return db.select().from(orders).where(input?.status ? eq2(orders.status, input.status) : void 0).orderBy(desc(orders.createdAt));
      }
      return localStore.getOrders(input?.status);
    }),
    adminItems: publicProcedure.input(z2.object({ orderId: z2.number().int().positive() })).query(async ({ input }) => {
      const db = await getDb();
      if (db) {
        return db.select().from(orderItems).where(eq2(orderItems.orderId, input.orderId)).orderBy(asc(orderItems.id));
      }
      return localStore.getOrderItems(input.orderId);
    }),
    updateStatus: publicProcedure.input(z2.object({ id: z2.number().int().positive(), status: z2.enum(["new", "accepted", "preparing", "ready", "completed", "cancelled"]) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (db) {
        await db.update(orders).set({ status: input.status }).where(eq2(orders.id, input.id));
        return { success: true };
      }
      localStore.updateOrderStatus(input.id, input.status);
      return { success: true };
    })
  })
});

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  restaurant: restaurantRouter
});

// server/_core/context.ts
var DEV_ADMIN = {
  id: 1,
  openId: "dev-admin-per-voi",
  name: "Responsable Per Voi",
  email: "contact@pervoi.tn",
  loginMethod: "local",
  role: "admin",
  createdAt: /* @__PURE__ */ new Date(),
  updatedAt: /* @__PURE__ */ new Date(),
  lastSignedIn: /* @__PURE__ */ new Date()
};
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  if (!user) {
    user = DEV_ADMIN;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs3 from "fs";
import { nanoid } from "nanoid";
import path3 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs2 from "node:fs";
import path2 from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path2.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs2.existsSync(LOG_DIR)) {
    fs2.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs2.existsSync(logPath) || fs2.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs2.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs2.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path2.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs2.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path2.resolve(import.meta.dirname),
  root: path2.resolve(import.meta.dirname, "client"),
  publicDir: path2.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = fs3.existsSync(path3.resolve(process.cwd(), "client", "index.html")) ? path3.resolve(process.cwd(), "client", "index.html") : path3.resolve(import.meta.dirname, "../..", "client", "index.html");
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = fs3.existsSync(path3.resolve(process.cwd(), "dist", "public")) ? path3.resolve(process.cwd(), "dist", "public") : path3.resolve(import.meta.dirname, "public");
  if (!fs3.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
var isDist = import.meta.url.includes("/dist/") || process.argv[1] && process.argv[1].includes("dist");
process.env.NODE_ENV = process.env.NODE_ENV || (isDist ? "production" : "development");
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
