import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  path: string;
  label: string;
}

interface NavItemsProps {
  items: NavItem[];
  isMobile?: boolean;
  onMobileItemClick?: () => void;
}

export const NavItems = ({ items, isMobile = false, onMobileItemClick }: NavItemsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col py-2">
        {items.map(({ path, label }) => (
          <Button
            key={path}
            variant="ghost"
            className={cn(
              "justify-start px-4 py-2 w-full",
              isActive(path) 
                ? "text-foreground font-medium bg-gray-50" 
                : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
            )}
            onClick={() => {
              !isActive(path) && navigate(path);
              onMobileItemClick?.();
            }}
          >
            {label}
          </Button>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden sm:flex items-center space-x-6 ml-8">
      {items.map(({ path, label }) => (
        <Button
          key={path}
          variant="link"
          className={cn(
            "flex items-center",
            isActive(path) 
              ? "text-foreground font-medium pointer-events-none" 
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => !isActive(path) && navigate(path)}
        >
          {label}
        </Button>
      ))}
    </nav>
  );
};