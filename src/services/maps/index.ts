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