import { sessionStorageUserCreator } from "@/features/user";
import { ApplicationLogo } from "@/shared/presentation/components/aplication-logo";
import { Button } from "@/shared/presentation/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/presentation/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { loginDemo } from "../../application/login-demo.use-case";
import { loginRegister } from "../../application/login-register.use-case";
import { apiAuthService } from "../../infra/auth.service.api";
import { sessionStorageAuthService } from "../../infra/auth.service.session-storage";

export const LoginCard = () => {
	const navigation = useNavigate({ from: "/login" });

	const handleLogin = () => loginRegister(apiAuthService()).handle();

	const handleLoginDemo = async () => {
		await loginDemo(
			sessionStorageAuthService(() => navigation({ to: "/demo" })),
			sessionStorageUserCreator,
		).handle();
	};

	return (
		<Card className="w-full max-w-sm max-[400px]:border-0 max-[400px]:bg-transparent max-[400px]:shadow-none">
			<CardHeader>
				<div className="flex justify-center">
					<div className="bg-secondary flex h-14 w-14 items-center justify-center rounded-lg shadow-sm">
						<ApplicationLogo />
					</div>
				</div>
				<CardTitle className="text-center text-[28px]">
					Bienvenido a Kando
				</CardTitle>
				<CardDescription className="text-center text-[15px] leading-relaxed">
					Gestiona tus proyectos de manera eficiente.
					<br />
					Inicia sesión para comenzar.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-2">
					<Button
						variant="outline"
						className="w-full"
						onClick={handleLogin}>
						Continuar con Google
					</Button>
					<Button
						variant="outline"
						className="w-full border-dashed"
						onClick={handleLoginDemo}>
						<div className="flex items-center gap-2">
							<span className="bg-primary/60 text-primary-foreground tracking-wide">
								DEMO
							</span>
							Probar ahora
						</div>
					</Button>
				</div>
			</CardContent>
			<CardFooter className="flex-col gap-2">
				<p className="text-center text-[13px] leading-relaxed">
					Al continuar, aceptas nuestros Términos de Servicio y Política de
					Privacidad
				</p>
			</CardFooter>
		</Card>
	);
};
