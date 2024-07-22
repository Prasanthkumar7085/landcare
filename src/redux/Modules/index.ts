import { combineReducers } from "@reduxjs/toolkit";
import userLoginReducer from "./userlogin";
import mapsSliceReducer from "./mapsPolygons";
export const combinedReducer = combineReducers({
  ...userLoginReducer,
  ...mapsSliceReducer,
});
