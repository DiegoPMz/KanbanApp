import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		// throw redirect({
		// 	to: "/login",
		// 	search: {
		// 		redirect: location.href,
		// 	},
		// });
	},
});

// interface IUserRepository {
// 	details: () => Promise<UserModel>;
// 	save: (data: UserModel) => Promise<void>; // guarda y actualiza
// }

// const apiUserRepository: IUserRepository = {
// 	save: async (data: UserModel): Promise<void> => {
// 		if (!data.id) return;

// 		/*
// 			const validation = zod.string().safeParse(data.theme);
// 			if(validation.succeeded) return Result.success();
// 			return Result.error();
// 		*/
// 	},

// 	save: async (data: UserModel): Promise<void> => {
// 		if (!data.id) return;

// 		/*
// 			const getUser = SessionStorage.get("KEY")
// 			if
// 		*/
// 	},

// 	details: async (): Promise<UserModel> => {
// 		return {
// 			email: "",
// 			id: "",
// 			isAuthenticated: false,
// 			sessionType: "DEMO",
// 			theme: "",
// 		};
// 	},
// };
