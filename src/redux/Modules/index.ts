import { combineReducers } from "@reduxjs/toolkit";
import userLoginReducer from "./userlogin";
export const combinedReducer = combineReducers({
  ...userLoginReducer,
});
