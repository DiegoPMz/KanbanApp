import { TanStackError } from "@/shared/infra/errors/tanstack-result.exception";
import { ErrorComponentProps } from "@tanstack/react-router";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { ErrorTypes, errorTypes } from "@/shared/domain/result";

type PossibleErrorTypes = Exclude<
	ErrorTypes,
	typeof errorTypes.Authentication | typeof errorTypes.Authorization
>;

const errorTypeTitle: Record<PossibleErrorTypes, string> = {
	[errorTypes.Conflict]: "That's already taken",
	[errorTypes.Internal]: "Something went wrong on our end",
	[errorTypes.Not_found]: "We couldn't find what you’re looking for",
	[errorTypes.Validation]: "Please check the information you entered",
};

export const GenericErrorView = ({ error }: ErrorComponentProps) => {
	let message =
		"We’re having trouble showing this right now. Please make sure you're online and give it another shot.";
	let title = "Something went wrong";

	if (error instanceof TanStackError) {
		message = error.message;
		title = errorTypeTitle[error.type as PossibleErrorTypes] ?? title;
	}

	return (
		<div className="bg-background flex min-h-screen items-center justify-center p-6">
			<div className="w-full max-w-md">
				{/* Icon */}
				<div className="mb-6 flex justify-center">
					<div className="relative">
						<div className="bg-chart-2/20 absolute inset-0 rounded-full blur-2xl"></div>
						<div className="bg-card border-chart-2/30 relative rounded-full border p-6">
							<AlertCircle
								className="text-chart-2 h-16 w-16"
								strokeWidth={1.5}
							/>
						</div>
					</div>
				</div>

				<div className="mb-8 text-center">
					<h1 className="text-foreground mb-3">{title}</h1>
					<p className="text-muted-foreground leading-relaxed">{message}</p>
				</div>

				<div className="flex flex-col gap-3">
					<Button
						size={"lg"}
						className="bg-chart-2 hover:bg-chart-2/90 transition-colors duration-200">
						<RefreshCw className="h-4 w-4" />
						Intentar nuevamente
					</Button>

					<Button
						size={"lg"}
						variant={"ghost"}
						className="bg-card hover:bg-accent text-foreground border-border border transition-colors duration-200">
						<Home className="h-4 w-4" />
						Volver al inicio
					</Button>
				</div>

				<div className="border-border mt-8 border-t pt-6">
					<p className="text-muted-foreground/60 text-center text-sm">
						If the problem persist, please contact the tecnical support
					</p>
				</div>
			</div>
		</div>
	);
};
