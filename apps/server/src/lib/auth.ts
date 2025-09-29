import {checkout, polar, portal} from "@polar-sh/better-auth";
import {type BetterAuthOptions, betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "../db";
import schema from "../db/schema";
import {polarClient} from "./payments";

export const auth = betterAuth<BetterAuthOptions>({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		usePlural: true,
		schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	plugins: [
		// polar({
		//   client: polarClient,
		//   createCustomerOnSignUp: true,
		//   enableCustomerPortal: true,
		//   use: [
		//     checkout({
		//       products: [
		//         {
		//           productId: "your-product-id",
		//           slug: "pro",
		//         },
		//       ],
		//       successUrl: process.env.POLAR_SUCCESS_URL,
		//       authenticatedUsersOnly: true,
		//     }),
		//     portal(),
		//   ],
		// }),
	],
});
