import { Copyright, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-6 border-t">
      <div className="container flex items-center justify-center text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Copyright className="h-4 w-4" />
          <span>2025, getaudioforms.com.</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> in the USA,
          </span>
          <span>for the world.</span>
        </div>
      </div>
    </footer>
  );
}