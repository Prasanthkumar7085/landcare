import { toast } from "sonner";

export const copyURL = async (id: any) => {
    const link = `https://dev-landcare.vercel.app/view-map/${id}`;
    try {
        await navigator.clipboard.writeText(link);
        toast.success("Link copied!");
    } catch (err) {
        toast.error("Failed to copy link");
    }

};