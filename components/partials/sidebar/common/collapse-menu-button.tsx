"use client";
import React, { CSSProperties } from "react";
import { Link, usePathname } from "@/components/navigation";
import { useState } from "react";
import { ChevronDown, Dot, LucideIcon } from "lucide-react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Submenu } from "@/lib/menus";

// for dnd

import {
  useSortable,
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useConfig } from "@/hooks/use-config";
import { MultiCollapseMenuButton } from "./classic-multi-collapse-button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMobileMenuConfig } from "@/hooks/use-mobile-menu";
import { useMenuHoverConfig } from "@/hooks/use-menu-hover";

interface CollapseMenuButtonProps {
  icon: string;
  label: string;
  active: boolean;
  submenus: Submenu[];
  collapsed: boolean | undefined;
  id: string;
}

export function CollapseMenuButton({
  icon,
  label,
  active,
  submenus,
  collapsed,
  id,
}: CollapseMenuButtonProps) {
  const pathname = usePathname();
  const isSubmenuActive = submenus.some(
    (submenu) => submenu.active || pathname.startsWith(submenu.href)
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);
  const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();
  const [config] = useConfig();
  const [hoverConfig] = useMenuHoverConfig();
  const { hovered } = hoverConfig;
  const sidebarTheme =
    config.sidebarTheme !== "light"
      ? `dark theme-${config.sidebarTheme}`
      : `theme-${config.sidebarTheme}`;
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: id,
  });

  React.useEffect(() => {
    setIsCollapsed(isSubmenuActive);
  }, [isSubmenuActive, pathname]);

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  if (config.sidebar === "compact" && isDesktop) {
    return (
      <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed}>
        <CollapsibleTrigger asChild>
          <Button
            variant={active ? "default" : "ghost"}
            fullWidth
            color={active ? "default" : "secondary"}
            className={cn(
              "flex-col h-auto py-1.5 px-3.5 capitalize font-semibold ring-offset-sidebar transition-all duration-200",
              {
                "data-[state=open]:bg-secondary": !active,
                "text-white hover:text-white hover:bg-embassy-blue-800/30":
                  !active,
              }
            )}
          >
            <Icon
              icon={icon}
              className={cn("h-6 w-6 mb-1 transition-colors", {
                "text-white": !active,
              })}
            />

            <p className={cn("max-w-[200px]  text-[11px] truncate ")}>
              {label}
            </p>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {submenus.map(({ href, label, active }, index) => (
            <Button
              key={index}
              color={active ? "default" : "secondary"}
              variant="ghost"
              fullWidth
              size="sm"
              className={cn(
                "w-full justify-center text-center p-0  h-auto hover:bg-transparent hover:text-default capitalize text-xs font-normal mb-2 first:mt-4 last:mb-0 transition-all duration-200",
                {
                  "font-semibold": active,
                  "text-white hover:text-white": !active,
                }
              )}
              asChild
            >
              <Link href={href}>{label}</Link>
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }
  return !collapsed || hovered ? (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed}>
      <CollapsibleTrigger className="" asChild>
        <div className="peer flex items-center group [&[data-state=open]>button>div>div>svg]:rotate-180">
          <Button
            style={style}
            ref={setNodeRef}
            variant={active ? "default" : "ghost"}
            color="secondary"
            className={cn(
              "justify-start capitalize group h-auto py-3 md:px-3 px-3 ring-offset-sidebar group-data-[state=open]:bg-secondary transition-all duration-200",
              {
                "hover:md:ps-8": config.sidebar === "draggable" && isDesktop,
                "text-white hover:text-white hover:bg-embassy-blue-800/30":
                  !active,
              }
            )}
            fullWidth
          >
            <div className="w-full items-center flex justify-between">
              <div className="flex items-center">
                {config.sidebar === "draggable" && isDesktop && (
                  <GripVertical
                    {...attributes}
                    {...listeners}
                    className={cn(
                      "inset-t-0 absolute me-1 h-5 w-5 ltr:-translate-x-6 rtl:translate-x-6 invisible opacity-0 group-hover:opacity-100 transition-all group-hover:visible ltr:group-hover:-translate-x-5 rtl:group-hover:translate-x-5 text-white",
                      {}
                    )}
                  />
                )}
                <span className="me-4">
                  <Icon
                    icon={icon}
                    className={cn("h-5 w-5 transition-colors", {
                      "text-white": !active,
                    })}
                  />
                </span>
                <p
                  className={cn(
                    "max-w-[150px] truncate",
                    !collapsed || hovered
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-96 opacity-0"
                  )}
                >
                  {label}
                </p>
              </div>
              <div
                className={cn(
                  "whitespace-nowrap inline-flex items-center justify-center rounded-full h-5 w-5 bg-embassy-blue-100 text-embassy-blue-600 group-hover:bg-embassy-blue-200 dark:bg-embassy-blue-800/40 dark:text-white dark:group-hover:bg-embassy-blue-700/60 transition-all duration-300",
                  !collapsed || hovered
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0",
                  {
                    "bg-embassy-blue-200 dark:bg-embassy-blue-700/60": active,
                  }
                )}
              >
                <ChevronDown
                  size={16}
                  className="transition-transform duration-200"
                />
              </div>
            </div>
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {submenus.map(({ href, label, active, children: subChildren }, index) =>
          subChildren?.length === 0 ? (
            <Button
              onClick={() =>
                setMobileMenuConfig({ ...mobileMenuConfig, isOpen: false })
              }
              key={index}
              color="secondary"
              variant="ghost"
              className={cn(
                "w-full justify-start h-auto hover:bg-transparent hover:ring-offset-0 capitalize text-sm font-normal mb-2 last:mb-0 first:mt-3 md:px-5 px-5 transition-all duration-200",
                {
                  "font-medium": active,
                  // White text for inactive items in both modes
                  "text-white hover:text-white": !active,
                }
              )}
              asChild
            >
              <Link href={href}>
                <span
                  className={cn(
                    "h-1.5 w-1.5 me-3 rounded-full transition-all duration-150 ring-1 ring-white",
                    {
                      "ring-4 bg-white ring-opacity-30 ring-white": active,
                    }
                  )}
                ></span>
                <p
                  className={cn(
                    "max-w-[170px] truncate",
                    !collapsed || hovered
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-96 opacity-0"
                  )}
                >
                  {label}
                </p>
              </Link>
            </Button>
          ) : (
            <React.Fragment key={index}>
              <MultiCollapseMenuButton
                label={label}
                active={active}
                submenus={subChildren as any}
              />
            </React.Fragment>
          )
        )}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={active ? "default" : "ghost"}
                color="secondary"
                className={cn(
                  "w-full justify-center transition-all duration-200",
                  {
                    "text-white hover:text-white hover:bg-embassy-blue-800/30":
                      !active,
                  }
                )}
                size="icon"
              >
                <Icon
                  icon={icon}
                  className={cn("h-5 w-5 transition-colors", {
                    "text-white": !active,
                  })}
                />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="start"
            alignOffset={2}
            className="bg-white/95 backdrop-blur-sm border-embassy-blue-200 dark:bg-slate-800/95 dark:border-embassy-blue-600/30"
          >
            <span className="text-embassy-blue-800 dark:text-white">
              {label}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent
        side="right"
        sideOffset={20}
        align="start"
        className={`bg-white/95 backdrop-blur-sm border-embassy-blue-200 dark:bg-slate-800/95 dark:border-embassy-blue-600/30 space-y-1.5 ${sidebarTheme}`}
      >
        <DropdownMenuLabel className="max-w-[190px] truncate text-embassy-blue-800 dark:text-white">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-embassy-blue-200 dark:bg-embassy-blue-600/30" />
        <DropdownMenuGroup>
          {submenus.map(({ href, label, icon, active, children }, index) =>
            children?.length === 0 ? (
              <DropdownMenuItem
                key={index}
                asChild
                className={cn(
                  "focus:bg-embassy-blue-50 dark:focus:bg-embassy-blue-800/30 text-white",
                  {
                    "bg-embassy-blue-100 text-embassy-blue-800 dark:bg-embassy-blue-800/40 dark:text-white":
                      active,
                  }
                )}
              >
                <Link className="cursor-pointer flex-flex gap-3" href={href}>
                  {icon && <Icon icon={icon} className="h-4 w-4" />}
                  <p className="max-w-[180px] truncate">{label} </p>
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuSub key={index}>
                <DropdownMenuSubTrigger className="text-white">
                  <span>{label}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-white/95 backdrop-blur-sm border-embassy-blue-200 dark:bg-slate-800/95 dark:border-embassy-blue-600/30">
                    <ScrollArea className="h-[200px]">
                      {children?.map(({ href, label, active }, index) => (
                        <DropdownMenuItem
                          key={`nested-index-${index}`}
                          className="text-white"
                        >
                          <Link href={href}>{label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
