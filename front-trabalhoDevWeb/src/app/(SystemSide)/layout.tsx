import Sidebar from "@/components/autoral/sidebar/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      {/* Para fundo exclusivo das páginas internas, adicione uma classe de bg aqui ou num wrapper */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}