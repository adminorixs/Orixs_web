'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleRequestDemo = () => {
    setShowForm(true);
  };
  
  // Auto-close the success message and form
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setShowForm(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format message for WhatsApp
    const message = `*Request a Demo*
Name: ${formData.name}
Email: ${formData.email}${formData.date ? `\nPreferred Date: ${formData.date}` : ''}${formData.time ? `\nPreferred Time: ${formData.time}` : ''}`;
    
    // Open WhatsApp with the details
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/7416102647?text=${encodedMessage}`, '_blank');
    
    // Show success message
    setShowSuccess(true);
    
    // Reset form data
    setFormData({ name: '', email: '', date: '', time: '' });
  };
  
  return (
    <section data-copilot-section="hero" className="relative flex items-center justify-center overflow-hidden bg-white">
      {/* Hero Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-14 sm:pt-16 md:pt-18 pb-2 relative z-10">
        <div className="flex justify-center">
          <Image
            src="/All_in_One_Platform_img.png"
            alt="All in One Platform - Everything your business needs"
            width={1800}
            height={900}
            className="w-full max-w-[380px] sm:max-w-[560px] md:max-w-[800px] lg:max-w-[1050px] xl:max-w-[1250px] h-auto object-contain"
            priority
          />
        </div>
        
        {/* CTA Buttons */}
       

        {/* Demo Request Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setShowForm(false)} 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Success Message */}
              {showSuccess ? (
                <div className="flex flex-col items-center text-center px-6 py-8">
                  <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Success!</h3>
                  <p className="text-gray-600 mb-4">Thank you for requesting a demo! We'll be in touch soon.</p>
                  <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full transition-all duration-3000 ease-linear" 
                      style={{ 
                        width: '100%', 
                        animation: 'countdown 3s linear forwards' 
                      }} 
                    />
                  </div>
                  <style jsx>{`
                    @keyframes countdown {
                      from { width: 100%; }
                      to { width: 0%; }
                    }
                  `}</style>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-4">Request a Demo</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date (Optional)</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time (Optional)</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-purple-700 transition"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
