import { AdminHeader } from "@/components/autoral/admin/header";

export default function SystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5ff]">
      {/* Novo Header Superior */}
      <AdminHeader />
      
      {/* Conteúdo da página (sem margem lateral) */}
      <main className="flex-1 container mx-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}