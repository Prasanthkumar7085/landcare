"use client";
import ViewGoogleMap from "@/components/Maps/ViewMap";
import { Suspense } from "react";

const ViewMapDetails = () => {
  return (
    <Suspense>
      <ViewGoogleMap />
    </Suspense>
  );
};
export default ViewMapDetails;
