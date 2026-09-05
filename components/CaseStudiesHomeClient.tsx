'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, FormEvent } from 'react';

const industryIcons = [
  { name: 'Hospitality', icon: '/icons/hospitality.svg' },
  { name: 'Retail', icon: '/icons/retail.svg' },
  { name: 'Technology & IT', icon: '/icons/technology.svg' },
  { name: 'Manufacturing', icon: '/icons/manufacturing.svg' },
  { name: 'Finance', icon: '/icons/finance.svg' },
  { name: 'Education', icon: '/icons/education.svg' },
  { name: 'Consulting', icon: '/icons/consulting.svg' },
  { name: 'Healthcare', icon: '/icons/healthcare.svg' },
];

export default function CaseStudiesHomeClient({ caseStudies }: { caseStudies: any[] }) {
  const imagesRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const [showDemoForm, setShowDemoForm] = useState(false);
  
  // Form state for Demo form
  const [demoFormData, setDemoFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+1',
    contactNumber: '',
    organisation: '',
    designation: '',
    preferredDate: '',
    preferredTime: '',
    specificTopics: ''
  });
  
  // Handle input change for Demo form
  const handleDemoFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDemoFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle Demo form submission
  const handleDemoFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Format data for WhatsApp
    const message = `*Schedule a Demo*
Name: ${demoFormData.fullName}
Email: ${demoFormData.email}
Contact: ${demoFormData.countryCode}${demoFormData.contactNumber}
Organisation: ${demoFormData.organisation}
Designation: ${demoFormData.designation}
Preferred Date: ${demoFormData.preferredDate || 'Not specified'}
Preferred Time: ${demoFormData.preferredTime || 'Not specified'}
Topics to Cover: ${demoFormData.specificTopics || 'N/A'}
Interested in: Orixs AI-Driven SaaS Management Solutions`;
    
    // Open WhatsApp with the details
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/7416102647?text=${encodedMessage}`, '_blank');
    
    // Close the form
    setShowDemoForm(false);
  };

  return (
    <>
      {/* Hero section with responsive improvements */}
      <div className="w-full flex justify-center items-center py-3 sm:py-6 md:py-8 lg:py-10 bg-white relative" style={{ minHeight: '180px', maxHeight: '550px' }}>
        <div className="relative w-full max-w-[1600px] mx-auto">
          <Image
            src="/gif/case study.gif"
            alt="Case Study GIF"
            width={1440}
            height={493}
            className="object-contain w-full h-auto"
            priority
          />
          <div className="absolute top-0 left-0 flex flex-col items-center xs:items-start justify-start pt-3 xs:pt-4 sm:pt-10 md:pt-16 lg:pt-24 px-4 sm:pl-8 md:pl-12 lg:pl-16 w-full max-w-full xs:max-w-[90%]">
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-light text-black text-center xs:text-left mb-1 sm:mb-3 drop-shadow-lg">
              Empowering Businesses with AI-Driven SaaS<br className="hidden sm:block" />
              <span className="block mt-0.5 sm:mt-2 md:mt-3 lg:mt-4">Management Solutions</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-xl text-black text-center xs:text-left font-normal drop-shadow-lg mb-2 sm:mb-4 md:mb-5 max-w-full sm:max-w-[90%] md:max-w-[80%]">
              Orixs Integrates AI To Streamline Operations, Cut Costs, And Boost Efficiency.
            </p>
            <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-5 justify-center xs:justify-start w-full xs:w-auto">
              <button className="bg-purple-600 text-white px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-semibold hover:bg-purple-700 transition whitespace-nowrap">Start Free Trial →</button>
              <button 
                onClick={() => setShowDemoForm(true)}
                className="bg-white text-purple-600 px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-semibold border border-purple-600 hover:bg-purple-50 transition whitespace-nowrap"
              >
                Request a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Case Studies with improved responsiveness */}
      <section className="w-full bg-[#f7fafc] py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-xl sm:text-2xl md:text-3xl font-medium mb-6 sm:mb-8 md:mb-10">
            Featured <Link href="/case-studies" className="text-purple-600 hover:underline">Case Studies</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {caseStudies.slice(0, 3).map((cs) => (
              <div key={cs.slug} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
                {/* Image with responsive height */}
                <div className="w-full h-40 sm:h-44 md:h-48 lg:h-52 overflow-hidden">
                  <Image 
                    src={cs.image} 
                    alt={cs.title} 
                    width={400} 
                    height={200} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                
                {/* Content with better padding for different screen sizes */}
                <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 line-clamp-2">{cs.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-5 line-clamp-3">{cs.summary}</p>
                  
                  {/* Stats with responsive styling */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6 mt-auto">
                    {cs.stats.slice(0, 3).map((stat: { value: string; label: string }, i: number) => (
                      <div key={i} className="flex flex-col items-center bg-gray-50 p-2 sm:p-2.5 md:p-3 rounded">
                        <span className="text-base sm:text-lg md:text-xl font-bold text-purple-600">{stat.value}</span>
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-600 text-center mt-1 line-clamp-2">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link 
                    href={`/case-studies/${cs.slug}`} 
                    className="text-purple-600 text-sm sm:text-base font-semibold hover:underline flex items-center gap-1 mt-1 sm:mt-2"
                  >
                    Read More <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
            <Link href="/case-studies" className="inline-block bg-white text-purple-600 border border-purple-600 px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-purple-50 transition">
              View All Case Studies
            </Link>
          </div>
        </div>
      </section>
      
      {/* Schedule a Demo Form Modal */}
      {showDemoForm && (
        <div className="fixed inset-0 bg-black/40 flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 md:p-6 pt-10 sm:pt-3 overflow-y-auto">
          <form onSubmit={handleDemoFormSubmit} className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-xl flex flex-col gap-3 sm:gap-4 my-4 sm:my-0 overflow-y-auto max-h-[90vh]">
            <div className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2 text-black">Schedule a Demo</div>
            <input 
              type="text" 
              name="fullName" 
              placeholder="Full Name" 
              className="border rounded px-3 py-2 text-sm sm:text-base" 
              required 
              value={demoFormData.fullName}
              onChange={handleDemoFormChange}
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              className="border rounded px-3 py-2 text-sm sm:text-base" 
              required 
              value={demoFormData.email}
              onChange={handleDemoFormChange}
            />
            <div className="flex gap-2">
              <select 
                name="countryCode" 
                className="border rounded px-2 py-2 text-sm sm:text-base w-20 sm:w-24"
                value={demoFormData.countryCode}
                onChange={handleDemoFormChange}
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
                <option value="+61">+61</option>
                <option value="+81">+81</option>
              </select>
              <input 
                type="tel" 
                name="contactNumber" 
                placeholder="Contact Number" 
                className="border rounded px-3 py-2 flex-1 text-sm sm:text-base" 
                required 
                value={demoFormData.contactNumber}
                onChange={handleDemoFormChange}
              />
            </div>
            <input 
              type="text" 
              name="organisation" 
              placeholder="Organisation" 
              className="border rounded px-3 py-2 text-sm sm:text-base" 
              required 
              value={demoFormData.organisation}
              onChange={handleDemoFormChange}
            />
            <input 
              type="text" 
              name="designation" 
              placeholder="Designation" 
              className="border rounded px-3 py-2 text-sm sm:text-base" 
              required 
              value={demoFormData.designation}
              onChange={handleDemoFormChange}
            />
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-700 mb-1">Preferred Date and Time (optional)</div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="date" 
                  name="preferredDate" 
                  className="border rounded px-3 py-2 flex-1 text-sm sm:text-base" 
                  value={demoFormData.preferredDate}
                  onChange={handleDemoFormChange}
                />
                <input 
                  type="time" 
                  name="preferredTime" 
                  className="border rounded px-3 py-2 flex-1 text-sm sm:text-base" 
                  value={demoFormData.preferredTime}
                  onChange={handleDemoFormChange}
                />
              </div>
            </div>
            <textarea 
              name="specificTopics"
              placeholder="Any specific topics you'd like to cover during the demo?" 
              className="border rounded px-3 py-2 text-sm sm:text-base min-h-[80px]"
              value={demoFormData.specificTopics}
              onChange={handleDemoFormChange}
            ></textarea>
            <div className="flex gap-2 mt-2 mb-2">
              <button type="submit" className="flex-1 bg-purple-600 text-white rounded-lg px-3 py-2 text-sm sm:text-base font-semibold hover:bg-purple-700 transition">Submit</button>
              <button type="button" className="flex-1 border border-gray-400 rounded-lg px-3 py-2 text-sm sm:text-base" onClick={() => setShowDemoForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
} 