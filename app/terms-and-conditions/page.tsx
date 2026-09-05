import { Navbar } from '../../components/Navbar';
import { FooterSection } from '../../components/FooterSection';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fa] pt-20 pb-0 flex flex-col">
      <Navbar />
      <section className="max-w-3xl mx-auto px-4 py-16 flex-1">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-8">Terms and Conditions for askOrixs.ai (Orixs Platform)</h1>
        <div className="text-gray-800 text-lg space-y-6">
          <div>
            <span className="font-bold">1. Introduction</span><br />
            Welcome to askOrixs.ai, a platform provided by Trusphere Technologies Private Limited ("Company", "we", "our", or "us"). These Terms and Conditions ("Terms") govern your use of our website and services provided through the Orixs platform ("Service"). By accessing or using the Service, you agree to be bound by these Terms.
          </div>
          <div>
            <span className="font-bold">2. Eligibility</span><br />
            You must be at least 18 years old or the legal age of majority in your jurisdiction to use our Service. By using the Service, you represent and warrant that you meet these requirements.
          </div>
          <div>
            <span className="font-bold">3. Use of the Service</span><br />
            You agree to use the Service only for lawful purposes.<br />
            You will not use the Service to transmit any content that is unlawful, harmful, abusive, or otherwise objectionable.<br />
            You will not attempt to gain unauthorized access to any part of the Service.
          </div>
          <div>
            <span className="font-bold">4. Account Registration</span><br />
            Some features of the Service may require registration. You agree to provide accurate and complete information and to keep it up to date. You are responsible for maintaining the confidentiality of your login credentials.
          </div>
          <div>
            <span className="font-bold">5. Intellectual Property</span><br />
            All content, trademarks, logos, and other intellectual property on the Service are the property of Trusphere Technologies Private Limited or its licensors. You may not reproduce, distribute, or use any content without our prior written consent.
          </div>
          <div>
            <span className="font-bold">6. User-Generated Content</span><br />
            You retain ownership of any content you submit to the Service, but you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute such content in connection with the Service.
          </div>
          <div>
            <span className="font-bold">7. Third-Party Services</span><br />
            Our Service may contain links to third-party websites or services. We are not responsible for the content, policies, or practices of third-party services.
          </div>
          <div>
            <span className="font-bold">8. Disclaimers</span><br />
            The Service is provided "as is" and "as available" without warranties of any kind. We do not warrant that the Service will be uninterrupted or error-free.
          </div>
          <div>
            <span className="font-bold">9. Limitation of Liability</span><br />
            To the fullest extent permitted by law, Trusphere Technologies Private Limited shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the Service.
          </div>
          <div>
            <span className="font-bold">10. Indemnification</span><br />
            You agree to indemnify and hold harmless Trusphere Technologies Private Limited from any claims, damages, or expenses arising out of your use of the Service or your violation of these Terms.
          </div>
          <div>
            <span className="font-bold">11. Termination</span><br />
            We reserve the right to suspend or terminate your access to the Service at our sole discretion, with or without notice, for conduct that we believe violates these Terms or is harmful to other users or us.
          </div>
          <div>
            <span className="font-bold">12. Governing Law</span><br />
            These Terms shall be governed by the laws of India, without regard to its conflict of law provisions. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
          </div>
          <div>
            <span className="font-bold">13. Contact Information</span><br />
            For any questions about these Terms, please contact us at: <a href="mailto:contact@askOrixs.ai" className="text-purple-600 underline">contact@askOrixs.ai</a>
          </div>
        </div>
      </section>
      <FooterSection />
    </main>
  );
} 