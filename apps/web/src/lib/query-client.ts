import {QueryCache, QueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export function createQueryClient() {
	return new QueryClient({
		queryCache: new QueryCache({
			onError: (error) => {
				toast.error(`Error: ${error.message}`);
			},
		}),
	});
}
