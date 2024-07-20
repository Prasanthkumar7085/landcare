import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const signInAPI = async (payload: {
    email: string;
    password: string;
}) => {
    try {
        const { success, data } = await $fetch.post("/api/v1.0/users/signin", payload);

        if (!success) {
            return handleAPIErrorResponse(data);
        }

        return data;
    } catch (err) {
        console.error(err);
    }
};