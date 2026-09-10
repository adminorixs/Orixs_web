'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBriefcase, FaShieldAlt, FaHardHat, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import {
  HiOutlineCheckCircle,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineCube,
} from 'react-icons/hi';
import { Navbar } from '@/components/Navbar';
import { FooterSection } from '@/components/FooterSection';
import { usePricing, PricingResponse } from '@/hooks/api/usePricing';
import { handlePricing } from '@/lib/api/tanstack/pricingApi';
import { PricingActionType, PricingSuccessResponse, ValidationErrorResponse } from '@/lib/interface/pricing';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { copilotEventBus } from '@/lib/copilot/eventBus';

/* ─── Industry config ─── */
const industryConfig: Record<string, {
  platformKey: string;
  planIds: number[];
  redirectUrl: string;
  apiLoginUrl: string;
  appBaseUrl: string;
  name: string;
  tagline: string;
  headline: string;
  description: string;
  icon: React.ReactNode;
  benefits: { icon: React.ReactNode; text: string }[];
}> = {
  business: {
    platformKey: 'rini-dev',
    planIds: [1, 2, 3],
    redirectUrl: 'https://dev.orixs.io/auth/auto-login',
    apiLoginUrl: 'https://dev.orixs.io/api/v1/login',
    appBaseUrl: 'https://dev.orixs.io',
    name: 'Business Operations',
    tagline: 'Your AI command center',
    headline: 'Start running your business with Orixs',
    description: 'Centralize your entire operation — project tracking, sales pipelines, financial forecasting — in one AI-driven platform.',
    icon: <FaBriefcase className="text-3xl" />,
    benefits: [
      { icon: <HiOutlineLightningBolt />, text: 'AI-powered dashboards & analytics' },
      { icon: <HiOutlineCheckCircle />, text: 'Smart CRM with automated follow-ups' },
      { icon: <HiOutlineShieldCheck />, text: 'Workflow automation across teams' },
      { icon: <HiOutlineCube />, text: 'Auto-generated reports in seconds' },
    ],
  },
  insurance: {
    platformKey: 'rini-insurance',
    planIds: [6],
    redirectUrl: 'https://insurance.orixs.io/auth/auto-login',
    apiLoginUrl: 'https://insurance.orixs.io/api/v1/login',
    appBaseUrl: 'https://insurance.orixs.io',
    name: 'Insurance',
    tagline: 'Claims, underwriting, compliance',
    headline: 'Faster claims. Smarter underwriting.',
    description: 'Process claims up to 70% faster with AI-powered verification and fraud detection. Stay fully compliant and audit-ready.',
    icon: <FaShieldAlt className="text-3xl" />,
    benefits: [
      { icon: <HiOutlineLightningBolt />, text: 'AI risk profiling & underwriting' },
      { icon: <HiOutlineCheckCircle />, text: 'Automated claims processing' },
      { icon: <HiOutlineShieldCheck />, text: 'Built-in compliance engine' },
      { icon: <HiOutlineCube />, text: 'Customer self-service portal' },
    ],
  },
  construction: {
    platformKey: 'rini-construction',
    planIds: [4, 5],
    redirectUrl: 'https://construction.orixs.io/auth/auto-login',
    apiLoginUrl: 'https://construction.orixs.io/api/v1/login',
    appBaseUrl: 'https://construction.orixs.io',
    name: 'Construction',
    tagline: 'Projects, crews, budgets',
    headline: 'Full visibility across every build',
    description: 'Unify budgets, crews, safety, and timelines from pre-construction to final handover. Cut delays and reduce cost overruns.',
    icon: <FaHardHat className="text-3xl" />,
    benefits: [
      { icon: <HiOutlineLightningBolt />, text: 'BIM integration & planning tools' },
      { icon: <HiOutlineCheckCircle />, text: 'Real-time crew & equipment tracking' },
      { icon: <HiOutlineShieldCheck />, text: 'Safety compliance monitoring' },
      { icon: <HiOutlineCube />, text: 'Budget control with cost forecasting' },
    ],
  },
};

/* ─── Country / phone code mapping ─── */
const countries = [
  { code: 'IN', name: 'India', phoneCode: '+91' },
  { code: 'US', name: 'United States', phoneCode: '+1' },
  { code: 'GB', name: 'United Kingdom', phoneCode: '+44' },
  { code: 'ZA', name: 'South Africa', phoneCode: '+27' },
];

const countryToPhoneCode: Record<string, string> = {
  IN: '+91', US: '+1', GB: '+44', ZA: '+27',
};

const signupApiBaseUrl = '/api/signup/email-otp';

/* ─── Validators (reused from pricingForm) ─── */
const pincodeValidators: Record<string, { regex: RegExp; message: string }> = {
  IN: { regex: /^[1-9][0-9]{5}$/, message: 'Pincode must be a 6-digit number starting from 1-9.' },
  US: { regex: /^\d{5}(-\d{4})?$/, message: 'ZIP code must be 5 digits or ZIP+4 format (e.g., 12345).' },
  GB: { regex: /^([A-Z]{1,2}\d[A-Z\d]? ?\d[ABD-HJLNP-UW-Z]{2})$/i, message: 'Please enter a valid UK postcode (e.g., SW1A 1AA).' },
  ZA: { regex: /^\d{4}$/, message: 'Postal code must be a 4-digit number.' },
};

const phoneValidators: Record<string, { regex: RegExp; message: string }> = {
  '+91': { regex: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number (starts with 6-9).' },
  '+1': { regex: /^\d{10}$/, message: 'Enter a valid 10-digit US mobile number.' },
  '+44': { regex: /^7\d{9}$/, message: 'Enter a valid 10-digit UK mobile number (starting with 7).' },
  '+27': { regex: /^[6-8]\d{8}$/, message: 'Enter a valid 9-digit South African mobile number (starting with 6-8).' },
};

function isStrongPassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(password);
}

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'Asia/Kolkata';
  }
}

/* ─── Page component ─── */
export default function GetStartedPage() {
  const params = useParams();
  const router = useRouter();
  const industry = (params.industry as string) || 'business';
  const config = industryConfig[industry] || industryConfig.business;

  /* Tabs */
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  /* Signup multi-step */
  const [step, setStep] = useState(1);

  /* Form data */
  const [formData, setFormData] = useState({
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    companyName: '',
    country: '',
    state: '',
    pincode: '',
    phoneCode: '+91',
    phone: '',
    website: '',
    timezone: '',
  });

  /* Login form */
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  /* UI state */
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerificationToken, setEmailVerificationToken] = useState('');
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [emailOtpVerifying, setEmailOtpVerifying] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);

  /* Auto-detect timezone on mount */
  useEffect(() => {
    setFormData(prev => ({ ...prev, timezone: detectTimezone() }));
  }, []);

  useEffect(() => {
    copilotEventBus.emit('switchTab', { tabGroup: 'get-started-auth', tabValue: activeTab });
  }, [activeTab]);

  useEffect(() => {
    copilotEventBus.emit('formStepChange', { formStep: step });
  }, [step]);

  useEffect(() => {
    return copilotEventBus.on('switchTab', ({ tabGroup, tabValue }) => {
      if (tabGroup !== 'get-started-auth') return;
      if (tabValue === 'signup' || tabValue === 'login') {
        setActiveTab(tabValue);
        setErrors({});
        setSuccessMessage('');
      }
    });
  }, []);

  /* Update phoneCode when country changes */
  useEffect(() => {
    if (formData.country && countryToPhoneCode[formData.country]) {
      setFormData(prev => ({ ...prev, phoneCode: countryToPhoneCode[prev.country] }));
    }
  }, [formData.country]);

  useEffect(() => {
    if (otpCooldown <= 0) return;

    const timer = window.setInterval(() => {
      setOtpCooldown(seconds => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [otpCooldown]);

  /* Fetch plans from API */
  const { data: pricingData } = usePricing('allPlan');

  /* Get plans for this industry */
  const industryPlans = useMemo(() => {
    if (!pricingData || !Array.isArray(pricingData)) return [];
    const platformData = (pricingData as PricingResponse[]).find(
      p => p.platform.name === config.platformKey
    );
    return platformData?.plans || [];
  }, [pricingData, config.platformKey]);

  /* API mutation for signup */
  const { mutate, isPending } = useMutation<PricingSuccessResponse, ValidationErrorResponse, any>({
    mutationFn: (payload: any) => handlePricing({
      method: 'post',
      type: PricingActionType.ADD_MASTERCLIENT,
      data: payload,
    }),
    onSuccess: async () => {
      setSuccessMessage('Account created successfully! Logging you in...');
      setRedirecting(true);

      // Auto-login after signup: call the product app's login API with the same credentials
      try {
        const loginRes = await axios.post(config.apiLoginUrl, {
          email: formData.adminEmail,
          password: formData.adminPassword,
        });

        if (loginRes.data?.access_token) {
          // Redirect to auto-login with token — straight to dashboard
          setTimeout(() => {
            window.location.href = `${config.redirectUrl}?token=${loginRes.data.access_token}`;
          }, 1500);
          return;
        }
      } catch {
        // Auto-login failed (account may not be provisioned yet) — fall back to login page
      }

      // Fallback: redirect to the product app login page
      setTimeout(() => {
        window.location.href = `${config.appBaseUrl}/login`;
      }, 2500);
    },
    onError: (error) => {
      const details = error?.error?.details as Record<string, string[]> | undefined;
      if (details && typeof details === 'object') {
        const mapped: Record<string, string> = {};
        const apiToForm: Record<string, string> = {
          admin_password: 'adminPassword',
          admin_email: 'adminEmail',
          admin_name: 'adminName',
          company_name: 'companyName',
          company_email: 'adminEmail',
          business_mobile_number: 'phone',
          business_mobile_country_code: 'phoneCode',
          email_verification_token: 'adminEmail',
        };
        Object.entries(details).forEach(([apiField, messages]) => {
          const formField = apiToForm[apiField] || apiField;
          mapped[formField] = Array.isArray(messages) ? messages.join(' ') : String(messages);
        });
        setErrors(mapped);
        // If errors are on step 1 fields, go back to step 1
        if (mapped.adminName || mapped.adminEmail || mapped.adminPassword || mapped.companyName) {
          setStep(1);
        }
      } else {
        setErrors({ general: error?.message || 'Something went wrong. Please try again.' });
      }
    },
  });

  /* Validate step 1 */
  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    if (!formData.adminName.trim()) errs.adminName = 'Full name is required.';
    if (!formData.adminEmail.trim()) errs.adminEmail = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) errs.adminEmail = 'Enter a valid email address.';
    else if (!emailVerificationToken) errs.adminEmail = 'Verify your email with the code we sent before continuing.';
    if (!formData.adminPassword) errs.adminPassword = 'Password is required.';
    else if (!isStrongPassword(formData.adminPassword)) errs.adminPassword = 'Min 8 chars with uppercase, lowercase, number & special character.';
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  /* Validate step 2 & submit */
  function validateAndSubmit(): boolean {
    const errs: Record<string, string> = {};
    if (!formData.country) errs.country = 'Please select a country.';
    if (!formData.state.trim()) errs.state = 'State is required.';
    else if (!/^[A-Za-z\s\-]{2,}$/.test(formData.state.trim())) errs.state = 'Enter a valid state name.';
    if (!formData.pincode.trim()) errs.pincode = 'Pincode is required.';
    else if (formData.country && pincodeValidators[formData.country]) {
      if (!pincodeValidators[formData.country].regex.test(formData.pincode.trim())) {
        errs.pincode = pincodeValidators[formData.country].message;
      }
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
    else if (phoneValidators[formData.phoneCode]) {
      if (!phoneValidators[formData.phoneCode].regex.test(formData.phone.trim())) {
        errs.phone = phoneValidators[formData.phoneCode].message;
      }
    }
    if (formData.website && formData.website.trim()) {
      try { new URL(formData.website); } catch { errs.website = 'Enter a valid URL (e.g., https://example.com).'; }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  }

  async function handleSendEmailOtp() {
    const email = formData.adminEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(prev => ({ ...prev, adminEmail: 'Enter a valid email before requesting a code.' }));
      return;
    }

    setEmailOtpLoading(true);
    setErrors(prev => {
      const next = { ...prev };
      delete next.adminEmail;
      delete next.emailOtp;
      return next;
    });

    try {
      const response = await axios.post(`${signupApiBaseUrl}/send`, {
        email,
        platform: config.platformKey,
      });
      setEmailOtpSent(true);
      setOtpCooldown(response.data?.resend_after || 60);
      setSuccessMessage('');
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        adminEmail: error?.response?.data?.message || 'We could not send a verification code. Please try again.',
      }));
    } finally {
      setEmailOtpLoading(false);
    }
  }

  async function handleVerifyEmailOtp() {
    if (!/^\d{6}$/.test(emailOtp)) {
      setErrors(prev => ({ ...prev, emailOtp: 'Enter the 6-digit code from your email.' }));
      return;
    }

    setEmailOtpVerifying(true);
    setErrors(prev => {
      const next = { ...prev };
      delete next.emailOtp;
      return next;
    });

    try {
      const response = await axios.post(`${signupApiBaseUrl}/verify`, {
        email: formData.adminEmail.trim(),
        otp: emailOtp,
        platform: config.platformKey,
      });
      setEmailVerificationToken(response.data.verification_token);
      setEmailOtpSent(true);
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        emailOtp: error?.response?.data?.message || 'We could not verify that code. Try again or request a new code.',
      }));
    } finally {
      setEmailOtpVerifying(false);
    }
  }

  function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAndSubmit()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const payload = {
      plan_id: config.planIds[0], // Basic / free trial plan
      company_name: formData.companyName,
      company_email: formData.adminEmail,
      website: formData.website || `https://${formData.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      country: formData.country,
      state: formData.state,
      pincode: formData.pincode,
      timezone: formData.timezone,
      language: 'en',
      status: 'active',
      admin_name: formData.adminName,
      admin_email: formData.adminEmail,
      admin_password: formData.adminPassword,
      email_verification_token: emailVerificationToken,
      email_verification_platform: config.platformKey,
      business_mobile_country_code: formData.phoneCode,
      business_mobile_number: formData.phone,
      admin_mobile_country_code: formData.phoneCode,
      admin_mobile_number: formData.phone,
      role: 'admin',
      start_date: todayStr,
      licenses_limit: 100,
      allow_free_trial: 1,
      currency: 'USD',
      type: 'monthly',
      deployment_type: 'saas',
      redirectUrl: 'https://orixs.io/pricing',
    };

    mutate(payload);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoginLoading(true);

    // Validate
    if (!loginEmail.trim()) {
      setErrors({ loginEmail: 'Email is required.' });
      setLoginLoading(false);
      return;
    }
    if (!loginPassword) {
      setErrors({ loginPassword: 'Password is required.' });
      setLoginLoading(false);
      return;
    }

    try {
      // Call the product app's API login endpoint
      const response = await axios.post(config.apiLoginUrl, {
        email: loginEmail,
        password: loginPassword,
      });

      if (response.data?.access_token) {
        // Login successful — redirect to auto-login with JWT token
        setLoginSuccess(true);
        setErrors({});
        window.location.href = `${config.redirectUrl}?token=${response.data.access_token}`;
      } else if (response.data?.message === 'success') {
        // Fallback: some endpoints return just success without token
        setLoginSuccess(true);
        window.location.href = `${config.appBaseUrl}/account/dashboard`;
      } else {
        setErrors({ loginGeneral: 'Login failed. Please try again.' });
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setErrors({ loginGeneral: 'Invalid email or password. Please check your credentials and try again.' });
      } else if (error?.response?.data?.errors) {
        const errObj: Record<string, string> = {};
        Object.entries(error.response.data.errors).forEach(([key, val]: [string, any]) => {
          errObj[key === 'email' ? 'loginEmail' : key === 'password' ? 'loginPassword' : key] = Array.isArray(val) ? val.join(' ') : String(val);
        });
        setErrors(errObj);
      } else {
        setErrors({ loginGeneral: 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoginLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${config.appBaseUrl}/auth/google/redirect`;
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'adminEmail') {
      setEmailOtp('');
      setEmailOtpSent(false);
      setEmailVerificationToken('');
      setOtpCooldown(0);
    }
    // Clear field-level error on change
    if (errors[name]) {
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  }

  /* ─── Animation variants ─── */
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4 },
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ─── Hero / Form Section ─── */}
      <section data-copilot-section="get-started" className="relative pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,80,220,0.10),transparent)]" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

            {/* ─── Left Column: Industry Branding ─── */}
            <motion.div
              className="flex-1 lg:max-w-[480px] lg:pt-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  {config.icon}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">{config.name}</h2>
                  <p className="text-xs text-gray-400">{config.tagline}</p>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-[1.15] tracking-tight">
                {config.headline.includes('Orixs') ? (
                  <>
                    {config.headline.split('Orixs')[0]}
                    <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-500 bg-clip-text text-transparent">
                      Orixs
                    </span>
                    {config.headline.split('Orixs')[1]}
                  </>
                ) : (
                  config.headline
                )}
              </h1>

              <p className="text-gray-500 text-base sm:text-lg mb-8 leading-relaxed">
                {config.description}
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {config.benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                      {b.icon}
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">{b.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  30-day free trial
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Live in under a week
                </span>
              </div>
            </motion.div>

            {/* ─── Right Column: Form Card ─── */}
            <motion.div
              className="flex-1 w-full lg:max-w-[520px]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 p-6 sm:p-8">

                {/* Tab Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                  {(['signup', 'login'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setErrors({});
                        setSuccessMessage('');
                        copilotEventBus.emit('switchTab', { tabGroup: 'get-started-auth', tabValue: tab });
                      }}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        activeTab === tab
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'signup' ? 'Sign Up' : 'Log In'}
                    </button>
                  ))}
                </div>

                {/* Success overlay */}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center text-center py-10"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h3>
                      <p className="text-gray-500 text-sm mb-4">{successMessage}</p>
                      {redirecting && (
                        <div className="flex items-center gap-2 text-purple-600 text-sm">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Redirecting...
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* General error */}
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {errors.general}
                  </div>
                )}

                {/* ─── Sign Up Tab ─── */}
                {activeTab === 'signup' && !successMessage && (
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.form
                        data-copilot-id="signup-form"
                        key="step1"
                        onSubmit={handleContinue}
                        {...fadeUp}
                      >
                        <div className="space-y-4">
                          {/* Full Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                            <input
                              type="text"
                              name="adminName"
                              value={formData.adminName}
                              onChange={handleInputChange}
                              placeholder="Jane Smith"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                              required
                            />
                            {errors.adminName && <p className="text-red-500 text-xs mt-1">{errors.adminName}</p>}
                          </div>

                          {/* Work Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Work Email</label>
                            <div className="flex gap-2">
                              <input
                                type="email"
                                name="adminEmail"
                                value={formData.adminEmail}
                                onChange={handleInputChange}
                                placeholder="jane@company.com"
                                className="min-w-0 flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                required
                                disabled={Boolean(emailVerificationToken)}
                              />
                              <button
                                type="button"
                                onClick={handleSendEmailOtp}
                                disabled={emailOtpLoading || Boolean(emailVerificationToken) || otpCooldown > 0}
                                className="shrink-0 rounded-xl border border-purple-200 px-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {emailVerificationToken
                                  ? 'Verified'
                                  : emailOtpLoading
                                    ? 'Sending...'
                                    : otpCooldown > 0
                                      ? `Resend ${otpCooldown}s`
                                      : emailOtpSent
                                        ? 'Resend code'
                                        : 'Send code'}
                              </button>
                            </div>
                            {errors.adminEmail && <p className="text-red-500 text-xs mt-1">{errors.adminEmail}</p>}
                            {emailOtpSent && !emailVerificationToken && (
                              <div className="mt-3 rounded-lg border border-purple-100 bg-purple-50 p-3">
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Enter the 6-digit code we sent</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    value={emailOtp}
                                    onChange={event => setEmailOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="123456"
                                    className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-sm tracking-[0.25em] focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleVerifyEmailOtp}
                                    disabled={emailOtpVerifying || emailOtp.length !== 6}
                                    className="shrink-0 rounded-lg bg-purple-600 px-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {emailOtpVerifying ? 'Verifying...' : 'Verify'}
                                  </button>
                                </div>
                                {errors.emailOtp && <p className="text-red-500 text-xs mt-2">{errors.emailOtp}</p>}
                              </div>
                            )}
                            {emailVerificationToken && (
                              <p className="mt-2 text-xs font-medium text-green-700">Email verified. Continue with your account details.</p>
                            )}
                          </div>

                          {/* Password */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="adminPassword"
                                value={formData.adminPassword}
                                onChange={handleInputChange}
                                placeholder="Create a secure password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                              >
                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                              </button>
                            </div>
                            {errors.adminPassword && <p className="text-red-500 text-xs mt-1">{errors.adminPassword}</p>}
                          </div>

                          {/* Company Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                            <input
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              placeholder="Acme Inc."
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                              required
                            />
                            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                          </div>
                        </div>

                        {/* Continue CTA */}
                        <button
                          type="submit"
                          disabled={!emailVerificationToken}
                          className="w-full mt-6 bg-purple-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-purple-700 transition shadow-lg shadow-purple-200"
                        >
                          Continue for Free
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-3">
                          Unlimited access · No credit card needed · 30-day free trial
                        </p>
                      </motion.form>
                    ) : (
                      <motion.form
                        data-copilot-id="signup-form"
                        key="step2"
                        onSubmit={handleSignupSubmit}
                        {...fadeUp}
                      >
                        {/* Back button */}
                        <button
                          type="button"
                          onClick={() => { setStep(1); setErrors({}); }}
                          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-4 transition"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                          Back
                        </button>

                        <p className="text-sm text-gray-500 mb-4">Just a few more details to set up your account.</p>

                        <div className="space-y-4">
                          {/* Country */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country <span className="text-red-400">*</span></label>
                            <select
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white"
                              required
                            >
                              <option value="">Select your country</option>
                              {countries.map(c => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                              ))}
                            </select>
                            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                          </div>

                          {/* State + Pincode row */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">State <span className="text-red-400">*</span></label>
                              <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="State"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                required
                              />
                              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode <span className="text-red-400">*</span></label>
                              <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                placeholder="Pincode"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                required
                              />
                              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                            </div>
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
                            <div className="flex">
                              <select
                                name="phoneCode"
                                value={formData.phoneCode}
                                onChange={handleInputChange}
                                className="border border-gray-300 border-r-0 rounded-l-xl px-3 py-2.5 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[100px]"
                              >
                                {countries.map(c => (
                                  <option key={c.phoneCode} value={c.phoneCode}>{c.name.split(' ')[0]} ({c.phoneCode})</option>
                                ))}
                              </select>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone number"
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                required
                              />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                          </div>

                          {/* Website (optional) */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Website <span className="text-gray-400 text-xs">(optional)</span></label>
                            <input
                              type="url"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              placeholder="https://www.example.com"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />
                            {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
                          </div>

                          {/* Timezone (auto-detected) */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone <span className="text-gray-400 text-xs">(auto-detected)</span></label>
                            <input
                              type="text"
                              name="timezone"
                              value={formData.timezone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                              readOnly
                            />
                          </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2 mt-5">
                          <input type="checkbox" id="terms" required className="mt-0.5 accent-purple-600" />
                          <label htmlFor="terms" className="text-xs text-gray-500">
                            I agree to the{' '}
                            <a href="/terms-and-conditions" target="_blank" className="text-purple-600 hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="/privacy" target="_blank" className="text-purple-600 hover:underline">Privacy Policy</a>
                          </label>
                        </div>

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={isPending}
                          className={`w-full mt-5 bg-purple-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-purple-700 transition shadow-lg shadow-purple-200 flex items-center justify-center gap-2 ${
                            isPending ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        >
                          {isPending ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                              Creating account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                )}

                {/* ─── Log In Tab ─── */}
                {activeTab === 'login' && !successMessage && !loginSuccess && (
                  <motion.form
                    data-copilot-id="login-form"
                    onSubmit={handleLogin}
                    {...fadeUp}
                  >
                    {/* Login error */}
                    {errors.loginGeneral && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {errors.loginGeneral}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={e => { setLoginEmail(e.target.value); if (errors.loginEmail) setErrors(prev => { const n = { ...prev }; delete n.loginEmail; return n; }); }}
                          placeholder="your@email.com"
                          className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${errors.loginEmail ? 'border-red-300' : 'border-gray-300'}`}
                          required
                          disabled={loginLoading}
                        />
                        {errors.loginEmail && <p className="text-red-500 text-xs mt-1">{errors.loginEmail}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                          <input
                            type={showLoginPassword ? 'text' : 'password'}
                            value={loginPassword}
                            onChange={e => { setLoginPassword(e.target.value); if (errors.loginPassword) setErrors(prev => { const n = { ...prev }; delete n.loginPassword; return n; }); }}
                            placeholder="Enter your password"
                            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-10 ${errors.loginPassword ? 'border-red-300' : 'border-gray-300'}`}
                            required
                            disabled={loginLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            tabIndex={-1}
                          >
                            {showLoginPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                          </button>
                        </div>
                        {errors.loginPassword && <p className="text-red-500 text-xs mt-1">{errors.loginPassword}</p>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                        <input type="checkbox" className="accent-purple-600" />
                        Stay logged in
                      </label>
                      <a
                        href={`${config.appBaseUrl}/forgot-password`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-600 hover:underline font-medium"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={loginLoading}
                      className={`w-full mt-5 bg-purple-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-purple-700 transition shadow-lg shadow-purple-200 flex items-center justify-center gap-2 ${
                        loginLoading ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      {loginLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Logging in...
                        </>
                      ) : (
                        'Log In'
                      )}
                    </button>

                    <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
                      <div className="h-px flex-1 bg-gray-200" />
                      <span>or</span>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loginLoading}
                      className="w-full min-h-[54px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-purple-300 hover:bg-purple-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Continue with Google"
                    >
                      <span className="flex min-w-0 items-center justify-center gap-3 whitespace-normal text-center">
                        <FcGoogle className="h-5 w-5 flex-none" />
                        <span className="min-w-0 break-words leading-5">Continue with Google</span>
                      </span>
                    </button>

                    <p className="text-center text-sm text-gray-400 mt-4">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('signup');
                          setErrors({});
                          copilotEventBus.emit('switchTab', { tabGroup: 'get-started-auth', tabValue: 'signup' });
                        }}
                        className="text-purple-600 font-semibold hover:underline"
                      >
                        Sign up
                      </button>
                    </p>
                  </motion.form>
                )}

                {/* Login success overlay */}
                {loginSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Login Successful!</h3>
                    <p className="text-gray-500 text-sm mb-4">Taking you to your dashboard...</p>
                    <div className="flex items-center gap-2 text-purple-600 text-sm">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Redirecting...
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Industry switcher */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>Looking for another industry?</span>
                {Object.entries(industryConfig)
                  .filter(([key]) => key !== industry)
                  .map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => router.push(`/get-started/${key}`)}
                      className="text-purple-600 font-medium hover:underline"
                    >
                      {val.name}
                    </button>
                  ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Plan Comparison Cards — hidden per investor request (free-only for now) ─── */}
      {/* {industryPlans.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50/50">
          ...plan cards...
        </section>
      )} */}

      <FooterSection />
    </main>
  );
}
