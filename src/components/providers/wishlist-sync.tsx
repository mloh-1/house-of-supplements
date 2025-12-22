"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/store/wishlist";

export function WishlistSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const setUser = useWishlistStore((state) => state.setUser);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setUser(session.user.id);
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status, setUser]);

  return <>{children}</>;
}
