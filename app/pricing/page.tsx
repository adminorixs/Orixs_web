'use client';
import { Navbar } from '@/components/Navbar';
import { FooterSection } from '@/components/FooterSection';
import { useState, useRef, useCallback, useEffect } from 'react';
import { FaBriefcase, FaShieldAlt, FaHardHat, FaFilm, FaGraduationCap, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Listbox } from '@headlessui/react';
import { usePricing } from '@/hooks/api/usePricing';
import { useMutation, useQuery } from '@tanstack/react-query';
import { handlePricing } from '@/lib/api/tanstack/pricingApi';
import PricingForm from '@/components/form/pricingForm';
import Modal from '@/components/modal/modal';
import { convertApiToPricingData } from '@/lib/utils/convertApiToPricingData';
import { PlatformPricing } from '@/lib/interface/pricing';
import { handlePartner } from '@/lib/api/tanstack/partnerApi';
import { Bot, CircleOff, User } from 'lucide-react';
import PageLoader from '@/components/loader/PageLoader';
import { PricingPlan } from '@/lib/interface/pricing';
import { copilotEventBus } from '@/lib/copilot/eventBus';
// Define types
// interface PricingPlan {
//   maxUserLimit: any;
//   trialDays: any;
//   freeTrial: any;
//   recommended: string;
//   title: string;
//   price: string;
//   features: string[];
//   cta: string;
//   highlight?: boolean;
//   description?: string;
//   discount?: number;
//   discountType?: 'percentage' | 'fixed' | 'none'; // Type for discount
// }
export interface Plan {
  pricing: any;
  id: number;
  name: string;
  display_name: string;
  description: string;
  plan_type: string;
  min_licenses: number;
  max_licenses: number;
  monthly_amounts: CurrencyAmount[];
  yearly_amounts: CurrencyAmount[];
  currency: Currency;
  feature: string[];
}


export interface CurrencyAmount {
  currency_id: number;
  currency_code: string;
  currency_name: string;
  currency_symbol: string;
  amount: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}
// interface PlatformPricing {
//   platform: {
//     id: number;
//     name: string; // e.g., "rini-insurance", "scene-one"
//     description: string;
//   };
//   plans: Plan[];
// }

type TabKey = 'RINI' | 'Insurance' | 'Construction' | 'Scene One' | 'Intern Africa';

const navTabs: { key: TabKey; name: string; icon: JSX.Element }[] = [
  { key: 'RINI', name: 'Orixs', icon: <FaBriefcase className="text-xl sm:text-2xl md:text-3xl text-purple-500" /> },
  { key: 'Insurance', name: 'Insurance', icon: <FaShieldAlt className="text-2xl md:text-3xl text-purple-500" /> },
  { key: 'Intern Africa', name: 'Intern Africa', icon: <FaGraduationCap className="text-2xl md:text-3xl text-purple-500" /> },
  { key: 'Construction', name: 'Construction', icon: <FaHardHat className="text-2xl md:text-3xl text-purple-500" /> },
  { key: 'Scene One', name: 'Scene One', icon: <FaFilm className="text-2xl md:text-3xl text-purple-500" /> },
];


function extractFeatures(plan: Plan, tab: string): string[] {
  switch (tab) {
    case 'RINI':
      return [
        'Centralized Administration',
        'HR, Payroll & Recruitment',
        'Project Management',
        'Finance',
        'Document Centre',
        'CRM',
        'Campaigns & Forms',
        'Commerce',
        'Travel Planner',
        'Communication Suite',
        'Real Time Dashboards & Reports',
        'Video Conferencing',
      ];
    case 'Insurance':
      return [
        'Dashboard',
        'Profile Management',
        'Shift Schedule & Calendar',
        'Leads',
        'Insurance Plans (Products)',
        'Proposals & Quotes',
        'Clients',
        'Finance',
        'Document Centre & Notice Board',
        'Tickets & Tasks',
        'HR Tools',
        'Reports You Can Count On',
        'Admin & Settings',
      ];
    case 'Construction':
      return [
        'Dashboard',
        'Profile',
        'Projects',
        'Tasks',
        'Tickets',
        'Human Resources',
        'Vendors',
        'BOQ',
        'Technical Details',
        'Files',
        'Projections',
        'Finance',
        'Tenders',
        'Document Centre',
        'Reports',
        'Settings',
      ];
    case 'Scene One':
      return [
        'Studio Dashboard',
        'Casting Lounge',
        'Studio Dashboard',
        'Casting Desk',
        'Casting Crew',
        'Bookings & Box Office',
        'Contracts & Documents',
        'Scene Settings',
        'Support Tickets',
      ];
    case 'Intern Africa':
      return [
        'Role-Based Dashboards',
        'Structured Profile Format',
        'Granular Permissions',
        'Plan Tracking',
        'Seamless Signup Flows',
        'Bookings & Box Office',
        'Contracts & Documents',
        'Scene Settings',
        'Support Tickets',
      ];
    default:
      return [];
  }
}




// const pricingData: Record<TabKey, PricingPlan[]> = {
//   Orixs: [
//     {
//       title: 'Startup Plan',
//       description: 'Perfect For growing startups & small teams',
//       price: '$19/mo',
//       features: [
//         'Centralized Administration',
//         'HR, Payroll & Recruitment',
//         'Project Management',
//         'Finance',
//         'Document Centre',
//         'CRM',
//         'Campaigns & Forms',
//         'Commerce',
//         'Travel Planner',
//         'Communication Suite',
//         'Real Time Dashboards & Reports',
//         'Video Conferencing',
//       ],
//       cta: 'Get Started',
//     },
//     {
//       title: 'Business Pro',
//       description: 'Ideal for established businesses & larger teams',
//       price: '$49/mo',
//       features: [
//         'Centralized Administration',
//         'HR, Payroll & Recruitment',
//         'Project Management',
//         'Finance',
//         'Document Centre',
//         'CRM',
//         'Campaigns & Forms',
//         'Commerce',
//         'Travel Planner',
//         'Communication Suite',
//         'Real Time Dashboards & Reports',
//         'Video Conferencing',
//       ],
//       cta: 'Get Started',
//       highlight: true,
//     },
//     {
//       title: 'Enterprise',
//       price: 'Custom',
//       description: 'Tailored solutions for larger organizations',
//       features: [],
//       cta: 'Get Started',
//     },
//   ],
//   Insurance: [
//     {
//       title: 'Startup Plan',
//       description: 'Perfect For growing startups & small teams',
//       price: '$29/mo',
//       features: [
//         'Dashboard',
//         'Profile Management',
//         'Shift Schedule & Calendar',
//         'Leads',
//         'Insurance Plans (Products)',
//         'Proposals & Quotes',
//         'Clients',
//         'Finance',
//         'Document Centre & Notice Board',
//         'Tickets & Tasks',
//         'HR Tools',
//         'Reports You Can Count On',
//         'Admin & Settings',
//       ],
//       cta: 'Get Started',
//     },
//     {
//       title: 'Business Pro',
//       description: 'Ideal for established businesses & larger teams',
//       price: '$79/mo',
//       features: [
//         'Dashboard',
//         'Profile Management',
//         'Shift Schedule & Calendar',
//         'Leads',
//         'Insurance Plans (Products)',
//         'Proposals & Quotes',
//         'Clients',
//         'Finance',
//         'Document Centre & Notice Board',
//         'Tickets & Tasks',
//         'HR Tools',
//         'Reports You Can Count On',
//         'Admin & Settings',
//       ],
//       cta: 'Get Started',
//       highlight: true,
//     },
//     {
//       title: 'Enterprise',
//       price: 'Custom',
//       description: 'Tailored solutions for larger organizations',
//       features: [],
//       cta: 'Get Started',
//     },
//   ],
//   Construction: [
//     {
//       title: 'Startup Plan',
//       description: 'Perfect For growing startups & small teams',
//       price: '$39/mo',
//       features: [
//         'Dashboard',
//         'Profile',
//         'Projects',
//         'Tasks',
//         'Tickets',
//         'Human Resources',
//         'Vendors',
//         'BOQ',
//         'Technical Details',
//         'Files',
//         'Projections',
//         'Finance',
//         'Tenders',
//         'Document Centre',
//         'Reports',
//         'Settings',
//       ],
//       cta: 'Get Started',
//     },
//     {
//       title: 'Business Pro',
//       description: 'Ideal for established businesses & larger teams',
//       price: '$99/mo',
//       features: [
//         'Dashboard',
//         'Profile',
//         'Projects',
//         'Tasks',
//         'Tickets',
//         'Human Resources',
//         'Vendors',
//         'BOQ',
//         'Technical Details',
//         'Files',
//         'Projections',
//         'Finance',
//         'Tenders',
//         'Document Centre',
//         'Reports',
//         'Settings',
//       ],
//       cta: 'Get Started',
//       highlight: true,
//     },
//     {
//       title: 'Enterprise',
//       price: 'Custom',
//       description: 'Tailored solutions for larger organizations',
//       features: [],
//       cta: 'Get Started',
//     },
//   ],
//   'Scene One': [
//     {
//       title: 'Startup Plan',
//       description: 'Perfect For growing startups & small teams',
//       price: '$25/mo',
//       features: [
//         'Studio Dashboard',
//         'Casting Lounge',
//         'Studio Dashboard',
//         'Casting Desk',
//         'Casting Crew',
//         'Bookings & Box Office',
//         'Contracts & Documents',
//         'Scene Settings',
//         'Support Tickets',
//       ],
//       cta: 'Get Started',
//     },
//     {
//       title: 'Business Pro',
//       description: 'Ideal for established businesses & larger teams',
//       price: '$59/mo',
//       features: [
//         'Studio Dashboard',
//         'Casting Lounge',
//         'Studio Dashboard',
//         'Casting Desk',
//         'Casting Crew',
//         'Bookings & Box Office',
//         'Contracts & Documents',
//         'Scene Settings',
//         'Support Tickets',
//       ],
//       cta: 'Get Started',
//       highlight: true,
//     },
//     {
//       title: 'Enterprise',
//       price: 'Custom',
//       description: 'Tailored solutions for larger organizations',
//       features: [],
//       cta: 'Get Started',
//     },
//   ],
//   'Intern Africa': [
//     {
//       title: 'Startup Plan',
//       description: 'Perfect For growing startups & small teams',
//       price: '$9/mo',
//       features: [
//         'Role-Based Dashboards',
//         'Structured Profile Format',
//         'Granular Permissions',
//         'Plan Tracking',
//         'Seamless Signup Flows',
//         'Bookings & Box Office',
//         'Contracts & Documents',
//         'Scene Settings',
//         'Support Tickets',
//       ],
//       cta: 'Get Started',
//     },
//     {
//       title: 'Business Pro',
//       description: 'Ideal for established businesses & larger teams',
//       price: '$99/mo',
//       features: [
//         'Role-Based Dashboards',
//         'Structured Profile Format',
//         'Granular Permissions',
//         'Plan Tracking',
//         'Seamless Signup Flows',
//         'Bookings & Box Office',
//         'Contracts & Documents',
//         'Scene Settings',
//         'Support Tickets',
//       ],
//       cta: 'Get Started',
//       highlight: true,
//     },
//     {
//       title: 'Enterprise',
//       price: 'Custom',
//       description: 'Tailored solutions for larger organizations',
//       features: [
//         'Role-Based Dashboards',
//         'Structured Profile Format',
//         'Granular Permissions',
//         'Plan Tracking',
//         'Seamless Signup Flows',
//         'Bookings & Box Office',
//         'Contracts & Documents',
//         'Scene Settings',
//         'Support Tickets',
//       ],
//       cta: 'Get Started',
//     },
//   ],
// };

// Box dimensions for each module
const boxDimensions: Record<TabKey, string> = {
  RINI: 'min-h-[420px] w-full',
  Insurance: 'min-h-[420px] w-full',
  'Intern Africa': 'min-h-[420px] w-full',
  Construction: 'min-h-[420px] w-full',
  'Scene One': 'min-h-[420px] w-full',
};

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'ZAR', label: 'ZAR (R)' },
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('RINI');
  const [showFormModal, setShowFormModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currency, setCurrency] = useState<Record<TabKey, 'USD' |'INR' | 'GBP' | 'ZAR'>>({
    RINI: 'USD',
    Insurance: 'USD',
    Construction: 'USD',
    'Scene One': 'USD',
    'Intern Africa': 'USD',
  });
  const [billingPeriod, setBillingPeriod] = useState<Record<TabKey, 'monthly' | 'yearly'>>({
    RINI: 'monthly',
    Insurance: 'monthly',
    Construction: 'monthly',
    'Scene One': 'monthly',
    'Intern Africa': 'monthly',
  });
  const [licenseCounts, setLicenseCounts] = useState<Record<TabKey, string>>({
    RINI: '1',
    Insurance: '1',
    Construction: '1',
    'Scene One': '1',
    'Intern Africa': '1',
  });
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [pricingData, setPricingData] = useState<Record<string, PricingPlan[]>>({});
  const [pricingFormData, setPricingFormData] = useState({
    companyEmail: '',
    mobileNumber: '',
    country: '',
    state: '',
    pincode: '',
    timezone: 'Asia/Kolkata',
    website: '',
    countryCode:'',
    password: '',
  });
  const {data,isSuccess,isLoading} = usePricing();

  // Before the modal and main input fields, define selectedTab
  const selectedTab = selectedPlan ? (selectedPlan?.title as TabKey) : activeTab;
  // Helper to get numeric license count for active tab
  const getLicenseCount = (tab: TabKey) => {
    const count = parseInt(licenseCounts[tab]);
    return isNaN(count) ? 1 : Math.max(1, Math.min(100, count));
  };

  // Handler for license count changes
  const handleLicenseCountChange = (tab: TabKey, value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setLicenseCounts(prev => ({ ...prev, [tab]: value }));
    }
  };

  // Handler for license count blur
  const handleLicenseCountBlur = (tab: TabKey) => {
    setLicenseCounts(prev => ({ ...prev, [tab]: getLicenseCount(tab).toString() }));
  };

  // Add increment/decrement handlers for licenses
  const incrementLicenses = (tab: TabKey) => {
    const currentCount = getLicenseCount(tab);
    if (currentCount < 100) {
      setLicenseCounts(prev => ({ ...prev, [tab]: (currentCount + 1).toString() }));
    }
  };
  const decrementLicenses = (tab: TabKey) => {
    const currentCount = getLicenseCount(tab);
    if (currentCount > 1) {
      setLicenseCounts(prev => ({ ...prev, [tab]: (currentCount - 1).toString() }));
    }
  };

  // Prevent wheel scrolling
  const preventScroll = (e: React.WheelEvent) => {
    e.preventDefault();
  };

  interface CurrencyMeta {
  symbol: string;
  rate: number;
}

type CurrencyCode = 'USD' | 'INR' | 'GBP' | 'ZAR';


const currencyData: Record<CurrencyCode, CurrencyMeta> = {
  USD: { symbol: '$', rate: 1 },
  INR: { symbol: '₹', rate: 83 },
  GBP: { symbol: '£', rate: 0.79 },
  ZAR: { symbol: 'R', rate: 18.5 },
};
  

  // Helper to convert price number to display string with currency
  // Deprecated: use getDiscountedYearlyPriceV2 instead
  // function getDiscountedYearlyPrice(price: number, discount = 0.2) {
  //   const yearlyPrice = price * 12;
  //   return yearlyPrice * (1 - discount);
  // }

  // Updated: support dynamic discount and type
  function getDiscountedYearlyPriceV2(price: number, discount: number = 0, discountType: string = 'none') {
    const yearlyPrice = price * 12;
    if (discountType === 'percentage' || discountType === 'percent') {
      return yearlyPrice * (1 - (discount / 100));
    } else if (discountType === 'fixed') {
      return yearlyPrice - discount;
    }
    return yearlyPrice;
  }

  function formatPrice(basePrice: number, rate: any, symbol: string, licenses: number = 1, discount?: number, discountType?: string) {
    if (basePrice === 0) return 'Custom';
    let total = basePrice;
    let suffix = '/mo';
    if (billingPeriod[activeTab] === 'yearly') {
      total = getDiscountedYearlyPriceV2(basePrice, discount, discountType);
      suffix = '/yr';
    }
    return `${symbol}${total.toFixed(2)}${suffix}`;
  }

  function formatPerLicenseText(price: number, symbol: string, billing: 'monthly' | 'yearly', discount?: number, discountType?: string) {
    if (billing === 'yearly') {
      const discounted = getDiscountedYearlyPriceV2(price, discount, discountType);
      let discountText = '';
      if (discount && discount > 0) {
        if (discountType === 'percentage' || discountType === 'percent') {
          discountText = ` (${discount}% off)`;
        } else if (discountType === 'fixed') {
          discountText = ` (${symbol}${discount} off)`;
        }
      }
      return `${symbol}${discounted.toFixed(2)} per license/year${discountText}`;
    }
    return `${symbol}${price.toFixed(2)} per license/month`;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPricingFormData(prev => ({ ...prev, [name]: value }));
  };
  // Mobile number validation by country code
  function validateMobileNumber(countryCode: string, mobileNumber: string) {
    if (!mobileNumber) return false;
    if (countryCode === '+91') {
      // India: 10 digits, starts with 6-9
      return /^([6-9][0-9]{9})$/.test(mobileNumber);
    } else if (countryCode === '+1') {
      // US: 10 digits
      return /^\d{10}$/.test(mobileNumber);
    } else if (countryCode === '+44') {
      // UK: 10 or 11 digits
      return /^\d{10,11}$/.test(mobileNumber);
    } else if (countryCode === '+27') {
      // South Africa: 9 digits
      return /^\d{9}$/.test(mobileNumber);
    }
    // Default: at least 6 digits
    return /^\d{6,}$/.test(mobileNumber);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate mobile number
    const { countryCode = '', mobileNumber = '' } = pricingFormData;
    if (!validateMobileNumber(countryCode, mobileNumber)) {
      alert('Please enter a valid mobile number for the selected country code.');
      return;
    }

    const payload = {
      billingPeriod: billingPeriod[activeTab],
      ...pricingFormData,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/master-clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to submit');

      const result = await response.json();
      console.log('Submission successful:', result);

      // Reset or close modal
      setShowFormModal(false);
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting the form.');
    }
  };

  useEffect(() => {
    if (isSuccess && data && Array.isArray(data) && data.length > 0 && 'platform' in data[0]) {
      const result = convertApiToPricingData(data as PlatformPricing[],currency[activeTab]) as Record<string, PricingPlan[]>;
      setPricingData(result);
    }

  }, [isSuccess, data,currency]);

  useEffect(() => {
    return copilotEventBus.on('switchTab', ({ tabGroup, tabValue }) => {
      if (tabGroup === 'pricing-platform' && navTabs.some((tab) => tab.key === tabValue)) {
        setActiveTab(tabValue as TabKey);
      }
      if (tabGroup === 'pricing-billing' && (tabValue === 'monthly' || tabValue === 'yearly')) {
        setBillingPeriod(prev => ({ ...prev, [activeTab]: tabValue }));
      }
    });
  }, [activeTab]);

  useEffect(() => {
    return copilotEventBus.on('filterChange', ({ currency: nextCurrency, billingPeriod: nextBillingPeriod }) => {
      if (nextCurrency && currencies.some((item) => item.value === nextCurrency)) {
        setCurrency(prev => ({ ...prev, [activeTab]: nextCurrency as 'USD' | 'INR' | 'GBP' | 'ZAR' }));
      }
      if (nextBillingPeriod === 'monthly' || nextBillingPeriod === 'yearly') {
        setBillingPeriod(prev => ({ ...prev, [activeTab]: nextBillingPeriod }));
      }
    });
  }, [activeTab]);

  const handlePricingModal = (plan:PricingPlan) =>{
    setSelectedPlan(plan);
    setShowFormModal(true);
  }

  // Consistent box sizing for all tabs
  const boxClass =
    'flex flex-col rounded-2xl shadow-lg border transition-transform md:hover:scale-105 bg-white px-6 py-8 items-center text-center';

  return (
    <main className="min-h-screen bg-white pt-20 pb-0 flex flex-col">
      <Navbar />
      <section data-copilot-section="pricing-plans" className="max-w-5xl mx-auto px-4 py-12 flex-1 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-500 mb-8 text-center">Select Your Perfect Plan</h1>
        <p className="text-gray-600 text-lg sm:text-xl mb-8 text-center max-w-2xl">Choose the plan that fits your business. No hidden fees, no surprises. Upgrade, downgrade, or cancel anytime.</p>
        <div className="h-10" />
        {/* Main pricing page: compact selectors */}
        <div className="flex flex-col md:flex-row justify-center w-full mb-8 gap-3 md:gap-5">
          <div data-copilot-id="pricing-currency" className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-sm text-purple-700 font-semibold">Currency</span>
            <div className="relative">
              <Listbox value={currency[activeTab]} onChange={(val: 'USD' | 'INR' | 'GBP' | 'ZAR') => {
                setCurrency(prev => ({ ...prev, [activeTab]: val }));
                copilotEventBus.emit('filterChange', { filterGroup: 'pricing', currency: val, billingPeriod: billingPeriod[activeTab] });
              }}>
                <div className="relative w-24">
                  <Listbox.Button className="relative text-nowrap w-full border border-purple-300 rounded px-3 py-1.5 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm pr-7 cursor-pointer hover:border-purple-500">
                    <span className="block truncate">{currencies.find(c => c.value === currency[activeTab])?.label}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-full bg-white border border-purple-200 rounded-lg shadow-lg z-10">
                    {currencies.map((c) => (
                      <Listbox.Option
                        key={c.value}
                        value={c.value}
                        className={({ active }) =>
                          `cursor-pointer select-none px-4 py-2 text-nowrap ${
                            active ? 'bg-purple-100 text-purple-700' : 'text-gray-900'
                          }`
                        }
                      >
                        {c.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>
          <div data-copilot-id="pricing-billing" className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-sm text-purple-700 font-semibold">Billing</span>
            <select
              value={billingPeriod[activeTab]}
              onChange={e => {
                const value = e.target.value as 'monthly' | 'yearly';
                setBillingPeriod(prev => ({ ...prev, [activeTab]: value }));
                copilotEventBus.emit('filterChange', { filterGroup: 'pricing', currency: currency[activeTab], billingPeriod: value });
              }}
              className="border border-purple-300 rounded px-3 py-1.5 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm cursor-pointer hover:border-purple-500 h-8"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          {/* <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-sm text-purple-700 font-semibold">Number of Licenses</span>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min="1"
                max="100"
                value={licenseCounts[activeTab] && licenseCounts[activeTab] !== '' ? licenseCounts[activeTab] : '1'}
                onChange={(e) => handleLicenseCountChange(activeTab, e.target.value)}
                onBlur={() => handleLicenseCountBlur(activeTab)}
                onWheel={preventScroll}
                className="w-16 px-2 py-1 border border-purple-300 rounded text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm text-center pr-7"
              />
              <div className="absolute right-1 inset-y-1 flex flex-col justify-between">
                <button
                  type="button"
                  onClick={() => incrementLicenses(activeTab)}
                  className="h-4 w-4 rounded flex items-center justify-center hover:bg-purple-100 transition-colors group"
                  tabIndex={-1}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-2.5 w-2.5 text-purple-600 group-hover:text-purple-700 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => decrementLicenses(activeTab)}
                  className="h-4 w-4 rounded flex items-center justify-center hover:bg-purple-100 transition-colors group"
                  tabIndex={-1}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-2.5 w-2.5 text-purple-600 group-hover:text-purple-700 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div> */}
        </div>
        {/* Single responsive tab navigation — scrollable on mobile */}
        <div data-copilot-id="pricing-platform-tabs" className="w-full max-w-4xl mb-10 overflow-x-auto scrollbar-hide">
          <div className="flex bg-white rounded-xl border px-2 py-2 gap-2 shadow min-w-max mx-auto w-fit">
            {navTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  copilotEventBus.emit('switchTab', { tabGroup: 'pricing-platform', tabValue: tab.key });
                }}
                className={`flex items-center gap-1 md:gap-2 px-3 md:px-5 lg:px-6 py-2 md:py-3 text-xs sm:text-sm lg:text-base font-medium transition whitespace-nowrap justify-center ${
                  activeTab === tab.key
                    ? 'bg-purple-100 text-purple-700 shadow border border-purple-300 rounded-2xl'
                    : 'text-gray-700 hover:bg-gray-100 rounded-lg'
                }`}
              >
                <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                  {tab.icon}
                </div>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
        {
          isLoading && <PageLoader />
        }
        {/* Pricing Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full ">
          {!isLoading && (!pricingData[activeTab]?.length || pricingData[activeTab].every((p) => p.price == '0')) ? (
              <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-slate-50 border border-slate-200">
                <CircleOff className="w-12 h-12 text-purple-400/70" strokeWidth={1.5} />
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-medium text-slate-700">No Plans Available</h3>
                  <p className="text-sm text-slate-500 max-w-md">
                    We don't have any plans for this currency yet. 
                    <br className="hidden sm:block" />
                    Please check back later or try another currency.
                  </p>
                </div>
              </div>
            ) :  pricingData[activeTab]?.map((plan: PricingPlan, idx) => (
             plan.price != "0" && 
             <div
                key={plan.title}
                data-copilot-plan-id={String(plan.planId ?? plan.title)}
                data-copilot-plan-name={String(plan.title).toLowerCase()}
                onClick={() => handlePricingModal(plan)}
                className={`relative flex flex-col rounded-2xl shadow-lg border transition-transform md:hover:scale-105 hover:border-purple-600 bg-white px-6 py-8 items-center text-center ${boxDimensions[activeTab]} mx-auto flex-1 ${plan.highlight ? ' shadow-purple-100 md:scale-105' : 'border-gray-200'}`}
              >
              
              {plan?.recommended === 'Yes' && (
                <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none">
                  <div className="absolute top-6 left-[-32px] w-[140px] bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-bold py-1.5 text-center transform -rotate-45 shadow-lg whitespace-nowrap">
                    Recommended
                  </div>
                </div>
              )}
              <h2 className="text-xl sm:text-2xl font-semibold mt-2 w-52 text-wrap mx-auto text-purple-700">{plan.title}</h2>
              {plan.description && (
                <div className="text-gray-500 text-xs sm:text-sm mb-3 mt-3" dangerouslySetInnerHTML={{ __html: plan.description }} />
              )}
              <div className="text-3xl sm:text-4xl font-bold mb-5 text-gray-900 mt-6">
                {formatPrice(Number(plan?.price), currencyData[currency[activeTab]].rate.toFixed(2), currencyData[currency[activeTab]].symbol, getLicenseCount(activeTab), plan.discount, plan.discountType)}
              </div>


              {/* Show discount if available and not Enterprise */}
              {plan.title !== 'Enterprise' && (plan.discount ?? 0) > 0 && (
                <div className="text-xs text-green-600 font-semibold mb-1">
                  {plan.discountType === 'percentage'
                    ? `${plan.discount ?? 0}% off`
                    : plan.discountType === 'fixed'
                      ? `${currencyData[currency[activeTab]].symbol}${plan.discount ?? 0} off`
                      : null}
                </div>
              )}
              {/* {plan.title !== 'Enterprise' && (
                <div className="text-sm text-gray-500 mb-4">
                  {formatPerLicenseText(
                    Number(plan?.price) || 0,
                    currencyData[currency[activeTab]].symbol,
                    billingPeriod[activeTab],
                    plan.discount ?? 0,
                    plan.discountType
                  )}
                </div>
              )} */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4 w-full">
                {plan?.maxUserLimit && (
                  <div className="bg-purple-50 rounded-lg px-3 py-2 flex flex-col items-center">
                    <div className="flex items-center gap-1.5 mb-1">
                      <User className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-700">User Limit</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {String(plan.maxUserLimit) === 'Unlimited' ? 'Unlimited' : `${plan.maxUserLimit}`}
                    </span>
                  </div>
                )}
                {plan?.aiCreditsLimit && (
                  <div className="bg-purple-50 rounded-lg px-3 py-2 flex flex-col items-center">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-700">AI Credits</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {/* {String(plan.aiCreditsLimit) === 'Unlimited' ? 'Unlimited' : `${plan.aiCreditsLimit}/mo`} */}
                      {String(plan.aiCreditsLimit) === 'Unlimited' ? 'Unlimited' : `${plan.aiCreditsLimit}`}
                    </span>
                  </div>
                )}
              </div>
              {/* {plan.title !== 'Enterprise' ? ( */}
              
              {Array.isArray(plan.features) && plan.features.filter(f => f).length > 0 ? (
                <ul className="mb-6 space-y-2 text-gray-700 text-sm sm:text-base flex-grow text-left w-full">
                  {plan.features
                    .filter((feature): feature is string => typeof feature === 'string' && feature.trim() !== '')
                    .map((feature, i) => (
                      <li key={`${feature}-${i}`} className="flex items-center gap-2 justify-start">
                        <span className="inline-block w-5 h-5 text-purple-500 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        </span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-gray-500">
                  
                  <span className="text-sm font-medium text-purple-400">No features</span>
                  <span className="text-xs mt-1 text-center px-4">This plan doesn't include any features</span>
                </div>
              )}

              
              {/* Free Trial Limits - Only shown when applicable */}
              {plan.freeTrial && (plan.freeTrialUserLimit || plan.freeTrialAiCreditLimit) && (
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-2 mt-2 w-full my-2">
                  <div className="text-xs font-medium text-purple-700 mb-1 text-center">Free Trial Includes:</div>
                  <div className="flex justify-center gap-3">
                    {plan.freeTrialUserLimit && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-purple-600" />
                        <span className="text-xs text-purple-800">{plan.freeTrialUserLimit} users</span>
                      </div>
                    )}
                    {plan.freeTrialAiCreditLimit && (
                      <div className="flex items-center gap-1">
                        <Bot className="w-3 h-3 text-purple-600" />
                        <span className="text-xs text-purple-800">{plan.freeTrialAiCreditLimit} credits</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
             <button
                className={`w-full py-3 rounded-lg font-semibold text-base transition-all duration-200 mt-auto relative overflow-hidden group ${
                  plan.highlight
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-white border border-purple-600 text-purple-600 hover:bg-purple-50'
                } ${
                  plan.freeTrial ? 'shadow-md hover:shadow-lg' : ''
                }`}
                onClick={() => handlePricingModal(plan)}
              > {plan.freeTrial ? (
               
                  <span className="relative z-10 flex flex-col items-center">
                    <span className="font-bold ">Try {plan.trialDays} Days Free</span>
                    <span className="text-xs font-medium  mt-0.5">
                      {plan.cta} Now
                    </span>
                  </span>
                ) : (
                  plan.cta
                )}
                
                {/* Animated background for free trial */}
                {plan.freeTrial && (
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                )}
              </button>
            </div>
            
          ))}
        </div>
      </section>
      <FooterSection />
      {/* Modal for Business Details Form */}
      {showFormModal && selectedPlan && (
        <Modal open={showFormModal} onClose={() => setShowFormModal(false)}>
          <PricingForm 
            onClose={setShowFormModal} 
            selectedPlan={selectedPlan as any} 
            selectedTab={selectedTab} 
            currency={currency[activeTab]} 
            billingPeriod={billingPeriod[activeTab]} 
            initialLicenseCount={getLicenseCount(activeTab)}
          />
        </Modal>
      )}
    </main>
  );
} 
