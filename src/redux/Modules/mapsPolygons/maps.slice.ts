"use client";
import { createSlice } from "@reduxjs/toolkit";
import { Maps } from "./maps";

const reducerName = "maps";

export const initialState: Maps.FAMaps = {
  polygonCoords: [],
  searchLocation: {},
};

export const mapsSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    storeEditPolygonCoords: (state: any, action: any) => {
      state.polygonCoords = action.payload;
    },
    storeSearchLocation: (state: any, action: any) => {
      state.searchLocation = action.payload;
    },
  },
});

export const { storeEditPolygonCoords, storeSearchLocation }: any =
  mapsSlice.actions;
export const mapsSliceReducer = { [reducerName]: mapsSlice.reducer };
