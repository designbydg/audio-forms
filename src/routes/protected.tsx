
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "@/pages/Index";
import CreateSurvey from "@/pages/CreateSurvey";
import EditSurvey from "@/pages/EditSurvey";
import ViewResponses from "@/pages/ViewResponses";
import SurveyInsights from "@/pages/SurveyInsights";
import Surveys from "@/pages/Surveys";
import SurveyResponses from "@/pages/SurveyResponses";
import InsightsPage from "@/pages/Insights";

// Protected Route component with loading state
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export const protectedRoutes = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
  },
  {
    path: "/surveys",
    element: (
      <ProtectedRoute>
        <Surveys />
      </ProtectedRoute>
    ),
  },
  {
    path: "/create-survey",
    element: (
      <ProtectedRoute>
        <CreateSurvey />
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit-survey/:id",
    element: (
      <ProtectedRoute>
        <EditSurvey />
      </ProtectedRoute>
    ),
  },
  {
    path: "/view-responses/:id",
    element: (
      <ProtectedRoute>
        <ViewResponses />
      </ProtectedRoute>
    ),
  },
  {
    path: "/responses",
    element: (
      <ProtectedRoute>
        <SurveyResponses />
      </ProtectedRoute>
    ),
  },
  {
    path: "/responses/:id",
    element: (
      <ProtectedRoute>
        <SurveyResponses />
      </ProtectedRoute>
    ),
  },
  {
    path: "/insights",
    element: (
      <ProtectedRoute>
        <InsightsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/insights/:id",
    element: (
      <ProtectedRoute>
        <InsightsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/survey-insights/:id",
    element: (
      <ProtectedRoute>
        <SurveyInsights />
      </ProtectedRoute>
    ),
  },
];
