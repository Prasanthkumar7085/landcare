import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getAllListMapsAPI = async () => {
    try {
        const { success, data } = await $fetch.get("/6698b3bfacd3cb34a867ba11");
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};