import { SiteHeader } from "@/components/layout/site-header";
import { Footer } from "@/components/layout";

export default function GigsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
} 