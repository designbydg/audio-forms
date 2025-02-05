import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation Section */}
      <div className="container mx-auto px-4 py-6">
        <img 
          src="/lovable-uploads/4751f363-c733-49b1-98b3-51fb0b312ed5.png"
          alt="AudioForms Logo"
          className="h-12"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 mt-8 md:mt-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.4] mb-6">
            Capture Feedback, The Smarter Way—
            <span className="text-primary">With Audio</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
            Collect authentic voice insights from your users with audio-based forms and surveys—perfect for Product Managers, Marketers, and User Researchers seeking deeper engagement.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild className="text-base px-8">
              <Link to="/signup">Start for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>

        {/* Dashboard Preview Image */}
        <div className="relative mt-16 px-4">
          <div className="max-w-[1200px] mx-auto">
            <img
              src="/lovable-uploads/136f4148-5136-471f-8872-132824c69ac5.png"
              alt="AudioForms Dashboard Preview"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;