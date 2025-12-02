import { IUserRepository } from "@/features/user/domain/user.repository";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { loginDemo } from "../../application/login-demo.use-case";
import { login } from "../../application/login.use-case";
import { externalRedirectWeb } from "../../infra/auth.external-redirect.web";

const sessionStorageUserRepository = {} as IUserRepository;

export const LoginCard = () => {
	const navigation = useNavigate({ from: "/login" });

	const handleLogin = () => {
		login(externalRedirectWeb).handle();
	};

	const handleLoginDemo = async () => {
		await loginDemo(sessionStorageUserRepository).handle();
		navigation({ to: "/demo" });
	};

	return (
		<Card className="w-full max-w-sm max-[400px]:border-0 max-[400px]:bg-transparent max-[400px]:shadow-none">
			<CardHeader>
				<div className="flex justify-center">
					<div className="flex h-14 w-14 items-center justify-center rounded-lg bg-secondary shadow-sm">
						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg">
							<rect
								x="2"
								y="2"
								width="6"
								height="6"
								rx="1"
								fill="currentColor"
								className="text-secondary-foreground"
							/>
							<rect
								x="2"
								y="10"
								width="6"
								height="6"
								rx="1"
								fill="currentColor"
								className="text-secondary-foreground"
							/>
							<rect
								x="10"
								y="2"
								width="6"
								height="6"
								rx="1"
								fill="currentColor"
								className="text-secondary-foreground"
							/>
						</svg>
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
						onClick={() => handleLogin()}>
						Continuar con Google
					</Button>
					<Button
						variant="outline"
						className="w-full border-dashed"
						onClick={() => handleLoginDemo()}>
						<div className="flex items-center gap-2">
							<span className="bg-primary/60 tracking-wide text-primary-foreground">
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
