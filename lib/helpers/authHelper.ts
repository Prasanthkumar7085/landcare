import jwt from "jsonwebtoken";
import configData from "../../config/app";

export const getUserAuthTokens = function (userData:any) {
    let user = {
      id: userData.id,
      email: userData.email,
      user_type: userData.user_type,
      full_name: userData.full_name,
    };
  
    let tokenSecret = configData.jwt.token_secret
    let refreshTokenSecret = configData.jwt.refresh_token_secret
  
    const token = jwt.sign(user, tokenSecret, {
      expiresIn: configData.jwt.token_life,
    });
  
    const refreshToken = jwt.sign(user, refreshTokenSecret, {
      expiresIn: configData.jwt.refresh_token_life,
    });
    return {
      token,
      refreshToken,
    };
  };