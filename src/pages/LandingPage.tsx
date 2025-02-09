import { useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/landing/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TargetAudienceSection } from "@/components/landing/TargetAudienceSection";

// Preload images
const logoImage = "/lovable-uploads/4751f363-c733-49b1-98b3-51fb0b312ed5.png";
const heroImage = "/lovable-uploads/136f4148-5136-471f-8872-132824c69ac5.png";

// Preload the images
const preloadImages = () => {
  const images = [logoImage, heroImage];
  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

const LandingPage = () => {
  // Preload images when component mounts
  useEffect(() => {
    preloadImages();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TargetAudienceSection />
      <Footer />
    </div>
  );
};

export default LandingPage;