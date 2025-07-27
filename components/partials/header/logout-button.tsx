"use client";

import { signOut } from "next-auth/react";
import { Icon } from "@/components/ui/icon";

export const LogoutButton = () => {
  const handleLogout = () => {
    console.log("🔴 Déconnexion côté client...");
    signOut({ callbackUrl: "/" });
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full flex items-center gap-2"
    >
      <Icon icon="heroicons:power" className="w-4 h-4" />
      Déconnexion
    </button>
  );
};