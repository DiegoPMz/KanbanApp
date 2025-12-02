import { externalRedirectWeb } from "@/features/auth/infra/auth.external-redirect.web";
import { apiAuthRepository } from "@/features/auth/infra/auth.repository.api";
import { sessionStorageAuthRepository } from "@/features/auth/infra/auth.repository.session-storage";
import {
	AuthProjectDependencies,
	useAuthStore,
} from "@/features/auth/state/auth.store";
import { IUserRepository } from "@/features/user/domain/user.repository";
import { useEffect } from "react";

interface AuthModel {
	isAuthenticated: boolean;
	modeType: "DEMO" | "FULL";
}

// TEMPORAL TYPES (PORTS ?)
interface UserProjectDependencies {
	userRepository: () => IUserRepository;
}

const apiUserRepository: IUserRepository = {} as IUserRepository;
const sessionStorageUserRepository: IUserRepository = {} as IUserRepository;

// -------------------

interface ApplicationDependencies {
	auth: {
		demoMode: AuthProjectDependencies;
		fullMode: AuthProjectDependencies;
	};
	user: {
		demoMode: UserProjectDependencies;
		fullMode: UserProjectDependencies;
	};
}

const applicationDependenciesConfiguration: ApplicationDependencies = {
	auth: {
		fullMode: {
			authRepository: () => apiAuthRepository,
			externalAuthRedirect: () => externalRedirectWeb,
			userRepository: () => apiUserRepository,
		},
		demoMode: {
			authRepository: () => sessionStorageAuthRepository,
			externalAuthRedirect: () => externalRedirectWeb,
			userRepository: () => sessionStorageUserRepository,
		},
	},

	user: {
		fullMode: {
			userRepository: () => apiUserRepository,
		},
		demoMode: {
			userRepository: () => sessionStorageUserRepository,
		},
	},
};

export const useDependencyConfiguration = (authDetails: AuthModel) => {
	const setAuthDependencies = useAuthStore((state) => state.setDependencies);

	useEffect(() => {
		if (authDetails?.modeType === "DEMO") {
			setAuthDependencies(applicationDependenciesConfiguration.auth.demoMode);
			// setUserDependencies(applicationDependenciesConfiguration.user.demoMode);
			return;
		}

		setAuthDependencies(applicationDependenciesConfiguration.auth.fullMode);
		// setUserDependencies(applicationDependenciesConfiguration.user.fullMode);
	}, [authDetails.modeType, setAuthDependencies]);
};
