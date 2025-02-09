
import { Link } from "react-router-dom";
import { getEmailLink } from "@/utils/emailUtils";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Preload logo image
const logoImage = "/lovable-uploads/4751f363-c733-49b1-98b3-51fb0b312ed5.png";

export const Navigation = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <img 
            src={logoImage}
            alt="AudioForms Logo"
            className="h-12"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => setIsVideoOpen(true)}
              className="text-slate-600 hover:text-slate-900"
            >
              Product Demo
            </button>
            <a href={getEmailLink()} className="text-slate-600 hover:text-slate-900">
              Get in touch
            </a>
            <Link to="/login" className="text-slate-600 hover:text-slate-900">Login</Link>
            <Link to="/signup" className="text-slate-600 hover:text-slate-900">Sign up</Link>
          </div>
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
    </>
  );
};
