import { ListMapsApiProps } from "@/interfaces/listMapsAPITypes";
import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getAllListMapsAPI = async (params: Partial<ListMapsApiProps>) => {
  try {
    const { success, data } = await $fetch.get("/api/v2.0/maps", params);
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
    const { success, data } = await $fetch.post("/api/v2.0/maps", body);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const updateMapWithCordinatesAPI = async (body: any, id: any) => {
  try {
    const { success, data } = await $fetch.patch(`/api/v2.0/maps/${id}`, body);
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
    const { success, data } = await $fetch.get(`/api/v2.0/maps/${id}`);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getSingleMapDetailsBySlugAPI = async (slug: any) => {
  try {
    const { success, data } = await $fetch.get(`/api/v2.0/map/${slug}`);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
export const addMarkerDeatilsAPI = async (id: any, body: any) => {
  try {
    const { success, data } = await $fetch.post(
      `/api/v2.0/maps/${id}/markers`,
      body
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
export const updateMarkerDeatilsAPI = async (
  id: any,
  body: any,
  markerID: any
) => {
  try {
    const { success, data } = await $fetch.patch(
      `/api/v2.0/maps/${id}/markers/${markerID}`,
      body
    );
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
    const { success, data } = await $fetch.get(
      `/api/v2.0/maps/${id}/markers`,
      params
    );
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
    const { success, data } = await $fetch.get(
      `/api/v2.0/maps/${id}/markers`,
      params
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getSingleMarkerAPI = async (id: any, lat: any, lag: any) => {
  try {
    const { success, data } = await $fetch.get(
      `/api/v2.0/maps/${id}/markers/coordinates/${lat}/${lag}`
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getMapsCounts = async (queryParams: any) => {
  try {
    const { success, data } = await $fetch.get(
      `/api/v2.0/maps/stats`,
      queryParams
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteMarkerAPI = async (id: any, marker_id: any) => {
  try {
    const { success, data } = await $fetch.delete(
      `/api/v2.0/maps/${id}/markers/${marker_id}`
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteMapAPI = async (id: any) => {
  try {
    const { success, data } = await $fetch.delete(`/api/v2.0/maps/${id}`);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteAllMarkersAPI = async (id: any) => {
  try {
    const { success, data } = await $fetch.delete(
      `/api/v2.0/maps/${id}/markers`
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const changeStatusOfMapAPI = async (id: any, body: any) => {
  try {
    const { success, data } = await $fetch.patch(
      `/api/v2.0/maps/${id}/status`,
      body
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const importMapAPI = async (id: any, body: any) => {
  try {
    const { success, data } = await $fetch.post(
      `/api/v2.0/maps/${id}/markers/import`,
      body
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getStaticMapAPI = async (payload: any) => {
  try {
    const { success, data } = await $fetch.post(
      `/api/v2.0/maps/static-map`,
      payload
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
