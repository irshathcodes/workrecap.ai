import type {RouteConfig, RouteHandler} from "@hono/zod-openapi";
import type {Context as HonoContext, MiddlewareHandler} from "hono";
import type {auth} from "@/lib/auth.js";

export type AuthCtx = {
	user: typeof auth.$Infer.Session.user;
	session: typeof auth.$Infer.Session.session;
};

export interface AppBindings {
	Variables: {
		authCtx: AuthCtx;
	};
}

/**
 * Utility type to infer handler types from route definitions
 * @example
 * const handlers: InferHandlers<typeof routes> = {
 *   myRoute: async (c) => {
 *     // Fully typed handler
 *   }
 * }
 */
export type InferHandlers<TRoutes extends Record<string, RouteConfig>> = {
	[K in keyof TRoutes]: AppRouteHandler<TRoutes[K]>;
};

export type InferMiddlewares<TRoutes extends Record<string, RouteConfig>> = {
	[K in keyof TRoutes]?: Array<MiddlewareHandler<AppBindings>>;
};

export type Context = HonoContext<AppBindings>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
	R,
	AppBindings
>;
