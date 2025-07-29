import { IUser } from "@/features/users/types/user.type";

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
}
