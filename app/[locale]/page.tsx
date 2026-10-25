import { Navbar } from '@/components/Navbar';
import { PlatformShowcaseSection } from '@/components/PlatformShowcaseSection';
import { OnePageProductSections } from '@/components/OnePageProductSections';
import { FooterSection } from '@/components/FooterSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <PlatformShowcaseSection />
      <OnePageProductSections />
      <FooterSection />
    </>
  );
}
