"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LogoutButton } from "./logout-button";
import { useSession } from "next-auth/react";
import { getFullUrlFile } from "@/utils/getFullUrlFile";

const ProfileInfo = () => {
  const session = useSession();
  const [user, setUser] = useState(session?.data?.user);

  useEffect(() => {
    setUser(session?.data?.user);
  }, [session]);

  return (
    <div className="md:block hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <div className="flex items-center gap-3 text-embassy-blue-800 hover:bg-embassy-blue-50  bg-embassy-blue-50 rounded-lg px-2 py-1 transition-all duration-200 dark:text-embassy-blue-200 dark:hover:bg-embassy-blue-800/30">
            <Image
              src={
                user?.image
                  ? getFullUrlFile(user?.image)
                  : "/images/all-img/user3.png"
              }
              alt={user?.name?.charAt(0) || "User"}
              width={36}
              height={36}
              className="rounded-full border-2 border-embassy-blue-200 dark:border-embassy-blue-600"
            />
            <div className="text-sm font-semibold capitalize lg:block hidden">
              {user?.name}
            </div>
            <span className="text-base me-2.5 lg:inline-block hidden text-white dark:text-embassy-blue-400">
              <Icon icon="heroicons-outline:chevron-down"></Icon>
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 p-0 bg-white/95 backdrop-blur-sm border border-embassy-blue-200 shadow-xl dark:bg-slate-800/95 dark:border-embassy-blue-400/30"
          align="end"
        >
          <DropdownMenuLabel className="flex gap-3 items-center mb-1 p-4 border-b border-embassy-blue-100 dark:border-embassy-blue-700/30">
            <Image
              src={user?.image || "/images/all-img/user3.png"}
              alt={user?.name?.charAt(0) || "User"}
              width={40}
              height={40}
              className="rounded-full border-2 border-embassy-blue-200 dark:border-embassy-blue-600"
            />
            <div>
              <div className="text-sm font-semibold text-embassy-blue-800 capitalize dark:text-embassy-blue-200">
                {user?.name}
              </div>
              <Link
                href="/dashboard"
                className="text-xs text-embassy-blue-600 hover:text-embassy-blue-800 transition-colors dark:text-embassy-blue-400 dark:hover:text-embassy-blue-300"
              >
                {user?.email}
              </Link>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {[
              {
                name: "Profil",
                icon: "heroicons:user",
                href: "/user-profile",
              },
              {
                name: "Paramètres",
                icon: "heroicons:paper-airplane",
                href: "/dashboard",
              },
            ].map((item, index) => (
              <Link
                href={item.href}
                key={`info-menu-${index}`}
                className="cursor-pointer"
              >
                <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-embassy-blue-700 capitalize px-3 py-2 cursor-pointer hover:bg-embassy-blue-50 rounded-lg mx-2 transition-colors duration-200 dark:text-embassy-blue-300 dark:hover:bg-embassy-blue-800/50">
                  <Icon
                    icon={item.icon}
                    className="w-4 h-4 text-embassy-blue-600 dark:text-embassy-blue-400"
                  />
                  {item.name}
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {[
                    {
                      name: "email",
                    },
                    {
                      name: "message",
                    },
                  ].map((item, index) => (
                    <Link
                      href="/dashboard"
                      key={`message-sub-${index}`}
                      className="cursor-pointer"
                    >
                      <DropdownMenuItem className="text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                        {item.name}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="mb-0 bg-embassy-blue-100 dark:bg-embassy-blue-700/30" />
          <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-embassy-red-600 capitalize my-2 px-3 cursor-pointer hover:bg-embassy-red-50 rounded-lg mx-2 transition-colors duration-200 dark:text-embassy-red-400 dark:hover:bg-embassy-red-900/30">
            <div>
              <LogoutButton />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ProfileInfo;
