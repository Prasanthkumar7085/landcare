"use client";

import AddPolygon from "@/components/Maps/AddMap";
import { Suspense } from "react";

const UpdateMapDetailsPage = () => {
  return (
    <Suspense>
      <AddPolygon />
    </Suspense>
  );
};
export default UpdateMapDetailsPage;
