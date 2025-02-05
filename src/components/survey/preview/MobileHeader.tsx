import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "./SidebarContent";

interface MobileHeaderProps {
  title: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  isPreview?: boolean;
  onBack?: () => void;
}

export const MobileHeader = ({
  title,
  currentQuestionIndex,
  totalQuestions,
  isPreview,
  onBack,
}: MobileHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-sidebar-border flex items-center px-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-[#F8F9FB]">
          <SidebarContent
            title={title}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            isPreview={isPreview}
            onBack={onBack}
          />
        </SheetContent>
      </Sheet>
      <h2 className="ml-4 text-lg font-semibold truncate">{title}</h2>
    </div>
  );
};