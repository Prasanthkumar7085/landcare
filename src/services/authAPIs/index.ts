import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const signInAPI = async (payload: {
    email: string;
    password: string;
}) => {
    try {
        const { success, data } = await $fetch.post("/users/sign-in", payload);

        if (!success) {
            return handleAPIErrorResponse(data);
        }

        return data;
    } catch (err) {
        console.error(err);
    }
};