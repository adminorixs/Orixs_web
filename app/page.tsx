import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { PlatformShowcaseSection } from '@/components/PlatformShowcaseSection';
import { StackedCardsSection } from '@/components/StackedCardsSection';
import { WorkflowCarouselSection } from '@/components/WorkflowCarouselSection';
import { HomePageResourceSection } from '@/components/HomePageResourceSection';
import { FooterSection } from '@/components/FooterSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <PlatformShowcaseSection />
      <StackedCardsSection />
      <WorkflowCarouselSection />
      <HomePageResourceSection />
      <FooterSection />
    </>
  );
}
