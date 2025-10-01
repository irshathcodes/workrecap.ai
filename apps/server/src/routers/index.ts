import {openai} from "@ai-sdk/openai";
import type {RouterClient} from "@orpc/server";
import {generateText} from "ai";
import {GitHubUserService} from "../lib/github";
import {protectedProcedure, publicProcedure} from "../lib/orpc";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({context}) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	getActivitySummary: protectedProcedure.handler(async () => {
		const githubService = new GitHubUserService(
			process.env.GITHUB_CLASSIC_TOKEN!,
			"irshathcodes",
		);
		const pullRequests = await githubService.getUserPullRequestsByDays();
		const response = await generateText({
			model: openai("gpt-5"),
			prompt: `Here's the list of pull requests with their details: ${JSON.stringify(
				pullRequests,
			)}`,

			system: `You are a summarizer of workrecap.ai app. You are given a list of github pull requests that were created in the last 7 days, you're job is to summarize the pull requests in a way that is easy to understand and use for the user. This is to give updates on the user's work and progress `,
		});

		return response.text;
	}),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
