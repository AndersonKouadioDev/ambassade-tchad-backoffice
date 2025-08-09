"use client"
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

export function ButtonGoLink({
  href,
  children,
  ...params
}: {
  href: string;
  children?: React.ReactNode;
} & ButtonProps) {
  const router = useRouter();

  const handleCancel = () => {
    router.push(href);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-white hover:bg-white/20"
      {...params}
      onClick={handleCancel}
    >
      {children || <ArrowLeft className="w-6 h-6" />}
    </Button>
  );
}
