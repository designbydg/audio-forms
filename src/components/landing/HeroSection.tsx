
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

// Preload hero image
const heroImage = "/lovable-uploads/136f4148-5136-471f-8872-132824c69ac5.png";

export const HeroSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 mt-8 md:mt-12">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.4] mb-6">
          Capture Feedback, The Smarter Way—
          <span className="text-primary">With AI-Powered Audio Surveys</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
          Leverage AI to convert voice responses into text, analyze sentiment, and extract key insights—all through audio-based forms and surveys. Perfect for Product Managers, User Researchers and Marketers.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild className="text-base px-8">
            <Link to="/signup">Start for Free</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-base px-8"
            onClick={() => setIsVideoOpen(true)}
          >
            Watch Demo
          </Button>
        </div>
      </div>

      <div className="relative mt-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <img
            src={heroImage}
            alt="AudioForms Dashboard Preview"
            className="w-full h-auto"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-[800px] p-0">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/VMYqZoOHaF4?autoplay=1"
              title="Product Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

