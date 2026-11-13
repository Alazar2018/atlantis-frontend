import Hero from "@/components/Hero";
import LandingStory from "@/components/LandingStory";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <LandingStory />
      <FeaturedProducts />
      <WhyChooseUs />
      <AboutSection />
    </div>
  );
}
