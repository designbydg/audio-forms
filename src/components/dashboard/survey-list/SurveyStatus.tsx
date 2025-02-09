import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getEmailLink } from "@/utils/emailUtils";

interface SurveyStatusProps {
  status: string;
}

const statusColors = {
  active: "bg-green-500",
  draft: "bg-[#F1F1F1]",
  closed: "bg-gray-500",
  published: "bg-[#d3f8e6]",
  unavailable: "bg-[#F1F1F1]"
};

const statusTextColors = {
  active: "text-white",
  draft: "text-[#403E43] font-normal",
  closed: "text-white",
  published: "text-[#0a7257] font-normal",
  unavailable: "text-[#403E43] font-normal"
};

const toTitleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function SurveyStatus({ status }: SurveyStatusProps) {
  const { toast } = useToast();

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = getEmailLink();
    toast({
      title: "Email client opened",
      description: "Please compose your upgrade request email.",
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Badge
        variant="secondary"
        className={cn(
          statusColors[status as keyof typeof statusColors] || "bg-gray-500",
          statusTextColors[status as keyof typeof statusTextColors] || "text-white",
          "hover:bg-opacity-100" // This prevents color change on hover
        )}
      >
        {toTitleCase(status)}
      </Badge>
      {status === 'unavailable' && (
        <Button
          variant="link"
          className="p-0 h-auto text-[#00A37A] hover:text-[#00A37A]/80 text-sm font-normal"
          onClick={handleUpgradeClick}
        >
          Upgrade
        </Button>
      )}
    </div>
  );
}