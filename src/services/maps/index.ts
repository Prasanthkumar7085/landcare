import { ListMapsApiProps } from "@/interfaces/listMapsAPITypes";
import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getAllListMapsAPI = async (params: Partial<ListMapsApiProps>) => {
  try {
    const { success, data } = await $fetch.get("/api/v1.0/maps", params);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const addMapWithCordinatesAPI = async (body: any) => {
  try {
    const { success, data } = await $fetch.post("/api/v1.0/maps", body);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getSingleMapDetailsAPI = async (id: any) => {
  try {
    const { success, data } = await $fetch.get(`/api/v1.0/maps/${id}`);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getAllMapMarkersAPI = async (id: any, params: any) => {
  try {
    const { success, data } = await $fetch.get(`/api/v1.0/maps/${id}/markers`, params);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getSingleMapMarkersAPI = async (id: any, params: any) => {
  try {
    const { success, data } = await $fetch.get(`/api/v1.0/maps/${id}/markers`, params);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
