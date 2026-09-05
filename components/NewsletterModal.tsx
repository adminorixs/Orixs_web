'use client';
import { useState, useEffect, FormEvent } from 'react';
import { FormSuccessPopup } from './FormSuccessPopup';

export function NewsletterModal({ show, setShow }: { show: boolean, setShow: (v: boolean) => void }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    country: '+1',
    org: '',
    designation: '',
  });
  const [errors, setErrors] = useState({ email: '', contact: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const countryCodes = ['+1', '+44', '+91', '+61', '+81'];

  // Auto-close the entire form after success message appears
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        // Close the success message and the entire form
        setShowSuccess(false);
        setShow(false);
        // Reset form
        setForm({ name: '', email: '', contact: '', country: '+1', org: '', designation: '' });
        setErrors({ email: '', contact: '' });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, setShow]);

  useEffect(() => {
    if (!show) {
      setForm({ name: '', email: '', contact: '', country: '+1', org: '', designation: '' });
      setErrors({ email: '', contact: '' });
      setShowSuccess(false);
    }
  }, [show]);

  const validate = () => {
    let valid = true;
    let errs = { email: '', contact: '' };
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      errs.email = 'Invalid email';
      valid = false;
    }
    if (!/^\d{7,15}$/.test(form.contact)) {
      errs.contact = 'Invalid number';
      valid = false;
    }
    setErrors(errs);
    return valid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Format data for WhatsApp
      const message = `*Newsletter Subscription*
Name: ${form.name}
Email: ${form.email}
Contact: ${form.country}${form.contact}
Organisation: ${form.org}
Designation: ${form.designation}`;

      // Open WhatsApp with the details
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/7416102647?text=${encodedMessage}`, '_blank');

      // Show success message and set auto-close timer
      setShowSuccess(true);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-start sm:justify-end">
      {/* Backdrop overlay — click to dismiss */}
      <div className="absolute inset-0 bg-black/30 sm:bg-transparent" onClick={() => setShow(false)} />

      {/* Form container — responsive positioning */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-2xl p-0 w-[calc(100%-2rem)] max-w-[440px] sm:w-[440px] shadow-xl flex flex-row gap-0 overflow-hidden min-h-[320px] max-h-[calc(100vh-5rem)] overflow-y-auto mt-20 sm:mt-32 mx-4 sm:mx-0 sm:mr-6"
      >
        {/* Simple success popup without auto-close functionality */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center z-50">
            <div className="flex flex-col items-center text-center px-6">
              <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Success!</h3>
              <p className="text-gray-600 mb-4">Thank you for subscribing to our newsletter!</p>
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
          </div>
        )}

        <div className="w-2 sm:w-3 flex flex-col items-center justify-start bg-gray-100 flex-shrink-0">
          <div
            className="bg-purple-500 rounded-full w-full transition-all duration-500"
            style={{ height: `${(Number(!!form.name) + Number(!!form.org) + Number(!!form.email) + Number(!!form.contact) + Number(!!form.designation)) * 20}%`, minHeight: 12 }}
          />
        </div>
        <div className="flex-1 flex flex-col gap-2 p-4 min-w-0">
          <div className="text-lg font-semibold text-black text-center mb-1 w-full" style={{ fontSize: '1.05rem' }}>
            Subscribe to our Newsletter
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold text-[0.95rem] text-black w-full">Full name
              <input type="text" placeholder="Enter your name" className="block w-full bg-gray-100 rounded-2xl px-3 py-2 mt-1 text-[0.95rem] font-normal outline-none" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </label>
            <label className="font-semibold text-[0.95rem] text-black w-full">Organization
              <input type="text" placeholder="Enter organization name" className="block w-full bg-gray-100 rounded-2xl px-3 py-2 mt-1 text-[0.95rem] font-normal outline-none" required value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} />
            </label>
            <label className="font-semibold text-[0.95rem] text-black w-full">Work Email
              <input type="email" placeholder="Ex - abc@workmail.com....." className="block w-full bg-gray-100 rounded-2xl px-3 py-2 mt-1 text-[0.95rem] font-normal outline-none" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </label>
            <label className="font-semibold text-[0.95rem] text-black w-full">Contact number
              <div className="flex gap-2 mt-1">
                <select className="border rounded-2xl px-2 py-2 bg-gray-100 text-[0.95rem] font-normal outline-none flex-shrink-0" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                  {countryCodes.map(code => <option key={code} value={code}>{code}</option>)}
                </select>
                <input type="tel" placeholder="0123456789...." className="block w-full min-w-0 bg-gray-100 rounded-2xl px-3 py-2 text-[0.95rem] font-normal outline-none" required value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
              </div>
              {errors.contact && <div className="text-red-500 text-xs mt-1">{errors.contact}</div>}
            </label>
            <label className="font-semibold text-[0.95rem] text-black w-full">Designation
              <input type="text" placeholder="Enter your designation" className="block w-full bg-gray-100 rounded-2xl px-3 py-2 mt-1 text-[0.95rem] font-normal outline-none" required value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} />
            </label>
          </div>
          <div className="flex gap-2 mt-2 mb-0">
            <button type="submit" className="flex-1 bg-purple-600 text-white rounded-lg px-3 py-2 font-semibold hover:bg-purple-700 transition">Subscribe</button>
            <button type="button" className="flex-1 border border-gray-400 rounded-lg px-3 py-2 text-black" onClick={() => setShow(false)}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
