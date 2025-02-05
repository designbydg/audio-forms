import { SurveyFormNavbar } from "@/components/survey/SurveyFormNavbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-dashboard-background flex flex-col">
      <div className="bg-white">
        <SurveyFormNavbar />
      </div>
      <main className="container mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}