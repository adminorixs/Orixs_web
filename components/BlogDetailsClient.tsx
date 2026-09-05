'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';

const sectionList = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'challenge', label: 'Understanding The Challenge' },
  { id: 'approach', label: 'The Orixs Approach' },
  { id: 'strategy', label: 'Implementation Strategy' },
  { id: 'measuring', label: 'Measuring Success' },
  { id: 'conclusion', label: 'Conclusion' },
];

// Add a style block for line clamping
const textStyles = `
  .line-clamp-5 {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Simple carousel for blog images
function BlogImageSlideshow({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const total = images.length;
  const [transitioning, setTransitioning] = useState(true);
  const [pendingReset, setPendingReset] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Add a key to force re-mounting the image for animation reset
  const [animKey, setAnimKey] = useState(0);
  useLayoutEffect(() => { setCurrent(0); }, [images]);

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (pendingReset) return; // Pause interval during reset
    const timer = setInterval(() => {
      setCurrent((c) => c + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [total, pendingReset]);

  // Handle infinite loop: after the last slide, instantly reset to the real first slide, always moving forward
  useEffect(() => {
    if (current === total && containerRef.current) {
      setPendingReset(true);
      const handle = setTimeout(() => {
        setTransitioning(false);
        setCurrent(0);
        if (containerRef.current) {
          containerRef.current.style.transition = 'none';
          containerRef.current.style.transform = 'translateX(0%)';
        }
        setTimeout(() => {
          setTransitioning(true);
          setPendingReset(false);
        }, 20); // Next tick, re-enable transition and resume interval
      }, 700); // match transition duration
      return () => clearTimeout(handle);
    } else if (containerRef.current) {
      setTransitioning(true);
      containerRef.current.style.transition = 'transform 700ms cubic-bezier(0.4,0,0.2,1)';
    }
  }, [current, total]);

  // On current change, update transform and force animation reset
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(-${current * 100}%)`;
    }
    setAnimKey(current); // force re-mount for animation
  }, [current]);

  return (
    <div className="w-full flex flex-col items-center mb-8">
      <style>{`
        @keyframes zoomIn {
          from { transform: scale(1); }
          to { transform: scale(1.10); }
        }
      `}</style>
      <div
        className="relative w-full h-[200px] sm:h-[260px] md:h-[340px] rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden mb-4 border-2 border-purple-400 shadow-xl bg-white"
        style={{ boxShadow: '0 8px 32px 0 rgba(162,89,230,0.10), 0 1.5px 8px 0 rgba(80,0,120,0.08)' }}
      >
        {/* Gradient overlay for subtle effect */}
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ background: 'linear-gradient(180deg,rgba(162,89,230,0.10) 0%,rgba(255,255,255,0.00) 60%,rgba(162,89,230,0.08) 100%)' }} />
        <div
          ref={containerRef}
          className="absolute top-0 left-0 w-full h-full flex"
        >
          {[...images, images[0]].map((img, idx) => (
            <div key={img + '-' + idx} className="w-full h-full flex-shrink-0 relative">
              <Image
                key={idx === (current === total ? 0 : current) ? animKey : undefined} // force re-mount for animation
                src={img}
                alt={`Orixs Launch Africa Slide ${((idx) % total) + 1}`}
                fill
                className={
                  `object-cover w-full h-full rounded-xl sm:rounded-2xl md:rounded-[2.5rem]` +
                  (idx === (current === total ? 0 : current)
                    ? ' animate-[zoomIn_4000ms_linear_forwards]'
                    : '')
                }
                style={{ objectPosition: 'center 40%' }}
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Navigation dots removed as per request */}
    </div>
  );
}

export default function BlogDetailsClient({ blog, related }: { blog: any, related: any[] }) {
  // For blog 3, generate headings from content
  let dynamicHeadings: { id: string; label: string }[] = [];
  if (blog.slug === 'RINI-launch-africa') {
    let headingCount = 0;
    blog.content.forEach((text: string) => {
      const lines = text.split('\n');
      lines.forEach((line) => {
        if (line.trim().startsWith('# ')) {
          headingCount++;
          dynamicHeadings.push({
            id: `section-${headingCount}`,
            label: line.replace(/^# /, '').trim(),
          });
        }
      });
    });
  }
  const refs = (blog.slug === 'RINI-launch-africa' ? dynamicHeadings : sectionList).reduce((acc, s) => {
    acc[s.id] = useRef<HTMLDivElement>(null);
    return acc;
  }, {} as Record<string, React.RefObject<HTMLDivElement>>);
  // Add a ref for the custom conclusion block
  const conclusionBlockRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (id: string) => {
    // For blog 1 and 2, scroll to the custom conclusion block if 'conclusion' is selected
    if ((blog.title === "If You're Juggling 6 Tools and Still Don't Know What's Going On, Read This." || blog.title === "The Day I Realized My Team Had No Idea What I Was Building") && id === 'conclusion') {
      if (conclusionBlockRef.current) {
        const yOffset = -100;
        const element = conclusionBlockRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    } else if (blog.slug === 'RINI-launch-africa') {
      // Scroll to the heading with the matching id
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -100;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    } else if (refs[id]?.current) {
      const yOffset = -100; // Adjust this value as needed to account for navbar height
      const element = refs[id].current;
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }
  };

  // Share link state
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const blogUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Mobile navigation state
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Dummy content for demo
  const content = blog.title === "If You're Juggling 6 Tools and Still Don't Know What's Going On, Read This."
    ? [
        {
          id: 'introduction',
          title: 'Introduction',
          text: `Let's be honest:\nIf you're a founder, you're not building.\nYou're babysitting tools that were supposed to "streamline everything."\nYou have ClickUp for tasks.\nExcel for budgets.\nNotion for SOPs.\nSlack, WhatsApp, Google Calendar.\nA CRM no one touches.\nAnd still,\nYou wake up not knowing where anything really stands.`
        },
        {
          id: 'challenge',
          title: 'Understanding The Challenge',
          text: `You're not disorganized.\nYou're just drowning in systems that never talk to each other.\nAnd every time something breaks, guess who gets the call?\nYou.\nNot because it's your job,\nbut because nobody else has the full picture.\nThat's the cost of "tool overload."\nIt's not money. It's clarity. It's peace.\nIt's the time you used to spend thinking about the product, the pitch, the next move. Now it's spent approving timesheets and stitching data.`
        },
        {
          id: 'approach',
          title: 'The Orixs Approach',
          text: `And here's the twist:\nYou don't need a better dashboard.\nYou need an exit from this mess.\nEnter: Orixs.\nNot another platform. Not another folder of features.\nA Copilot.\nOrixs connects your tools, automates the handoffs, and gives you a single source of truth.\nYou ask it: "Where's revenue leaking this month?" It answers.\nYou say: "Show me which projects are behind and why." It shows you.\nNo more bouncing between five tabs to answer one question.\nNo more guessing. No more forgetting.\nJust clarity. When you need it, how you need it.`
        },
        {
          id: 'strategy',
          title: 'Implementation Strategy',
          text: `Start by mapping your most painful workflows.\nLet Orixs automate the approvals, reminders, and reporting.\nIntegrate your existing tools instead of ripping and replacing.\nTrain your team to ask Orixs, not you, for status updates.\nWithin weeks, you'll see fewer interruptions, faster decisions, and more time to focus on growth.\nFounders don't burn out from building. They burn out from babysitting ops.\nOrixs fixes that. Quietly. Completely.`
        },
        {
          id: 'measuring',
          title: 'Measuring Success',
          text: `Success isn't just fewer emails. It's knowing your business pulse at a glance.\nWith Orixs, you get real-time dashboards, automated alerts, and a record of every decision.\nYou spend less time chasing updates and more time leading.\nClarity, control, and peace of mind. That's the new normal.`
        },
        {
          id: 'conclusion',
          title: 'Conclusion',
          text: `If you're running your company from chaos, you're not alone.\nBut you don't have to anymore. <span className="text-purple-700 font-extrabold text-lg sm:text-xl">↬ Meet Orixs</span>\nOrixs - AI Copilot for Business Excellence\nOrixs is your AI Copilot for business automation. Streamline operations and boost productivity.`
        },
      ]
    : blog.title === "The Day I Realized My Team Had No Idea What I Was Building"
    ? [
        {
          id: 'introduction',
          title: 'Introduction',
          text: `It's Tuesday.\n11:12 AM.\nYou're in a check-in call with my leadership team.\nYou ask a simple question:\n"Where are we on the enterprise pilot we scoped last month?"\nSales thinks onboarding hasn't started.\nProduct says it's halfway done.\nCustomer success has no idea what you're talking about.\nYou're the founder.\nAnd apparently, You're the only one who knows what we're doing.`
        },
        {
          id: 'challenge',
          title: 'Understanding The Challenge',
          text: `The truth?\nWe weren't failing because people were lazy.\nWe were failing because everyone had their own version of the business.\nEach department had its own tools, its own updates, its own reality.\nAlignment was missing, and so was clarity.\nYou can't scale confusion.\nYou can't grow if your team isn't on the same page.`
        },
        {
          id: 'approach',
          title: 'The Orixs Approach',
          text: `Enter Orixs.\nOne platform.\nOne screen.\nEveryone sees the same thing.\n• Sales knows what's promised\n• Product knows what's building\n• Support knows what's coming\nAnd You? You finally know they know.`
        },
        {
          id: 'strategy',
          title: 'Implementation Strategy',
          text: `Start by mapping out your team's workflows and the tools they use.\nIntegrate those tools into Orixs, so updates flow automatically.\nSet up shared dashboards for every department.\nEncourage your team to check Orixs, not just their inbox, for the latest status.\nHold fewer meetings, but make them more impactful because everyone already knows the status before you start.`
        },
        {
          id: 'measuring',
          title: 'Measuring Success',
          text: `Success is when your team answers questions with data, not guesses.\nWith Orixs, you can track project progress, see who needs help, and spot bottlenecks before they become problems.\nYou'll notice fewer "I didn't know" moments and more "We're on it" responses.\nThat's operational clarity in action.`
        },
        {
          id: 'conclusion',
          title: 'Conclusion',
          text: `Bring your business into sync. Not with meetings, but with clarity.\n<span className="text-purple-700 font-extrabold text-lg sm:text-xl">↬ Meet Orixs</span>\nOrixs - AI Copilot for Business Excellence\nOrixs is your AI Copilot for business automation. Streamline operations and boost productivity.`
        },
      ]
    : [
      {
        id: 'introduction',
        title: 'Introduction',
        text: "In Today's Fast-Paced Business Environment, Organizations Are Constantly Seeking Ways To Optimize Their Operations, Break Down Data Silos, And Enhance Collaboration Across Departments. However, The Proliferation Of Specialized Tools Across Different Business Functions Often Leads To Fragmented Workflows, Duplicated Efforts, And Missed Opportunities For Synergy."
      },
      {
        id: 'challenge',
        title: 'Understanding The Challenge',
        text: "Most Enterprises Struggle With A Common Problem: Too Many Disconnected Tools. The Average Organization Uses 80+ SaaS Applications, With Different Departments Selecting Their Own Preferred Solutions. This Creates: Data Silos That Prevent Cross-Functional Insights, Workflow Inefficiencies Requiring Manual Transfers Between Systems, Increased IT Management Overhead And Security Risks, Higher Total Cost Of Ownership Across Multiple Subscriptions."
      },
      {
        id: 'approach',
        title: 'The Orixs Approach',
        text: "Unlike Point Solutions That Address Only Specific Functions, Orixs Provides A Unified Platform That Connects People, Processes, And Data Across Your Entire Organization. Our Approach Isn't About..."
      },
      {
        id: 'strategy',
        title: 'Implementation Strategy',
        text: "A phased approach to implementation ensures smooth adoption and maximum ROI. Our team works closely with your stakeholders to tailor the rollout to your unique needs."
      },
      {
        id: 'measuring',
        title: 'Measuring Success',
        text: "We help you define KPIs and success metrics, and provide dashboards and analytics to track progress and outcomes."
      },
      {
        id: 'conclusion',
        title: 'Conclusion',
        text: "Orixs is your partner in digital transformation, helping you achieve clarity, control, and growth."
      },
    ];

  return (
    <section className="bg-[#f6f8fa] py-6 sm:py-8 md:py-10 px-4">
      {/* Add style tag to inject CSS */}
      <style dangerouslySetInnerHTML={{ __html: textStyles }} />
      
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 sm:mb-8 md:mb-10">
          <Link href="/" className="hover:text-purple-600 transition">Home</Link>
          <span>/</span>
          <Link href="/blogs" className="hover:text-purple-600 transition">Blog</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '300px' }}>{blog.title}</span>
        </nav>
        
        {/* Author info */}
        <div className="flex items-center gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
          <span className="text-purple-600 text-xl sm:text-2xl">👤</span>
          <div className="flex flex-col">
            <span className="font-bold text-lg sm:text-xl md:text-2xl text-gray-800">{blog.author}</span>
            <span className="text-gray-400 text-sm sm:text-base md:text-lg">Author</span>
          </div>
        </div>
        
        {/* Blog title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-5 md:mb-6 leading-relaxed tracking-wide" style={{wordSpacing: '0.15em'}}> 
          {blog.title} 
        </h1>
        
        {/* Slideshow for Orixs Launch in Africa, single image for others */}
        {blog.slug === 'RINI-launch-africa' ? (
          <BlogImageSlideshow images={[
            '/RINI-038.svg',
            '/RINI-041.svg',
            '/RINI-042.svg',
            '/RINI-043.svg',
            '/RINI-044.svg',
            '/RINI-089.svg',
            '/RINI-092.svg',
            '/RINI-100.svg',
            '/RINI-065.jpg',
            '/RINI-085.jpg',
            '/RINI-075.jpg',
            '/RINI-073.jpg',
          ]} />
        ) : blog.title === "How AI is Transforming Operations" ? (
          <img 
            src="/image 579.svg" 
            alt={blog.title} 
            className="rounded-xl sm:rounded-2xl md:rounded-[2.5rem] w-full h-auto object-contain" 
          />
        ) : (
          <Image 
            src={blog.image} 
            alt={blog.title} 
            width={900} 
            height={480} 
            className="rounded-xl sm:rounded-2xl md:rounded-[2.5rem] w-full h-[200px] sm:h-[260px] md:h-[340px] object-cover" 
          />
        )}
        
        {/* Blog meta */}
        <div className="flex flex-wrap gap-x-4 sm:gap-x-5 md:gap-x-6 gap-y-3 sm:gap-y-4 md:gap-y-6 items-center text-gray-500 mb-6 sm:mb-8 md:mb-10 text-base sm:text-lg md:text-xl" style={{wordSpacing: '0.2em'}}>
          <span>🕒 10 min read</span>
          {!(blog.title === "If You're Juggling 6 Tools and Still Don't Know What's Going On, Read This." || blog.title === "The Day I Realized My Team Had No Idea What I Was Building") && (
            <span className="bg-purple-100 text-purple-600 px-3 sm:px-4 py-1 sm:py-2 rounded-3xl text-sm sm:text-base font-semibold" style={{fontSize: '1.1rem'}}>{blog.tag}</span>
          )}
          <span>📅 {blog.date}</span>
          <span className="cursor-pointer hover:text-purple-600 flex items-center gap-2" onClick={() => setShowShare((v) => !v)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Share
          </span>
          
          {/* Share link popup */}
          {showShare && (
            <span className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 ml-0 sm:ml-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-700 select-all truncate">{typeof window !== 'undefined' ? window.location.href : ''}</span>
              <button
                className="text-purple-600 font-semibold text-2xs sm:text-xs md:text-sm border border-purple-500 rounded px-1 sm:px-2 py-0.5 sm:py-1 hover:bg-purple-50 transition whitespace-nowrap"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }
                }}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </span>
          )}
        </div>
        
        {/* Mobile Navigation Toggle */}
        <div className="md:hidden mb-8">
          <button 
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="w-full flex items-center justify-between bg-black text-white rounded-lg p-3"
          >
            <span className="font-medium">Table of Contents</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showMobileNav ? 'transform rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          {/* Mobile Navigation Dropdown */}
          {showMobileNav && (
            <div className="bg-black/95 text-white rounded-b-lg p-3 pt-1 transform -translate-y-1">
              {(blog.slug === 'RINI-launch-africa' ? dynamicHeadings : sectionList).map((s) => (
                <button 
                  key={s.id} 
                  onClick={() => {
                    handleNavClick(s.id);
                    setShowMobileNav(false);
                  }} 
                  className="text-left py-2 px-3 rounded hover:bg-purple-700/30 transition font-medium text-sm flex items-center gap-2 w-full"
                >
                  <span className="text-purple-400">•</span>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 md:max-w-[60%] md:ml-6 lg:ml-16">
            {blog.title !== "If You're Juggling 6 Tools and Still Don't Know What's Going On, Read This." && blog.title !== "The Day I Realized My Team Had No Idea What I Was Building"
              ? (() => {
                  let headingIdx = 0;
                  return blog.content.map((text: string, idx: number) => {
                    const lines = text.split('\n');
                    return (
                      <div key={idx} className="mb-10 sm:mb-12 md:mb-16 text-gray-700 text-base sm:text-lg leading-relaxed">
                        {lines.map((line, i) => {
                          if (line.trim().startsWith('# ')) {
                            headingIdx++;
                            return <h2 key={i} id={`section-${headingIdx}`} className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6">{line.replace(/^# /, '')}</h2>;
                          }
                          // Style the signature line
                          if (line.trim() === '— Team Orixs') {
                            return (
                              <div key={i} className="flex flex-col items-center mt-12 mb-4">
                                <span className="block text-3xl sm:text-4xl text-purple-400 mb-2 select-none" aria-hidden="true">✦</span>
                                <span
                                  className="text-center font-bold text-purple-600 text-xl sm:text-2xl tracking-wide"
                                  style={{ fontFamily: 'cursive, Brush Script MT, Segoe Script, sans-serif', letterSpacing: '0.04em' }}
                                >
                                  Team Orixs
                                </span>
                              </div>
                            );
                          }
                          return line.trim().length > 0 ? <p key={i} className="mb-2 whitespace-pre-line">{line}</p> : null;
                        })}
                      </div>
                    );
                  });
                })()
              : content.map((section, idx) => (
                  ((blog.title === "If You're Juggling 6 Tools and Still Don't Know What's Going On, Read This." || blog.title === "The Day I Realized My Team Had No Idea What I Was Building") && section.id === 'conclusion')
                    ? null
                    : (
                      <div key={section.id} ref={refs[section.id]} className="mb-10 sm:mb-12 md:mb-16">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6" id={section.id}>
                          {section.title}
                        </h2>
                        <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-3 sm:space-y-4">
                          {section.id === 'approach' && section.text.includes('•')
                            ? section.text.split('\n').map((line, idx) =>
                                line.trim().startsWith('•') ? (
                                  <li key={idx} style={{ listStyle: 'disc', marginLeft: '1.5em' }}>{line.replace(/^•\s*/, '')}</li>
                                ) : line.trim() !== '' ? (
                                  <p key={idx}>{line}</p>
                                ) : null
                              )
                            : section.text}
                        </div>
                      </div>
                    )
                ))}
            {/* Styled Conclusion block for blog 1 */}
            {blog.title === "If You're Juggling 6 Tools and Still Don't Know What's Going On, Read This." && (
              <>
                <hr className="my-8 border-t border-gray-300" />
                <div ref={conclusionBlockRef} className="mt-6 space-y-3 text-gray-700 text-base sm:text-lg leading-relaxed text-center">
                  {/* <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6">Conclusion</h2> */}
                  <p className="mb-2">If you're running your company from chaos, you're not alone.</p>
                  <p className="mb-2 font-medium">But you don't have to anymore. <span className="text-purple-700 font-extrabold text-lg sm:text-xl">↬ Meet Orixs</span></p>
                  <p className="font-semibold text-gray-800">Orixs - AI Copilot for Business Excellence</p>
                  <p className="text-gray-600">Orixs is your AI Copilot for business automation. Streamline operations and boost productivity.</p>
                </div>
              </>
            )}
            {/* Styled Conclusion block for blog 2 */}
            {blog.title === "The Day I Realized My Team Had No Idea What I Was Building" && (
              <>
                <hr className="my-8 border-t border-gray-300" />
                <div ref={conclusionBlockRef} className="mt-6 space-y-3 text-gray-700 text-base sm:text-lg leading-relaxed text-center">
                  {/* <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6">Conclusion</h2> */}
                  <p className="mb-2">You can't scale confusion.<br/>Orixs fixes that.</p>
                  <p className="mb-2 font-medium">Bring your business into sync. Not with meetings, but with clarity.</p>
                  <p className="font-semibold text-gray-800">Orixs - AI Copilot for Business Excellence</p>
                  <p className="text-gray-600">Orixs is your AI Copilot for business automation. Streamline operations and boost productivity.</p>
                </div>
              </>
            )}
          </div>
          
          {/* Desktop Sidebar Navigation - Hidden on Mobile */}
          <div className="hidden md:block w-[25%] bg-black text-white rounded-xl p-6 flex-col gap-3 h-fit sticky top-32">
            {(blog.slug === 'RINI-launch-africa' ? dynamicHeadings : sectionList).map((s) => (
              <button key={s.id} onClick={() => handleNavClick(s.id)} className="text-left py-2 px-3 rounded hover:bg-purple-700/30 transition font-medium text-sm flex items-center gap-2 whitespace-nowrap">
                <span className="text-purple-400">•</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Related Blogs */}
      <section className="max-w-7xl mx-auto py-8 sm:py-10 md:py-12 px-4">
        <div className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Related Blog{related.length > 1 ? 's' : ''}</div>
        
        {/* Mobile scrollable cards */}
        <div className="relative">
          <div className="overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4">
            <div className="flex gap-4 sm:gap-6">
              {related.map((b) => (
                <Link 
                  key={b.slug} 
                  href={`/blogs/${b.slug}`} 
                  className="bg-white rounded-lg sm:rounded-xl shadow p-3 sm:p-4 flex flex-col w-[250px] sm:w-[300px] flex-shrink-0 hover:bg-purple-50 transition"
                >
                  {/* Use SVG only for the AI Operations blog */}
                  {b.title === "How AI is Transforming Operations" ? (
                    <div className="rounded-lg w-full h-32 sm:h-40 overflow-hidden mb-3 sm:mb-4">
                      <img src="/image 579.svg" alt={b.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <Image src={b.image} alt={b.title} width={300} height={180} className="rounded-lg w-full h-32 sm:h-40 object-cover mb-3 sm:mb-4" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-sm sm:text-base mb-2 whitespace-normal break-words line-clamp-2">{b.title}</div>
                    <div className="text-gray-600 text-xs sm:text-sm mb-3 whitespace-normal break-words line-clamp-2">{b.summary}</div>
                    <span className="text-purple-500 text-xs sm:text-sm font-medium hover:underline inline-block px-3 sm:px-4 py-1 border border-purple-500 rounded-full">Read More</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Navigation arrow - hidden on small devices */}
          <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 cursor-pointer hover:bg-purple-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </section>
    </section>
  );
} 