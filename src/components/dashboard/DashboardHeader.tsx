import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export function DashboardHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-4">
      <h1>Dashboard</h1>
      <Button onClick={() => navigate("/create-survey")}>
        <Plus className="h-4 w-4" />
        Create Survey
      </Button>
    </div>
  );
}