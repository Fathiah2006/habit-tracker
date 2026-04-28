"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/src/components/shared/SplashScreen";
import { getSession } from "@/src/lib/storage";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getSession();
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return showSplash ? <SplashScreen /> : null;
}
