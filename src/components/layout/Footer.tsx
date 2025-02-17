
import { Copyright, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { getEmailLink } from "@/utils/emailUtils";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function Footer() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-center space-y-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Copyright className="h-4 w-4" />
            <span>2025, Audioforms.</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> in the USA.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="hover:text-foreground transition-colors">
              Terms of Use
            </Link>
            <button 
              onClick={() => setIsVideoOpen(true)}
              className="hover:text-foreground transition-colors"
            >
              Product Demo
            </button>
            <a href={getEmailLink()} className="hover:text-foreground transition-colors">
              Get in touch
            </a>
          </div>
        </div>
      </footer>

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
}
