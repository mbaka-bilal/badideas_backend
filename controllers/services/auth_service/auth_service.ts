import { SignupInterface } from "../../../models/interface/auth_interface";
import { UserProfileInterface } from "../../../models/interface/user_profile_interface";

abstract class AuthService {

  abstract signup(data: SignupInterface): Promise<UserProfileInterface>;
}

export default AuthService;