import { cn } from "@/lib/utils";

const LayoutPublic = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "flex min-h-svh w-full flex-col bg-default-100 dark:bg-background"
      )}
    >
      {children}
    </div>
  );
};

export default LayoutPublic;
