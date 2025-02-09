import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotificationsMenu } from "./navbar/NotificationsMenu";
import { UserMenu } from "./navbar/UserMenu";
import { NavItems } from "./navbar/NavItems";
import { useToast } from "@/hooks/use-toast";
import { HelpMenu } from "./navbar/HelpMenu";

interface Notification {
  id: string;
  surveyId: string;
  surveyTitle: string;
  timestamp: string;
}

export const SurveyFormNavbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name || 'User');
        }
      }
    };

    fetchUserProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    console.log("Setting up real-time subscription for responses in navbar...");
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'responses'
        },
        async (payload) => {
          console.log("Received new response in navbar:", payload);
          
          const { data: survey } = await supabase
            .from('surveys')
            .select('title')
            .eq('id', payload.new.survey_id)
            .single();

          if (survey) {
            console.log("Found survey for notification:", survey);
            
            const newNotification: Notification = {
              id: payload.new.id,
              surveyId: payload.new.survey_id,
              surveyTitle: survey.title,
              timestamp: new Date().toLocaleString(),
            };

            setNotifications(prev => [newNotification, ...prev]);
            
            toast({
              title: "New Response Received",
              description: `New response for survey: ${survey.title}`,
            });
          }
        }
      )
      .subscribe();

    console.log("Subscription set up complete in navbar");

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [navigate, toast]);

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/surveys', label: 'Surveys' },
    { path: '/responses', label: 'Responses' },
    { path: '/insights', label: 'Insights' }
  ];

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto relative">
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden mr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        <div className="flex items-center space-x-4 sm:space-x-8">
          <img 
            src="/lovable-uploads/f573226b-2f6e-4349-b6a2-81e41a413354.png"
            alt="AudioForms Logo"
            className="h-10 cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        <NavItems items={navItems} />

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b sm:hidden z-50">
            <NavItems 
              items={navItems} 
              isMobile={true} 
              onMobileItemClick={() => setIsMenuOpen(false)} 
            />
          </div>
        )}

        <div className="ml-auto flex items-center space-x-4">
          <NotificationsMenu 
            notifications={notifications}
            setNotifications={setNotifications}
          />
          <HelpMenu />
          <UserMenu userName={userName} />
        </div>
      </div>
    </div>
  );
};