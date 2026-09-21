import { Navbar } from '@/components/Navbar';
import { PlatformShowcaseSection } from '@/components/PlatformShowcaseSection';
import { StackedCardsSection } from '@/components/StackedCardsSection';
import { WorkflowCarouselSection } from '@/components/WorkflowCarouselSection';
import { FooterSection } from '@/components/FooterSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <PlatformShowcaseSection />
      <StackedCardsSection />
      <WorkflowCarouselSection />
      <FooterSection />
    </>
  );
}
