"use client";
import { mapsSliceReducer } from "./maps.slice";

const combinedReducer = {
  ...mapsSliceReducer,
};

export * from "./maps.slice";
export default combinedReducer;
