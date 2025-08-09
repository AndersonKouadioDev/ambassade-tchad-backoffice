import LayoutProvider from "@/providers/layout.provider";
import LayoutContentProvider from "@/providers/content.provider";
import DashCodeSidebar from "@/components/partials/sidebar";
import DashCodeFooter from "@/components/partials/footer";
import DashCodeHeader from "@/components/partials/header";
import { auth } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";
const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const session = await auth();
  const { locale } = await params;
  if (!session) {
    redirect({ href: "/", locale: locale });
  }
  return (
    <LayoutProvider>
      {/* <ThemeCustomize /> */}

      <DashCodeHeader />
      <DashCodeSidebar />
      <LayoutContentProvider>{children}</LayoutContentProvider>
      <DashCodeFooter />
    </LayoutProvider>
  );
};

export default layout;
