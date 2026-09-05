import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { DashboardSection } from '@/components/DashboardSection';
import { StackedCardsSection } from '@/components/StackedCardsSection';
import { WorkflowCarouselSection } from '@/components/WorkflowCarouselSection';
import { HomePageResourceSection } from '@/components/HomePageResourceSection';
import { FooterSection } from '@/components/FooterSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <DashboardSection />
      <StackedCardsSection />
      <WorkflowCarouselSection />
      <HomePageResourceSection />
      <FooterSection />
    </>
  );
}
