import {useCompletion} from "@ai-sdk/react";
import {createFileRoute} from "@tanstack/react-router";
import {Calendar, FileText, TrendingUp} from "lucide-react";
import {useState} from "react";
import Loader from "@/components/loader";
import {Response} from "@/components/response";
import {Button} from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/")({
	component: RouteComponent,
});

type SelectedDays = 7 | 14 | 30;

function RouteComponent() {
	const [selectedDays, setSelectedDays] = useState<SelectedDays | null>();
	const {completion, complete, isLoading} = useCompletion({
		api: `${import.meta.env.VITE_SERVER_URL}/api/recap`,
		credentials: "include",
	});

	const handleGetRecap = async (days: SelectedDays) => {
		setSelectedDays(days);
		complete("");
	};

	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			{/* Header Section */}
			<div className="mb-8 text-center">
				<h1 className="mb-2 font-bold text-3xl">Work Recap Summary</h1>
				<p className="text-lg text-muted-foreground">
					Get insights into your recent work activity and productivity
				</p>
			</div>

			{/* Main Action Card */}
			<Card className="mb-8">
				<CardHeader className="text-center">
					<CardTitle className="flex items-center justify-center gap-2">
						<TrendingUp className="h-6 w-6" />
						Generate Your Work Recap
					</CardTitle>
					<CardDescription>
						Choose a time period to analyze your work activity and generate a
						comprehensive summary
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Quick Action Buttons */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<Button
							onClick={() => handleGetRecap(7)}
							size="lg"
							className="h-16 flex-col gap-2"
						>
							<Calendar className="h-5 w-5" />
							<span className="font-semibold">7 Days Recap</span>
						</Button>
						<Button
							onClick={() => handleGetRecap(14)}
							variant="outline"
							size="lg"
							className="h-16 flex-col gap-2"
						>
							<Calendar className="h-5 w-5" />
							<span className="font-semibold">14 Days Recap</span>
						</Button>
						<Button
							onClick={() => handleGetRecap(30)}
							variant="outline"
							size="lg"
							className="h-16 flex-col gap-2"
						>
							<Calendar className="h-5 w-5" />
							<span className="font-semibold">30 Days Recap</span>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Loading State */}
			{isLoading && (
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Generating {selectedDays} Days Recap...
						</CardTitle>
						<CardDescription>
							Analyzing your work activity and generating insights
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Loader />
					</CardContent>
				</Card>
			)}

			{/* Recap Content */}
			{completion && (
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Your {selectedDays} Days Work Recap
						</CardTitle>
						<CardDescription>
							Generated on {new Date().toLocaleDateString()}
						</CardDescription>
					</CardHeader>
					<CardContent className="prose prose-sm dark:prose-invert max-w-none">
						<Response>{completion}</Response>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
