import { SignupInterface } from "../../../models/interface/auth_interface";
import { UserProfileInterface } from "../../../models/interface/user_profile_interface";

abstract class AuthService {

  abstract login(email: string, password: string): Promise<UserProfileInterface>;
  abstract signup(data: SignupInterface): Promise<UserProfileInterface>;
  abstract resetPassword(otp: string, password: string, email: string): Promise<UserProfileInterface>;
  abstract refreshToken(refreshToken: string): Promise<UserProfileInterface>;
  abstract changePassword(uid: string, oldPassword: string, newPassword: string): Promise<UserProfileInterface>;

}

export default AuthService;