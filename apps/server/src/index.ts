import "dotenv/config";
import {openai} from "@ai-sdk/openai";
import {OpenAPIHandler} from "@orpc/openapi/fetch";
import {OpenAPIReferencePlugin} from "@orpc/openapi/plugins";
import {onError} from "@orpc/server";
import {RPCHandler} from "@orpc/server/fetch";
import {ZodToJsonSchemaConverter} from "@orpc/zod/zod4";
import {convertToModelMessages, streamText} from "ai";
import {Hono} from "hono";
import {cors} from "hono/cors";
import {logger} from "hono/logger";
import {auth} from "./lib/auth";
import {createContext} from "./lib/context";
import {appRouter} from "./routers/index";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: process.env.CORS_ORIGIN || "",
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

export const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

app.use("/*", async (c, next) => {
	const context = await createContext({context: c});

	const rpcResult = await rpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: context,
	});

	if (rpcResult.matched) {
		return c.newResponse(rpcResult.response.body, rpcResult.response);
	}

	const apiResult = await apiHandler.handle(c.req.raw, {
		prefix: "/api",
		context: context,
	});

	if (apiResult.matched) {
		return c.newResponse(apiResult.response.body, apiResult.response);
	}

	await next();
});

app.post("/ai", async (c) => {
	const body = await c.req.json();
	const uiMessages = body.messages || [];
	const result = streamText({
		model: openai("gpt-5"),
		messages: convertToModelMessages(uiMessages),
	});

	return result.toUIMessageStreamResponse();
});

app.get("/", (c) => {
	return c.text("OK");
});

app.get("/", (c) => {
	return c.text("OK");
});

export default {
	fetch: app.fetch,
	idleTimeout: 120,
};
