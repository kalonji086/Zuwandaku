"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoadingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/loading");
  }, [router]);

  return null;
}
