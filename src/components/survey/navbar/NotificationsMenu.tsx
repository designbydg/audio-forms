import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  surveyId: string;
  surveyTitle: string;
  timestamp: string;
}

interface NotificationsMenuProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export const NotificationsMenu = ({ notifications, setNotifications }: NotificationsMenuProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        {notifications.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No new responses
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="p-4 cursor-pointer"
              onClick={() => {
                navigate(`/view-responses/${notification.surveyId}`);
                setNotifications(notifications.filter(n => n.id !== notification.id));
              }}
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{notification.surveyTitle}</span>
                <span className="text-xs text-muted-foreground">
                  {notification.timestamp}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};