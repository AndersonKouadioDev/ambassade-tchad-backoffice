"use client";

import { Icon } from "@/components/ui/icon";
import { logout } from "@/features/auth/actions/auth.action";

export const LogoutButton = () => {
  return (
    <button
      onClick={async () => await logout()}
      className="w-full flex items-center gap-2"
    >
      <Icon icon="heroicons:power" className="w-4 h-4" />
      Déconnexion
    </button>
  );
};
