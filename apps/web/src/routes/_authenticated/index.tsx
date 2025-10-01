import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
	component: RouteComponent,
});

function RouteComponent() {
	const {user} = Route.useRouteContext();
	return <div>{user.name}</div>;
}
