"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CountryCode, HandlePricingParams, PincodeValidator, Plan, PricingActionType, PricingFormValidationErrorResponse, PricingSuccessResponse, ValidationErrorResponse } from "@/lib/interface/pricing";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import { useMutation } from "@tanstack/react-query";
import { handlePricing } from "@/lib/api/tanstack/pricingApi";
import Modal from "../modal/modal";
import Response from "../response/Response";
import { set } from "mongoose";

type PricingPlan = {
  maxUserLimit: string;
  title: string;
  price: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  description?: string;
  planType?: string | number;
  planId?: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed' | 'none';
};

type PricingFormProps = {
  selectedPlan: PricingPlan;
  selectedTab: string | null;
  onClose: (state: boolean) => void;
  currency: 'USD' | 'EUR' | 'INR' | 'GBP' | 'ZAR';
  billingPeriod: 'monthly' | 'yearly';
  initialLicenseCount?: number;
};

const PricingForm: React.FC<PricingFormProps> = ({ selectedPlan, selectedTab, onClose, currency: initialCurrency, billingPeriod: initialBillingPeriod, initialLicenseCount }) => {
     const currencyData = {
        USD: { symbol: '$', rate: 1 },
        EUR: { symbol: '€', rate: 0.93 },
        INR: { symbol: '₹', rate: 83 },
        GBP: { symbol: '£', rate: 0.79 },
        ZAR: { symbol: 'R', rate: 18.5 },
    };

    
    const [currency] = useState<'USD' | 'EUR' | 'INR' | 'GBP' | 'ZAR'>(initialCurrency);
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(initialBillingPeriod);
    const [showPassword, setShowPassword] = useState(false);
    const [licenseCounts, setLicenseCounts] = useState<number>(initialLicenseCount ?? 20);
    const [totalPlanAmount,setTotalPlanAmount] = useState<number>(0);
    const selectedKey = selectedTab || billingPeriod;
    // licenseCounts[selectedKey]
    const todayStr = new Date().toISOString().split("T")[0];
    const [pricingFormData, setPricingFormData] = useState({
        companyEmail: "",
        countryCode: "+91",
        mobileNumber: "",
        country: "",
        password: "",
        state: "",
        pincode: "",
        timezone: "Asia/Kolkata",
        website: "",
        adminName:"",
        adminEmail:"",
        adminPassword:"",
        startDate: todayStr,
        amount: (Number(selectedPlan?.price) * licenseCounts).toString(),
        planType:selectedPlan?.planType,
        companyName:"",
        planId:selectedPlan?.planId,
        redirectUrl:`${process.env.NEXT_PUBLIC_HOST_URL}/pricing`
    });
    const {isOpen,message,showSuccess,showError,type,closePopup} = usePopupMessage();
    const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
    const [urlError, setUrlError] = useState<string | null>(null);
    const [stateError, setStateError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    // const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<any>({});
    const {mutate,isPending,isError,error,isSuccess,data,} = useMutation<PricingSuccessResponse, ValidationErrorResponse, HandlePricingParams>({
        mutationFn: handlePricing,
        onSuccess: (data) => {
            const link = data.data.payment_link;
            if (link) {
                window.location.href = link;
            } else {
                console.warn("No payment link available in response.");
            }
            setIsSubmitting(false); 
        },
        onError: (error) => {
            setIsSubmitting(false);

            const details = error?.error?.details as Record<string, string[]>;
            if (details && typeof details === 'object') {
                const apiToFormField: { [key: string]: string } = {
                    admin_password: 'adminPassword',
                    admin_email: 'adminEmail',
                    admin_name: 'adminName',
                    company_email: 'companyEmail',
                    company_name: 'companyName',
                    business_mobile_number: 'mobileNumber',
                    business_mobile_country_code: 'countryCode',
                    pincode: 'pincode',
                };

                const errors: Record<string, string> = {};

                Object.entries(details).forEach(([apiField, messages]) => {
                    const formField = apiToFormField[apiField] || apiField;
                    errors[formField] = Array.isArray(messages) ? messages.join(' ') : String(messages);
                });

                setServerErrors(errors);
            } else {
                showError(error.message);
            }
        }

    });

    const formRef = useRef<HTMLFormElement>(null);
    // const setShowFormModal = (visible: boolean) => {
    //     // hook or prop to hide modal
    //     console.log("Close modal:", visible);
    // };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Password validation
        if (value !== '' && name === 'adminPassword' && !isStrongPassword(value)) {
            setPasswordError("Password must be at least 8 characters long, contain uppercase, lowercase, numbers, and special characters.");
        } else {
            setPasswordError(null);
        }

        // License logic
        if (name === 'licenses') {
            console.log(licenseCounts, value);
            if (Number(value) <= (Number(selectedPlan?.maxUserLimit) || Infinity)) {
                handleLicenseCountChange(value);
            }
        }

        // Country must be selected before entering pincode
        if (name === 'pincode') {
            if (!pricingFormData.country) {
                setServerErrors((prev: any) => ({ ...prev, pincode: "Please, Select a country first" }));
                return;
            }

            if (value === '') {
                setServerErrors((prev: any) => ({ ...prev, pincode: "" }));
            } else {
                const { valid, message } = validatePincode(pricingFormData.country, value);
                if (!valid) {
                    setServerErrors((prev: any) => ({ ...prev, pincode: message }));
                } else {
                    setServerErrors((prev: any) => ({ ...prev, pincode: "" }));
                }
            }
        }

        // Update form data
        setPricingFormData((prev) => ({ ...prev, [name]: value }));

        // When country is selected/changed, revalidate existing pincode (if any)
        if (name === 'country' && value !== '') {
            const currentPincode = pricingFormData.pincode;
            if (currentPincode) {
                const { valid, message } = validatePincode(value, currentPincode);
                if (!valid) {
                    setServerErrors((prev: any) => ({ ...prev, pincode: message }));
                } else {
                    setServerErrors((prev: any) => ({ ...prev, pincode: "" }));
                }
            } else {
                setServerErrors((prev: any) => ({ ...prev, pincode: "" }));
            }
        }
    };

    const getLicenseCount = () => licenseCounts;
     const incrementLicenses = () => {
        if (licenseCounts >= (Number(selectedPlan?.maxUserLimit) || Infinity)) return;
        setLicenseCounts(prev => prev + 1);
    };

    const decrementLicenses = () => {
        setLicenseCounts(prev => (prev > 1 ? prev - 1 : 1));
    };

    const handleLicenseCountChange = (value: string) => {
      
        const unitPrice = Number(selectedPlan?.price) || 0;
        const totalAmount = unitPrice * licenseCounts;
        setLicenseCounts(Number(value) || 1);
        setPricingFormData((prev) => ({
            ...prev,
            amount: totalAmount.toString(),
        }));
    };


    const handleLicenseCountBlur = () => {
        // const count = Number(licenseCounts[tab] || "1");
        // if (count < 1) setLicenseCounts((prev) => ({ ...prev, [tab]: "1" }));
    };
    const preventScroll = (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur();

    // Updated: match logic from pricing page for discount handling
    function getDiscountedYearlyPriceV2(price: number, discount: number = 0, discountType: string = 'none') {
        const yearlyPrice = price * 12;
        if (discountType === 'percentage' || discountType === 'percent') {
            const totalYearlyAmount =  yearlyPrice * (1 - (discount / 100));
            return totalYearlyAmount.toFixed(2);
        } else if (discountType === 'value') {
            return yearlyPrice - discount;
        }
        return yearlyPrice.toFixed(2);
    }

 function formatPrice(
  plan: PricingPlan,
  symbol: string,
  billing: 'monthly' | 'yearly',
  licenses: number = 1
): React.ReactNode {
  const price = Number(plan.price) || 0;
  const discount = plan.discount ?? 0;
  const discountType = plan.discountType ?? 'none' as string;

  if (price === 0) {
    return (
      <span className="text-purple-400 italic font-medium">
        Custom Pricing
      </span>
    );
  }

  const baseTotal = price * licenses;
  const suffix = billing === 'yearly' ? '/year' : '/month';

  // Style tokens
  const primaryColor = "text-purple-700";
  const secondaryColor = "text-purple-500";
  const discountBg = "bg-purple-100";
  const discountText = "text-purple-800";
  const originalPriceColor = "text-purple-300";

  if (billing === 'yearly') {
    const yearlyPrice = getDiscountedYearlyPriceV2(price, discount, discountType) as number;
    const discountedTotal = yearlyPrice * licenses;
    const originalTotal = baseTotal * 12;

    const discountLabel =
      discountType == 'percent'
        ? `${discount}% OFF`
        : discountType === 'value'
        ?`${symbol}${discount * licenseCounts} Discount`
        : null;

    return (
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-baseline gap-2 flex-nowrap">
          <span className={`text-2xl font-bold ${primaryColor}`}>
            {symbol}
            {discountedTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
            {discountLabel && (
              <span className={`ml-2 text-sm ${originalPriceColor} line-through`}>
                {symbol}
                {originalTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            )}
            <span className={`ml-1 text-lg font-medium ${secondaryColor}`}>
              {suffix}
            </span>
          </span>

        </div>
        
          {discountLabel && (
            <span className={` flex ms-auto text-xs ${discountBg} ${discountText} font-semibold px-2 py-1 rounded-full`}>
              {discountLabel}
            </span>
          )}
      </div>
    );
  }

  // Monthly price display
  return (
    <div className="flex items-baseline gap-1">
      <span className={`text-2xl font-bold ${primaryColor}`}>
        {symbol}
        {baseTotal.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </span>
      <span className={`text-lg font-medium ${secondaryColor}`}>
        {suffix}
      </span>
    </div>
  );
}

    // function formatPerLicenseText(plan: PricingPlan, symbol: string, billing: 'monthly' | 'yearly') {
    //     const price = Number(plan.price) || 0;
    //     const discount = plan.discount ?? 0;
    //     const discountType = plan.discountType ?? 'none';
    //     if (billing === 'yearly') {
    //         const discounted = getDiscountedYearlyPriceV2(price, discount, discountType);
    //         let discountLabel = '';
    //         if (discount && discount > 0) {
    //             if (discountType === 'percentage') {
    //                 discountLabel = ` (${discount}% off)`;
    //             } else if (discountType === 'fixed') {
    //                 discountLabel = ` (-${symbol}${discount} off)`;
    //             }
    //         }
    //         return `${symbol}${discounted} per license/year${discountLabel}`;
    //     }
    //     return `${symbol}${price.toFixed(2)} per license/month`;
    // }
    // function formatPrice(basePrice: number, rate: number, symbol: string, licenses: number = 1) {
    //     if (basePrice === 0) return 'Custom';
    //     let total = basePrice * licenseCounts;
    //     let suffix = '/mo';
    //     if (billingPeriod === 'yearly') {
    //     total = total * 12;
    //     suffix = '/yr';
    //     }else{
    //     return `${symbol}${total}${suffix}`;
    //     }
    //     // return `${symbol}${total}${suffix}`;
    // }
    function isStrongPassword(password: string): boolean {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
        return regex.test(password);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setServerErrors({}); // Clear previous server errors
        setPhoneNumberError(''); // Clear previous server errors
        setUrlError(''); // Clear previous server errors
        setStateError(''); // Clear previous server errors
        if(passwordError){
            setIsSubmitting(false);
            return;
        }    
        let valid = true;
        const {valid:isValidPincode,message} = validatePincode(pricingFormData.country, pricingFormData.pincode);
        if(!isValidPincode){
            setServerErrors((prev:any) => ({ ...prev, pincode:message}));
            setIsSubmitting(false);
            return;
        } 

        // Mobile number validation by country code
        function validateMobileNumber(code: string, phone: string) {
            if (!phone) return { valid: false, message: 'Mobile number is required.' };

            const rules: Record<string, { regex: RegExp; message: string }> = {
                    '+91': {
                    regex: /^[6-9]\d{9}$/,
                    message: 'Enter a valid 10-digit Indian mobile number (starts with 6-9).',
                    },
                    '+1': {
                    regex: /^\d{10}$/,
                    message: 'Enter a valid 10-digit US mobile number.',
                    },
                    '+44': {
                    // UK mobile numbers start with 7 and have 10 digits (without country code)
                    regex: /^7\d{9}$/,
                    message: 'Enter a valid 10-digit UK mobile number (starting with 7).',
                    },
                    '+27': {
                    // South African mobile numbers start with 6, 7 or 8, and are 9 digits
                    regex: /^[6-8]\d{8}$/,
                    message: 'Enter a valid 9-digit South African mobile number (starting with 6-8).',
                    },
                };

                const rule = rules[code];

                if (!rule) {
                    return { valid: false, message: 'Please select a valid supported country code.' };
                }

                if (!rule.regex.test(phone)) {
                    return { valid: false, message: rule.message };
                }

                return { valid: true };
        }


        const mobileValidation = validateMobileNumber(pricingFormData.countryCode, pricingFormData.mobileNumber);
        if (!mobileValidation.valid) {
            const message = mobileValidation.message as string;
            setPhoneNumberError(message);
        //   showError(mobileValidation.message || 'Invalid mobile number.');
          setIsSubmitting(false);
          return;
        }

                
        // Inline State Validation (no numbers or special characters allowed)
        if (!/^[A-Za-z\s\-]{2,}$/.test(pricingFormData.state.trim())) {
            setStateError("Please enter a valid state name (no numbers or special characters).");
            valid = false;
            setIsSubmitting(false)
        } else {
            setStateError(null);
        }

        // Inline Website URL validation
        try {
            new URL(pricingFormData.website);
            setUrlError(null);
        } catch {
            setUrlError("Please enter a valid website URL");
            setIsSubmitting(false)
            valid = false;
        }

        if (!valid) return;

        // console.log(discountType);
        // const {} = 
        const payload = {
        plan_id:pricingFormData.planId,
        company_name: pricingFormData.companyName, // <-- Add this to your form if needed
        website: pricingFormData.website,
        company_email: pricingFormData.companyEmail,
        country: pricingFormData.country, // if this is ID, ensure it's number
        state: pricingFormData.state,
        pincode: pricingFormData.pincode,
        timezone: pricingFormData.timezone,
        language: "en", // can be fixed or based on a dropdown
        business_mobile_country_code: pricingFormData.countryCode,
        business_mobile_number: pricingFormData.mobileNumber,
        status: "active",
     
        deployment_type: "saas",
        custom_domain_name: "", // optional/custom field
        custom_saas_prefix: "", // optional/custom field
        self_hosting_domain: "", // optional/custom field
        cname: "", // optional/custom field
        currency:currency,
        licenses_limit: licenseCounts,
        start_date: pricingFormData.startDate,
        allow_free_trial: 1,
        admin_name: pricingFormData.adminName,
        admin_email: pricingFormData.adminEmail,
        admin_password: pricingFormData.adminPassword,
        admin_mobile_number: pricingFormData.mobileNumber,
        admin_mobile_country_code: pricingFormData.countryCode,
        role: "admin", // or make dynamic
        type: billingPeriod,
        redirectUrl:`${process.env.NEXT_PUBLIC_HOST_URL}/pricing`,
        price: totalPlanAmount,
    
        };
       
        mutate(
            { method: "post", type: PricingActionType.ADD_MASTERCLIENT, data: payload },
        );
    };

    useEffect(()=>{
        handleLicenseCountChange(licenseCounts.toString());
    },[licenseCounts])

    useEffect(()=>{
        if(billingPeriod == 'yearly' && selectedPlan){
            const {price,discount,discountType} = selectedPlan;
            const yearlyPrice = getDiscountedYearlyPriceV2(Number(price),discount,discountType) as number;
            setTotalPlanAmount(yearlyPrice * licenseCounts)
        } else if(billingPeriod == 'monthly' && selectedPlan){
            const {price} = selectedPlan;
            setTotalPlanAmount(Number(price) * licenseCounts);
        }
    },[billingPeriod,selectedPlan,licenseCounts]);
    
    const timezoneMappings = {
        'Asia/Kolkata': 'India Standard Time',
        'America/New_York': 'Eastern Standard Time',
        'Europe/London': 'GMT Standard Time',
        'Africa/Johannesburg': 'South Africa Standard Time',
    };
    const pincodeValidators:Record<CountryCode,PincodeValidator> = {
        IN: {
            regex: /^[1-9][0-9]{5}$/, // 6 digits, first digit not 0
            message: "Pincode must be a 6-digit number starting from 1-9 in India.",
        },
        US: {
            regex: /^\d{5}(-\d{4})?$/, // 5 digits or ZIP+4 (12345 or 12345-6789)
            message: "ZIP code must be 5 digits or in ZIP+4 format (e.g., 12345 or 12345-6789).",
        },
        GB: {
            regex: /^([A-Z]{1,2}\d[A-Z\d]? ?\d[ABD-HJLNP-UW-Z]{2})$/i, // UK postcode format
            message: "Please enter a valid UK postcode (e.g., SW1A 1AA).",
        },
        ZA: {
            regex: /^\d{4}$/, // 4-digit code
            message: "Postal code must be a 4-digit number in South Africa.",
        },
    };
    function validatePincode(countryCode:string, pincode:string) {
        const validator = pincodeValidators[countryCode];
        if (!validator) return { valid: false, message: "Unsupported country." };

        const isValid = validator.regex.test(pincode.trim());
        return {
            valid: isValid,
            message: isValid ? "Valid pincode." : validator.message,
        };
    }


    return(
        <>
                <form
                    onSubmit={handleSubmit} 
                    ref={formRef}
                    className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl mx-auto relative md:block md:overflow-visible md:max-h-none overflow-y-auto max-h-[90vh] md:!overflow-visible md:!max-h-none"
                >
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Pricing Plan</h2>
                    
                    {/* Selected Plan Summary */}
                    <div className="bg-purple-50 rounded-lg p-3 sm:p-4 mb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                        <h3 className="text-base sm:text-lg font-semibold text-purple-700">{selectedPlan?.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-2 mt-1">
                            <div className="relative flex items-center">
                                <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min="20"
                                max="50"
                                name="licenses"
                                value={licenseCounts}
                                onChange={(e) => handleInputChange(e)}
                                onBlur={handleLicenseCountBlur}
                                onWheel={preventScroll}
                                className="w-20 px-2 py-1 border-2 border-purple-300 rounded-lg text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-center pr-8"
                                />
                                <div className="absolute right-1.5 inset-y-1.5 flex flex-col justify-between">
                                <button
                                    type="button"
                                    onClick={incrementLicenses}
                                    className="h-[12px] w-[12px] rounded flex items-center justify-center hover:bg-purple-100 transition-colors group"
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
                                    onClick={decrementLicenses}
                                    className="h-[12px] w-[12px] rounded flex items-center justify-center hover:bg-purple-100 transition-colors group"
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
                            <span className="text-sm text-gray-600">license{getLicenseCount() > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                            <div className="text-sm text-gray-600 mt-2">
                                Max License :{selectedPlan?.maxUserLimit}
                            </div>
                        </div>
                        <div className="text-right">
                        <div className="text-xl sm:text-2xl font-bold text-purple-700">
                            {formatPrice(selectedPlan, currencyData[currency].symbol, billingPeriod, licenseCounts)}
                        </div>
                        {/* <div className="text-xs sm:text-sm text-gray-600">
                            {formatPerLicenseText(selectedPlan, currencyData[currency].symbol, billingPeriod)}
                        </div> */}
                        </div>
                    </div>
                    </div>
                    <div className="flex justify-between items-center">

                            {/* Billing dropdown with heading below pricing summary */}
                            <div className="">
                            <label className="block text-sm font-medium mb-1">Billing</label>
                            <select
                                value={billingPeriod}
                                onChange={e => setBillingPeriod(e.target.value as 'monthly' | 'yearly')}
                                className="border border-purple-300 rounded px-3 py-2 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm cursor-pointer hover:border-purple-500 h-10 w-full max-w-xs"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Start Date</label>
                                <div className="flex">
                                <input
                                    type="date"
                                    name="startDate"
                                    onChange={handleInputChange}
                                    value={pricingFormData.startDate}
                                    placeholder="Start Date"
                                    className="border border-purple-300 rounded flex-1 border-t border-b border-r rounded-r px-3 py-2"
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                />
                                </div>
                            </div>
                            {/* <div>
                                <label className="block font-medium mb-1">Amount</label>
                                <div className="flex">
                                    <input className="border border-purple-300 rounded flex-1 border-t border-b border-r rounded-r px-3 py-2" name='amount' onChange={handleInputChange} value={pricingFormData.amount}   placeholder="Amount" readOnly />
                                </div>
                            </div>  */}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-3 text-gray-700">Details</h3>
                    <div className="mb-4">
                        <label htmlFor="companyName" className="block font-medium mb-1">Company Name<span className="text-red-500">*</span></label>
                        <input id="companyName" type='text' onChange={handleInputChange} name='companyName' value={pricingFormData.companyName} className="w-full border rounded px-3 py-2" placeholder="Company Name" required />
                        {serverErrors.companyName && <div className="text-red-500 text-xs mt-1">{serverErrors.companyName}</div>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="companyEmail" className="block font-medium mb-1">Company Email<span className="text-red-500">*</span></label>
                        <input id="companyEmail" type='email' onChange={handleInputChange} name='companyEmail' value={pricingFormData.companyEmail} className="w-full border rounded px-3 py-2" placeholder="Company Email" required />
                        {serverErrors.companyEmail && <div className="text-red-500 text-xs mt-1">{serverErrors.companyEmail}</div>}
                    </div>
                    <div>
                        <label htmlFor="mobileNumber" className="block font-medium mb-1">Mobile Number<span className="text-red-500">*</span></label>
                        <div className="flex">
                            <select
                                className="border rounded-l px-2 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                name='countryCode'
                                id="countryCode"
                                value={pricingFormData.countryCode}
                                onChange={handleInputChange}
                                style={{ minWidth: 90 }}
                            >
                                <option value="+91">India (+91)</option>
                                <option value="+1">USA (+1)</option>
                                <option value="+27">Africa (+27)</option>
                                <option value="+44">Europe (+44)</option>
                            </select>
                            <input id="mobileNumber" className="flex-1 border-t border-b border-r rounded-r px-3 py-2" name='mobileNumber' onChange={handleInputChange} value={pricingFormData.mobileNumber}   placeholder="Mobile Number" required />
                        </div>
                        {phoneNumberError && <div className="text-red-500 text-xs mt-1">{phoneNumberError}</div>}
                        {serverErrors.business_mobile_number && <div className="text-red-500 text-xs mt-1">{serverErrors.business_mobile_number}</div>}
                    </div>
                    <div>
                        <label htmlFor="country" className="block font-medium mb-1">Country <span className="text-red-500">*</span></label>
                        <select id="country" className="w-full border rounded px-3 py-2" onChange={handleInputChange} value={pricingFormData.country} name='country' required>
                            <option value="">--</option>
                            <option value="IN">India</option>
                            <option value="US">USA</option>
                            <option value="GB">UK</option>
                            <option value="ZA">South Africa</option>
                        </select>
                        {serverErrors.country && <div className="text-red-500 text-xs mt-1">{serverErrors.country}</div>}
                    </div>
                    {/* <div>
                        <label className="block font-medium mb-1">Create Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full border rounded px-3 py-2 pr-10" name='password'
                            placeholder="Create Password" onChange={handleInputChange} value={pricingFormData.password}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                            tabIndex={-1}
                            onClick={() => setShowPassword((v) => !v)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        </div>
                    </div> */}
                    
                    
                    <div>
                        <label htmlFor="state" className="block font-medium mb-1">State <span className="text-red-500">*</span></label>
                        <input id="state" className="w-full border rounded px-3 py-2" name='state' placeholder="State" onChange={handleInputChange} value={pricingFormData.state} required />
                        {serverErrors.state && <div className="text-red-500 text-xs mt-1">{serverErrors.state}</div>}
                        {stateError && <div className="text-red-500 text-xs mt-1">{stateError}</div>}
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="pincode" className="block font-medium mb-1">Pincode <span className="text-red-500">*</span></label>
                        <input id="pincode" className="w-full border rounded px-3 py-2" name='pincode' onChange={handleInputChange} value={pricingFormData.pincode} placeholder="Pincode" required />
                        {serverErrors.pincode && <div className={`text-red-500 text-xs  max-w-full absolute ${pricingFormData.country == 'US' ? '-bottom-8' : '-bottom-5'}`}>{serverErrors.pincode}</div>}
                        
                        {/* {serverErrors?.adminPassword && <div className="">{serverErrors?.adminPassword}</div>} */}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="timezone" className="block font-medium mb-1">Timezone <span className="text-red-500">*</span></label>
                       <select
                        id="timezone"
                        name="timezone"
                        className="w-full border rounded px-3 py-2"
                        onChange={handleInputChange}
                        value={pricingFormData.timezone}
                        required
                        >
                        {Object.entries(timezoneMappings).map(([key, label]) => (
                            <option key={key} value={key}>
                            {label}
                            </option>
                        ))}
                        </select>
                        {serverErrors.timezone && <div className="text-red-500 text-xs mt-1">{serverErrors.timezone}</div>}
                    </div>
                    <div>
                        <label htmlFor="website" className="block text-sm font-medium mb-1" >Website<span className="text-red-500">*</span></label>
                        <input
                        id="website"
                        className="w-full border rounded px-3 py-2 text-sm placeholder:opacity-60 placeholder:text-gray-400"
                        placeholder="e.g. https://www.example.com"
                        type="url"
                        name="website"
                        onChange={handleInputChange} value={pricingFormData.website}
                        autoComplete="url"
                        required
                        />
                        {serverErrors.website && <div className="text-red-500 text-xs mt-1">{serverErrors.website}</div>}
                        {urlError && <div className="text-red-500 text-xs mt-1">{urlError}</div>}
                    </div>
                    </div>
                    {/* Business Admin Details */}
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-700 mt-4">Business Administrator Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="adminName" className="block font-medium mb-1">Name <span className="text-red-500">*</span></label>
                        <input
                        id="adminName"
                        type="text"
                        name="adminName"
                        placeholder="Enter admin name"
                        value={pricingFormData.adminName}
                        onChange={handleInputChange}
                        required
                        className="w-full border rounded px-3 py-2"
                        />
                        {serverErrors.admin_name && <div className="text-red-500 text-xs mt-1">{serverErrors.admin_name}</div>}
                    </div>
                    <div>
                        <label htmlFor="adminEmail" className="block font-medium mb-1">Email <span className="text-red-500">*</span></label>
                        <input
                        id="adminEmail"
                        type="email"
                        name="adminEmail"
                        placeholder="Enter admin email"
                        value={pricingFormData.adminEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full border rounded px-3 py-2"
                        />
                        {serverErrors?.adminEmail && <div className="text-red-500 text-xs mt-1">{serverErrors?.adminEmail}</div>}
                    </div>

                    <div className="relative">
                        <label className="block font-medium mb-1">Admin Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="adminPassword"
                                placeholder="Create a secure password"
                                value={pricingFormData.adminPassword}
                                onChange={handleInputChange}
                                required
                                className="w-full border rounded px-3 py-2 pr-10"
                            />

                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                tabIndex={-1}
                                onClick={() => setShowPassword((v) => !v)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        
                        {serverErrors?.adminPassword && <div className="text-red-500 text-xs mt-1 max-w-full absolute -bottom-9">{serverErrors?.adminPassword}</div>}
                        {!serverErrors?.adminPassword && passwordError && <div className="text-red-500 text-xs mt-1 max-w-full absolute -bottom-9">{passwordError}</div>}
                    </div>
                </div>

                    <div className="flex items-center mt-10 mb-4">
                        <input type="checkbox" id="terms" required className="mr-2" />
                        <label htmlFor="terms" className="text-sm text-gray-700 select-none">
                        <span className="text-red-500 mr-1">*</span>
                        I agree to the <a href="/terms-and-conditions" target="_blank" className="text-purple-600 underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-purple-600 underline">Privacy Policy</a>
                        </label>
                    </div>

                    <div className="flex gap-4 mt-8 justify-end">
                       <button type="submit" className={`px-5 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold transition flex items-center justify-center ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Submitting...
                                </span>
                            ) : (
                                'Submit'
                            )}
                        </button>
                        <button type="button" className="border border-gray-400 rounded-lg px-6 py-2 text-black" onClick={() => onClose(false)}>Cancel</button>
                    </div>

                    <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold" onClick={() => onClose(false)}>&times;</button>
                </form>
            <Modal open={isOpen} onClose={closePopup}>
                <Response message={message} type={type ?? "error"} onClose={closePopup} />
            </Modal>
        </>
    )
}

export default PricingForm;