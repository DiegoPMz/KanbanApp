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
	[errorTypes.Conflict]: "Conflict detected",
	[errorTypes.Internal]: "Service unavailable",
	[errorTypes.Not_found]: "Resource not found",
	[errorTypes.Validation]: "Invalid data provided",
};

export const GenericErrorView = ({ error }: ErrorComponentProps) => {
	let message =
		"We’re having trouble showing this right now. Please make sure you're online and give it another shot.";
	let title = "Something went wrong";
	let errorCode: string | undefined;

	if (error instanceof TanStackError) {
		message = error.message;
		title = errorTypeTitle[error.type as PossibleErrorTypes] ?? title;
		errorCode = error.code;
	}

	return (
		<div className="bg-background dark flex min-h-screen items-center justify-center p-6">
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
					<div className="mb-3 flex flex-col items-center gap-2">
						<h1 className="text-foreground text-2xl font-bold tracking-tight">
							{title}
						</h1>
						{errorCode && (
							<span className="bg-muted text-muted-foreground/60 rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
								Error: {errorCode}
							</span>
						)}
					</div>

					<p className="text-muted-foreground text-balance leading-relaxed">
						{message}
					</p>
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
						If the problem persists, please contact technical support.
					</p>
				</div>
			</div>
		</div>
	);
};
