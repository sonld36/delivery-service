/* eslint-disable import/no-anonymous-default-export */
import {
  LoginRegisterForm,
  ResponseReceived,
  ShopRegisterForm,
  UserLogged,
} from "@Common/types";
import httpCommon from "@Services/http-common";

class AuthService {
  // constructor() {

  // }

  async login(user?: LoginRegisterForm): Promise<ResponseReceived<UserLogged>> {
    return httpCommon
      .post<ResponseReceived<UserLogged>>("auth/login", user, {
        headers: {
          Authorization: null,
        },
      })
      .then();
  }

  async register(
    registerForm: LoginRegisterForm
  ): Promise<ResponseReceived<UserLogged>> {
    return httpCommon
      .post<ResponseReceived<UserLogged>>("auth/register", registerForm)
      .then();
  }

  async shopRegister(
    shopRegisterForm: ShopRegisterForm
  ): Promise<ResponseReceived<UserLogged>> {
    return httpCommon
      .post<ResponseReceived<UserLogged>>(
        "auth/shop/register",
        shopRegisterForm
      )
      .then();
  }

  createAcc = (body: Object, role: string) => {
    return httpCommon.post('/auth/create-account?role=' + role , body);
  }
}

export default new AuthService();
