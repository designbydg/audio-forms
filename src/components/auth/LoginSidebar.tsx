import { Link } from "react-router-dom";

export const LoginSidebar = () => {
  return (
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
      <div className="absolute inset-0 bg-zinc-900" />
      <div className="relative z-20 flex items-center text-lg font-medium">
        <Link to="/">
          <img 
            src="/lovable-uploads/c0ed66b8-2a21-402d-a01e-15921c55100b.png" 
            alt="AudioForms Logo" 
            className="h-8 w-auto"
            loading="eager"
            fetchPriority="high"
          />
        </Link>
      </div>
    </div>
  );
};