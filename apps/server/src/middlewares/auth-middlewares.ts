import {getCookie} from "hono/cookie";
import {createMiddleware} from "hono/factory";
import HTTP_STATUS_CODES from "@/lib/http-status-codes.js";
import {auth} from "../lib/auth.js";

export const verifySessionMiddleware = createMiddleware(async (c, next) => {
	const session = await auth.api.getSession({headers: c.req.raw.headers});

	if (!session) {
		c.set("authCtx", null);
		return next();
	}

	c.set("authCtx", {
		user: session.user,
		session: session.session,
	});

	return next();
});

export const authenticatedMiddleware = createMiddleware(async (c, next) => {
	const authCtx = c.get("authCtx");

	if (!authCtx?.session || !authCtx?.user) {
		return c.json(
			{
				message: "Un-authorized access",
				statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
			},
			HTTP_STATUS_CODES.UNAUTHORIZED,
		);
	}

	return next();
});
