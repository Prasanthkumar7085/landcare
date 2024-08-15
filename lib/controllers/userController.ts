import { NextRequest, NextResponse } from "next/server";
import {
  INVALID_CREDENTIALS,
  SOMETHING_WENT_WRONG,
  USER_ALREADY_EXISTS,
  USER_CREATED,
  USER_LOGIN,
} from "../constants/appMessages";
import { getUserAuthTokens } from "../helpers/authHelper";
import { HashHelper } from "../helpers/hashHelper";
import { ResponseHelper } from "../helpers/reponseHelper";
import { UserDataServiceProvider } from "../services/userDataServiceProvider";
import { ResourceAlreadyExistsError } from "../helpers/exceptions";

const hashHelper = new HashHelper();
const userDataServiceProvider = new UserDataServiceProvider();

export class UserController {
  async signUp(req: NextRequest, res: NextResponse) {
    try {
      const reqData = await req.json();

      const userData: any = await userDataServiceProvider.findUserByEmail(
        reqData.email
      );
      if (userData) {
        throw new ResourceAlreadyExistsError("email", USER_ALREADY_EXISTS);
      }

      const reponseData: any = await userDataServiceProvider.create(reqData);
      delete reponseData[0].password;

      return ResponseHelper.sendSuccessResponse(
        200,
        USER_CREATED,
        reponseData[0]
      );
    } catch (error: any) {
      console.error(error);
      if (error.validation_error) {
        return ResponseHelper.sendErrorResponse(409, error.validation_error);
      }
      return ResponseHelper.sendErrorResponse(500, SOMETHING_WENT_WRONG, error);
    }
  }

  async signIn(reqData: any, res: NextResponse) {
    try {
      const userData: any = await userDataServiceProvider.findUserByEmail(
        reqData.email
      );
      if (!userData) {
        return ResponseHelper.sendErrorResponse(401, INVALID_CREDENTIALS);
      }

      const matchPassword = await hashHelper.comparePassword(
        reqData.password,
        userData.password
      );

      if (!matchPassword) {
        return ResponseHelper.sendErrorResponse(401, INVALID_CREDENTIALS);
      }

      const { token, refreshToken } = await getUserAuthTokens(userData);
      delete userData.password;

      let response = {
        user_details: userData,
        access_token: token,
        refresh_token: refreshToken,
      };

      return ResponseHelper.sendSuccessResponse(200, USER_LOGIN, response);
    } catch (error: any) {
      console.error(error);
      return ResponseHelper.sendErrorResponse(500, SOMETHING_WENT_WRONG, error);
    }
  }
}
