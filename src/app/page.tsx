import Image from "next/image";
import styles from "./page.module.css";
import { Suspense } from "react";
import LoginPage from "@/components/Auth/SignIn/indx";

export default function Home() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
