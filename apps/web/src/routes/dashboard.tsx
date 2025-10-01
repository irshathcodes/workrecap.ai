import {useQuery} from "@tanstack/react-query";
import {createFileRoute, redirect} from "@tanstack/react-router";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {orpc} from "@/utils/orpc";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) {
			redirect({
				to: "/login",
				throw: true,
			});
		}
		return {session};
	},
});

function RouteComponent() {
	const {session} = Route.useRouteContext();

	const privateData = useQuery(orpc.privateData.queryOptions());
	const hasProSubscription = false;

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session.data?.user.name}</p>
			<p>API: {privateData.data?.message}</p>
			<p>Plan: {hasProSubscription ? "Pro" : "Free"}</p>
		</div>
	);
}
