import { Result } from "@/shared/domain/result";
import { HttpClientErrorResponse } from "@/shared/infra/http/axios-error.interceptor";
import { httpClient } from "@/shared/infra/http/http.client";
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
			.then((res) => toUser(res.data))
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
		sessionType: USER_SESSION_TYPES.BASE,
	});

const mapHttpUserErrorToResult = <R = UserModel>(
	error: HttpClientErrorResponse,
	model: UserModel,
): Result<R> => {
	const statusCode = error.response?.status;

	if (statusCode === HttpStatusCode.BadRequest)
		return Result.Failure([userValidationErrors.invalidTheme(model.theme)]);

	return Result.Failure([userRepositoryErrors.dataNotFound("/user", "api")]);
};
