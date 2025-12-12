import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UserModel } from "../domain/user.model";

interface UserState {
	user: {
		id: UserModel["id"] | null;
		email: UserModel["email"] | null;
		sessionType: UserModel["sessionType"] | null;
		theme: UserModel["theme"] | null;
	};

	getUserState: () => Partial<UserModel>;
	setUserState: (user: UserModel) => void;
}

export const useUserStore = create<UserState>()(
	devtools((set, get) => ({
		user: {
			email: null,
			id: null,
			sessionType: null,
			theme: null,
		} as const,

		getUserState: () => get().user,
		setUserState: (user: UserModel) => {
			set((state) => ({ ...state, user: user }));
		},
	})),
);
