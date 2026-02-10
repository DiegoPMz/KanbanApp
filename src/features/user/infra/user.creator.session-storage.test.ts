import { sessionDb } from "@/shared/infra/persistence/session-storage.db";
import { sessionStorageUserCreator } from "./user.creator.session-storage";

describe("features/user : sessionStorageUserCreator", () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	test("should initialize and persist a new 'Demo User' session with default values", async () => {
		const result = await sessionStorageUserCreator.create();

		expect(result.isSuccess).toBe(true);
		expect(result.value).toMatchObject({
			sessionType: "DEMO",
			email: null,
		});

		const persisted = sessionDb.user.get();
		expect(persisted).toEqual(result.value);
	});
});
