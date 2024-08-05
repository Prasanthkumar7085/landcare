"use client";
import ViewGoogleMap from "@/components/Maps/ViewMap";
import { Suspense } from "react";

// const ViewGoogleMap = dynamic(() => import("@/components/Maps/ViewMap"), {
//   ssr:false,
// });
const ViewMapDetails = () => {
  return (
    <Suspense>
      <ViewGoogleMap />
    </Suspense>
  );
};
export default ViewMapDetails;
