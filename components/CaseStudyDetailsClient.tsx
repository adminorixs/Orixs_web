'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, FormEvent } from 'react';

export default function CaseStudyDetailsClient({ caseStudy }: { caseStudy: any }) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showDemoForm, setShowDemoForm] = useState(false);
  
  // Form state for Request form
  const [requestFormData, setRequestFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+1',
    contactNumber: '',
    organisation: '',
    designation: ''
  });
  
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
  
  // Handle input change for Request form
  const handleRequestFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRequestFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle input change for Demo form
  const handleDemoFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDemoFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle Request form submission
  const handleRequestFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Format data for WhatsApp
    const message = `*Request a Similar Solution*
Name: ${requestFormData.fullName}
Email: ${requestFormData.email}
Contact: ${requestFormData.countryCode}${requestFormData.contactNumber}
Organisation: ${requestFormData.organisation}
Designation: ${requestFormData.designation}
Request for: ${caseStudy.title}`;
    
    // Open WhatsApp with the details
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/7416102647?text=${encodedMessage}`, '_blank');
    
    // Close the form
    setShowRequestForm(false);
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
Interested in: ${caseStudy.title}`;
    
    // Open WhatsApp with the details
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/7416102647?text=${encodedMessage}`, '_blank');
    
    // Close the form
    setShowDemoForm(false);
  };

  // Create a style object for responsiveness
  const styles = `
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `;

  return (
    <section className="bg-[#f6f8fa] py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-10">
      {/* Add style tag */}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="max-w-7xl mx-auto pt-4 sm:pt-6 md:pt-8 lg:pt-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 sm:mb-8 md:mb-10">
          <Link href="/" className="hover:text-purple-600 transition">Home</Link>
          <span>/</span>
          <Link href="/case-studies" className="hover:text-purple-600 transition">Case Studies</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '300px' }}>{caseStudy.title}</span>
        </nav>
        
        {/* Tags section with improved responsive layout */}
        <div className="flex flex-wrap gap-x-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-2 sm:gap-y-3 items-center text-gray-500 mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-xs sm:text-sm md:text-base">
          <span className="bg-purple-100 text-purple-600 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-3xl text-xs sm:text-sm md:text-base font-semibold">{caseStudy.tag}</span>
          <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-3xl text-xs sm:text-sm md:text-base font-semibold">{caseStudy.location}</span>
          <span>📅 {caseStudy.date}</span>
        </div>
        
        {/* Title with better text size scaling */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-5 md:mb-6 leading-tight sm:leading-tight md:leading-relaxed lg:leading-relaxed tracking-wide" style={{wordSpacing: '0.1em'}}>{caseStudy.title}</h1>
        
        {/* Stat cards with improved responsive layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          {caseStudy.stats.map((stat: any, i: number) => (
            <div
              key={i}
              className="rounded-xl sm:rounded-2xl shadow-sm bg-white/50 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 lg:py-5 flex flex-col items-center justify-center border border-white/80"
            >
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-500 mb-1 sm:mb-2">{stat.value}</span>
              <span className="text-xs sm:text-sm md:text-base text-black text-center line-clamp-2">{stat.label}</span>
            </div>
          ))}
        </div>
        
        {/* Image and key benefits - improved stack on mobile, side by side on larger screens */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <div className="w-full lg:w-[65%] flex items-center justify-center">
            <Image 
              src={caseStudy.image} 
              alt={caseStudy.title} 
              width={800} 
              height={520} 
              className="rounded-xl sm:rounded-2xl md:rounded-[2rem] w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[420px] object-cover shadow-md" 
            />
          </div>
          
          {/* Key Benefits - better mobile layout */}
          <div className="w-full lg:w-[35%] bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-md border border-gray-100 flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 h-fit self-center">
            <div className="font-semibold text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 md:mb-3">Key Benefits</div>
            <ul className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              {caseStudy.benefits.map((b: any, i: number) => {
                let title = b.title || (typeof b === 'string' ? b.split('\n')[0] : '');
                let desc = b.desc || (typeof b === 'string' ? b.split('\n').slice(1).join(' ') : '');
                return (
                  <li key={i} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                    <span className="mt-1 flex-shrink-0">
                      <svg width="20" height="20" className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f3e8ff"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#a259e6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <div>
                      <div className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 mb-0.5 sm:mb-1">{title}</div>
                      <div className="text-gray-600 text-xs sm:text-sm md:text-base leading-snug">{desc}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <button onClick={() => setShowRequestForm(true)} className="mt-2 sm:mt-3 md:mt-4 border border-purple-600 text-purple-600 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 md:py-2.5 font-medium sm:font-semibold text-sm sm:text-base hover:bg-purple-50 transition">Request a Similar Solution</button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {/* Main Content - better content flow and responsive spacing */}
          <div className="flex-1 lg:max-w-[65%]">
            {/* Overview */}
            <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-5 md:mb-6">Overview</h2>
              {Array.isArray(caseStudy.content.overview) ? (
                <ul className="list-disc pl-6 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed space-y-2">
                  {caseStudy.content.overview.map((item: string, idx: number) => (
                    <li key={idx}>{item.replace(/^\*\s?/, "")}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed space-y-3 sm:space-y-4">{caseStudy.content.overview}</div>
              )}
            </div>
            
            {/* Challenges - better grid layout for mobile */}
            <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-5 md:mb-6">Challenges</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {caseStudy.content.challenges.map((c: string, i: number) => (
                  <div key={i} className="bg-white rounded-lg sm:rounded-xl border border-purple-100 p-3 sm:p-4 md:p-5 lg:p-6 text-gray-700 font-medium shadow-sm">
                    {c}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Solution - better spacing for readability */}
            <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-5 md:mb-6">Solution</h2>
              <div className="text-gray-700 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 lg:mb-8">{caseStudy.content.solutionIntro}</div>
              <ul className="list-none pl-0 text-gray-700 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                {caseStudy.content.solution.map((s: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                    <span className="mt-1 flex-shrink-0">
                      <svg width="20" height="20" className="sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f3e8ff"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#a259e6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <div>
                      <div className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-black mb-1 sm:mb-2">{s.title || (typeof s === 'string' ? s.split('\n')[0] : '')}</div>
                      <div className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg leading-snug">{s.desc || (typeof s === 'string' ? s.split('\n').slice(1).join(' ') : '')}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Implementation Process - Improved vertical stepper */}
            <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              {/* <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-5 md:mb-6">Implementation Process</h2> */}
              <div className="relative ml-3 sm:ml-4 md:ml-5 lg:ml-6">
                <div className="absolute left-4 top-8 bottom-8 w-0.5 sm:w-1 bg-purple-200 z-0" style={{borderRadius: '4px'}}></div>
                <ul className="list-none pl-0 text-gray-700">
                  {caseStudy.content.process.map((step: any, i: number) => (
                    <li key={i} className="relative flex items-start mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                      {/* Numbered circle with better sizing for mobile */}
                      <span className="absolute -left-3 sm:-left-4 md:-left-5 top-0 z-10 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-purple-500 text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold rounded-full border-2 sm:border-4 border-white shadow">
                        {i + 1}
                      </span>
                      <div className="ml-6 sm:ml-7 md:ml-8 lg:ml-10 flex-1">
                        <div className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-black mb-1 sm:mb-2">{step.title || (typeof step === 'string' ? step.split('\n')[0] : '')}</div>
                        <div className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg leading-snug mb-1 sm:mb-2">{step.desc || (typeof step === 'string' ? step.split('\n').slice(1).join(' ') : '')}</div>
                        {step.duration && (
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-500 text-xs sm:text-sm md:text-base mt-1">
                            <svg width="12" height="12" className="sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#a3a3a3" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <span>{step.duration}</span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Results */}
            <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-5 md:mb-6">Results</h2>
              {Array.isArray(caseStudy.content.results) ? (
                <ul className="list-disc pl-6 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed space-y-2">
                  {caseStudy.content.results.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed space-y-3 sm:space-y-4">{caseStudy.content.results}</div>
              )}
            </div>
            {/* Quote from the Founder for Construction Firm (Case Study 3) */}
            {caseStudy.slug === 'construction-firm-blindspots' && (
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500"><path d="M7.5 7C6.11929 7 5 8.11929 5 9.5V13.5C5 14.8807 6.11929 16 7.5 16C8.88071 16 10 14.8807 10 13.5V9.5C10 8.11929 8.88071 7 7.5 7ZM7.5 7V6M7.5 16V18M16.5 7C15.1193 7 14 8.11929 14 9.5V13.5C14 14.8807 15.1193 16 16.5 16C17.8807 16 19 14.8807 19 13.5V9.5C19 8.11929 17.8807 7 16.5 7ZM16.5 7V6M16.5 16V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Quote from the Founder
                </h3>
                <blockquote className="italic text-purple-700 text-sm sm:text-base md:text-lg border-l-2 sm:border-l-4 border-purple-400 pl-3 sm:pl-4 md:pl-5 lg:pl-6 py-1 sm:py-2">
                  “I used to manage projects with my gut and my phone. Now, I have answers before I even ask the questions.”
                </blockquote>
              </div>
            )}
            {/* Testimonial */}
            <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-5 md:mb-6">Testimonial</h2>
              {caseStudy.slug === 'saas-founder-bottleneck' ? (
                <blockquote className="italic text-purple-700 text-sm sm:text-base md:text-lg border-l-2 sm:border-l-4 border-purple-400 pl-3 sm:pl-4 md:pl-5 lg:pl-6 py-1 sm:py-2">
                  <span>
                    Founders deserve to think again. Start with <span className="text-purple-700 font-extrabold text-lg sm:text-xl">Orixs</span>.<br />
                    <span className="font-extrabold text-purple-700 text-lg sm:text-xl">Orixs</span> is your AI Copilot for business automation. Streamline operations and boost productivity.
                  </span>
                </blockquote>
              ) : caseStudy.slug === 'construction-firm-blindspots' ? (
                <>
                  <blockquote className="italic text-purple-700 text-sm sm:text-base md:text-lg border-l-2 sm:border-l-4 border-purple-400 pl-3 sm:pl-4 md:pl-5 lg:pl-6 py-1 sm:py-2">
                    <span>
                      If your construction sites still run on WhatsApp, you're not managing. You're guessing. <span className="text-purple-700 font-extrabold text-lg sm:text-xl">Orixs</span> fixes that.<br />
                      <span className="font-extrabold text-purple-700 text-lg sm:text-xl">Orixs</span> - AI Copilot for Business Excellence.<br />
                      <span className="font-extrabold text-purple-700 text-lg sm:text-xl">Orixs</span> is your AI Copilot for business automation. Streamline operations and boost productivity.
                    </span>
                  </blockquote>
                </>
              ) : caseStudy.slug === 'abuja-sme-finance' ? (
                <blockquote className="italic text-purple-700 text-sm sm:text-base md:text-lg border-l-2 sm:border-l-4 border-purple-400 pl-3 sm:pl-4 md:pl-5 lg:pl-6 py-1 sm:py-2">
                  We didn't just get a tool. We got our time back. Want to stop chasing numbers and start leading with them?
                  <span className="text-purple-700 font-extrabold text-lg sm:text-xl"> <b>Meet <span className="tracking-wider">Orixs</span></b></span>.
                  <br />
                  <span className="font-extrabold text-purple-700"><b>Orixs</b></span> - AI Copilot for Business Excellence.
                  <br />
                  <span className="font-bold text-purple-700"><b>Orixs</b></span> is your AI Copilot for business automation. Streamline operations and boost productivity.
                </blockquote>
              ) : (
                <blockquote className="italic text-purple-700 text-sm sm:text-base md:text-lg border-l-2 sm:border-l-4 border-purple-400 pl-3 sm:pl-4 md:pl-5 lg:pl-6 py-1 sm:py-2">
                  {caseStudy.content.testimonial}
                </blockquote>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Call-to-action section with better padding and spacing */}
      <section className="w-full flex justify-center py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 px-4 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-6 md:py-8 lg:py-10 max-w-2xl sm:max-w-3xl md:max-w-4xl w-full text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 sm:mb-3 md:mb-4">Ready to streamline your operations?</h2>
          <div className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-5 md:mb-6 lg:mb-8">Discover how Orixs can replace your scattered tools with one unified platform while maintaining flexibility for your unique needs.</div>
          <button onClick={() => setShowDemoForm(true)} className="border-2 border-purple-500 text-purple-600 rounded-lg px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base md:text-lg font-semibold hover:bg-purple-50 transition">Schedule a Demo</button>
        </div>
      </section>
      
      {/* Request a Similar Solution Form Modal - improved responsiveness */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/40 flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 md:p-6 pt-10 sm:pt-3 overflow-y-auto">
          <form onSubmit={handleRequestFormSubmit} className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-xl flex flex-col gap-3 sm:gap-4 my-4 sm:my-0 overflow-y-auto max-h-[90vh]">
            <div className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2 text-black">Request a Similar Solution</div>
            <input 
              type="text" 
              name="fullName" 
              placeholder="Full Name" 
              className="border rounded px-3 py-2 text-sm sm:text-base" 
              required 
              value={requestFormData.fullName}
              onChange={handleRequestFormChange}
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              className="border rounded px-3 py-2 text-sm sm:text-base" 
              required 
              value={requestFormData.email}
              onChange={handleRequestFormChange}
            />
            <div className="flex gap-2">
              <select 
                name="countryCode" 
                className="border rounded px-2 py-2 text-sm sm:text-base w-20 sm:w-24"
                value={requestFormData.countryCode}
                onChange={handleRequestFormChange}
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
                value={requestFormData.contactNumber}
                onChange={handleRequestFormChange}
              />
            </div>
            <input 
              type="text" 
              name="organisation" 
              placeholder="Organisation" 
              className="border rounded px-3 py-2 text-sm sm:text-base" 
              required 
              value={requestFormData.organisation}
              onChange={handleRequestFormChange}
            />
            <input 
              type="text" 
              name="designation" 
              placeholder="Designation" 
              className="border rounded px-3 py-2 text-sm sm:text-base" 
              required 
              value={requestFormData.designation}
              onChange={handleRequestFormChange}
            />
            <div className="flex gap-2 mt-2 mb-2">
              <button type="submit" className="flex-1 bg-purple-600 text-white rounded-lg px-3 py-2 text-sm sm:text-base font-semibold hover:bg-purple-700 transition">Submit</button>
              <button type="button" className="flex-1 border border-gray-400 rounded-lg px-3 py-2 text-sm sm:text-base" onClick={() => setShowRequestForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      {/* Schedule a Demo Form Modal - improved responsiveness */}
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
    </section>
  );
} 