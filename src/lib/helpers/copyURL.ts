import { toast } from "sonner";

export const copyURL = async (link: any) => {
  try {
    await navigator.clipboard.writeText(link);
    toast.info("Link copied!");
  } catch (err) {
    toast.error("Failed to copy link");
  }
};

export const copyEmbededIframeUrl = async (link: any) => {
  try {
    await navigator.clipboard.writeText(link);
    toast.info("HTML Link copied!");
  } catch (err) {
    toast.error("Failed to copy link");
  }
};
export const copyEmbededIframeUrlForMarker = async (
  id: any,
  marker_id?: any
) => {
  const link = `<iframe
       src=https://dev-landcare.vercel.app/landcare-map/${id}?marker_id=${marker_id}
       width="600"
       height="450"
       style="border:0;"
       loading="lazy"
       referrerpolicy="no-referrer-when-downgrade"
     ></iframe>`;
  try {
    await navigator.clipboard.writeText(link);
    toast.info("HTML Link copied!");
  } catch (err) {
    toast.error("Failed to copy link");
  }
};
