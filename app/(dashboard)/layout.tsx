import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row h-screen">
      <Sidebar defaultCollapsed={false} />
      <div className="relative flex-1 h-screen">
        <div className="transition-all flex flex-col dark:bg-background bg-neutral-100 overflow-auto relative h-full duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}

