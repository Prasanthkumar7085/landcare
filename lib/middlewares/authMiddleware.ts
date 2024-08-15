import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserDataServiceProvider } from "../services/userDataServiceProvider";
import { ResponseHelper } from "../helpers/reponseHelper";
import configData from "../../config/app";

const userdataServiceProvider = new UserDataServiceProvider();

export async function validateAccessToken(req: NextRequest) {
  try {
    let token = req.headers.get("Authorization");
    if (token) {
      const decodedToken: any = await jwt.decode(token);
      if (!decodedToken) {
        return ResponseHelper.sendErrorResponse(
          403,
          "Access Denied - Invalid Token"
        );
      }
      const user = await userdataServiceProvider.findById(decodedToken.id);
      if (user) {
        await jwt.verify(token, configData.jwt.token_secret);
        return user;
      } else {
        return ResponseHelper.sendErrorResponse(
          403,
          "Access Denied - Invalid User"
        );
      }
    } else {
      return ResponseHelper.sendErrorResponse(
        403,
        "Access Denied - No Token Provided"
      );
    }
  } catch (err: any) {
    console.error(err);
    if (
      err.name === "JsonWebTokenError" &&
      err.message === "invalid signature"
    ) {
      // Handle invalid signature exception here
      return ResponseHelper.sendErrorResponse(
        403,
        "Access Denied - Invalid Token"
      );
    }
    if (err.name === "TokenExpiredError") {
      // Handle token expire exception here
      return ResponseHelper.sendErrorResponse(
        403,
        "Access Denied - Token is expired"
      );
    }

    return ResponseHelper.sendErrorResponse(500, "Internal Server Error");
  }
}
