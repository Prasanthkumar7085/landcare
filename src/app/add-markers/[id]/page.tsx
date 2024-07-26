"use client";
// import ViewGoogleMap from "@/components/Maps/ViewMap";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ViewGoogleMap = dynamic(() => import("@/components/Maps/ViewMap"), {
  ssr: false,
});
const AddMarkersPage = () => {
  return (
    <Suspense>
      <ViewGoogleMap />
    </Suspense>
  );
};
export default AddMarkersPage;
