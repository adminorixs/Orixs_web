'use client';

import { useParams } from 'next/navigation';
import { caseStudies } from '../../../components/caseStudiesData';
import { Navbar } from '../../../components/Navbar';
import { FooterSection } from '../../../components/FooterSection';
import CaseStudyDetailsClient from '../../../components/CaseStudyDetailsClient';

export default function CaseStudyDetailsPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';
  
  // Find the case study by slug from the static data
  const caseStudy = caseStudies.find((c) => c.slug === slug);
  
  // Handle not found case
  if (!caseStudy) {
    return (
      <main className="min-h-screen bg-white pt-20 pb-0">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Case Study not found</h1>
          <p>The case study you're looking for doesn't exist.</p>
        </div>
        <FooterSection />
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-white pt-20 pb-0">
      <Navbar />
      <CaseStudyDetailsClient caseStudy={caseStudy} />
      <FooterSection />
    </main>
  );
} 