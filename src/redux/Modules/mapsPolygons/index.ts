import { mapsSliceReducer } from ".";

const combinedReducer = {
  ...mapsSliceReducer,
};

export * from "./maps.slice";
export default combinedReducer;
