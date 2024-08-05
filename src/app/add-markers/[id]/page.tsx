"use client";
import ViewGoogleMap from "@/components/Maps/ViewMap";
import { Suspense } from "react";

const AddMarkersPage = () => {
  return (
    <Suspense>
      <ViewGoogleMap />
    </Suspense>
  );
};
export default AddMarkersPage;
