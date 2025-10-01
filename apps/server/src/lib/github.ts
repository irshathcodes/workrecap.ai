import {Octokit} from "octokit";
import {z} from "zod";

const pullRequestSchema = z.object({
	title: z.string(),
	number: z.number(),
	url: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	state: z.enum(["open", "closed", "merged", "draft"]),
	body: z.string().nullable(),
});
const pullRequestListSchema = z.array(pullRequestSchema);

export class GitHubUserService {
	private octokit: Octokit;
	private token: string;
	private username: string;

	constructor(token: string, username: string) {
		this.token = token;
		this.octokit = new Octokit({
			auth: this.token,
		});
		this.username = username;
	}

	// Get user's pull requests
	async getUserPullRequestsByDays({days = 7}: {days?: number} = {}) {
		const range = getDateRange(days);
		const q = `is:pr author:${this.username} created:${range.startDate}..${range.endDate}`;

		const res = await this.octokit.request("GET /search/issues", {
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
			order: "desc",
			advanced_search: "true",
			q,
		});

		const data = pullRequestListSchema.parse(res.data.items);
		return data;
	}
}

function getDateRange(days: number): {
	startDate: string;
	endDate: string;
} {
	const endDate = new Date();

	const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
	return {
		startDate: startDate.toISOString().split("T")[0],
		endDate: endDate.toISOString().split("T")[0],
	};
}
