import { httpClient } from "@/shared/api/api.client";
import { HttpClientErrorResponse } from "@/shared/api/http-error.interceptor";
import { Result } from "@/shared/lib/result";
import { HttpStatusCode } from "axios";
import {
	userRepositoryErrors,
	userValidationErrors,
} from "../domain/user.errors";
import { USER_SESSION_TYPES, UserModel } from "../domain/user.model";
import { IUserRepository } from "../domain/user.repository";
import { User } from "./../domain/user.model";

interface UserApiDto {
	id: string;
	email: string;
	appTheme: UserModel["theme"];
}

export const apiUserRepository: IUserRepository = {
	getDetails: (): Promise<Result<UserModel>> =>
		httpClient
			.get<UserApiDto>("/user")
			.then((response) => toUser(response.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpUserErrorToResult(error, {} as UserModel),
			),

	update: (userData: UserModel): Promise<Result<UserModel>> =>
		httpClient
			.patch<UserApiDto>(`/user/theme/${userData.theme}`)
			.then((res) => toUser(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpUserErrorToResult(error, userData),
			),
};

const toUser = (dto: UserApiDto): Result<UserModel> =>
	User({
		id: dto.id,
		email: dto.email,
		theme: dto.appTheme,
		sessionType: USER_SESSION_TYPES.REGISTER,
	});

const mapHttpUserErrorToResult = <R = UserModel>(
	error: HttpClientErrorResponse,
	model: UserModel,
): Result<R> => {
	const statusCode = error.response?.status;

	if (statusCode === HttpStatusCode.BadRequest)
		return Result.Error([
			userValidationErrors.invalidTheme(model?.id ?? "UNDEFINED", model.theme),
		]);

	return Result.Error([userRepositoryErrors.dataNotFound("UNDEFINED", "api")]);
};
