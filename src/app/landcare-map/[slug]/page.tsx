"use client";
import PublicMap from "@/components/Maps/ViewMap/PublicMap";
// import ViewGoogleMap from "@/components/Maps/ViewMap";
import { Suspense } from "react";
const PublicEmbededMapPage = () => {
  return (
    <Suspense>
      <PublicMap />
    </Suspense>
  );
};
export default PublicEmbededMapPage;
