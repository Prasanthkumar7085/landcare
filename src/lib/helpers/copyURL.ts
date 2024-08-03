import { toast } from "sonner";

export const copyURL = async (id: any) => {
  const link = `https://dev-landcare.vercel.app/landcare-map/${id}`;
  try {
    await navigator.clipboard.writeText(link);
    toast.info("Link copied!");
  } catch (err) {
    toast.error("Failed to copy link");
  }
};

export const copyEmbededIframeUrl = async (id: any) => {
  const link = `<iframe
       src=https://dev-landcare.vercel.app/landcare-map/${id}
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
