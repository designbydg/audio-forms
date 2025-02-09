import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getEmailLink } from "@/utils/emailUtils";

export const HelpMenu = () => {
  const handleEmailClick = () => {
    window.location.href = getEmailLink();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <div className="px-2 py-3">
          <h3 className="text-sm font-medium mb-2">
            Questions, Feedback, or Sales Inquiry? We're Here to Help!
          </h3>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleEmailClick} 
            className="w-full"
          >
            Email us
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};