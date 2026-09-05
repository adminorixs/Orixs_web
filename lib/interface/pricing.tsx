import { AxiosRequestHeaders, Method } from "axios";

export interface PricingSuccessResponse {
  status: "success";
  message: string;
  data: {
    redirectUrl: string;
    master_client_id: number;
    user_id: number;
    payment_link?: string | null;
    razorpay_id?: string | null;
  };
}
export interface PricingSuccessResponse {
  status: "success";
  message: string;
  data: {
    redirectUrl: string;
    master_client_id: number;
    user_id: number;
    payment_link?: string | null; // Optional, may not always be present
    razorpay_id?: string | null; // Optional, may not always be present
  };
}
export interface PlatformPricing {
  platform: {
    id: number;
    name: string;             // e.g., "rini-dev"
    display_name?: string;    // optional if not always present
    description: string;
  };
  plans: Plan[];
}
export type CountryCode = string;

export interface PincodeValidator {
  regex: RegExp;
  message: string;
}
export interface PartnerPlanPricing{
  amount:string;
  currency_code:string;
  currency_name: string;
  currency_symbol: string;
  discount: string;
  discount_type:string;
}

export interface MasterClientValidationErrors {
  details: Record<string, string[]>;
  company_name?: string[];
  company_email?: string[];
  website?: string[];
  business_mobile_country_code?: string[];
  business_mobile_number?: string[];
  country?: string[];
  state?: string[];
  pincode?: string[];
  timezone?: string[];
  language?: string[];
  status?: string[];
  admin_name?: string[];
  admin_email?: string[];
  admin_password?: string[];
  admin_mobile_number?: string[];
  role?: string[];
  deployment_type?: string[];
  custom_domain_name?: string[];
  cname?: string[];
  custom_saas_prefix?: string[];
  self_hosting_domain?: string[];
  start_date?: string[];
  platforms?: string[];
  ["platforms.*"]?: string[];
  licenses_limit?: string[];
}

export interface ValidationErrorResponse {
  status: "error";
  message: string;
  error: MasterClientValidationErrors;
}
export interface ValidationErrorDetails {
  [field: string]: string[];
}

export interface PricingFormValidationErrorResponse {
  message: string;
  error: {
    message: string;
    code: number;
    details: ValidationErrorDetails;
  };
}


export enum PricingActionType {
  ADD_MASTERCLIENT = "add_master_client"
}

export interface HandlePricingParams {
  method: Method;
  type: PricingActionType;
  data?: any;
  headers?: AxiosRequestHeaders | null;
  id?: string | number | null;
}
export interface HandlePartnerParams {
  method: Method;
  type: string;
  data?: any;
  headers?: AxiosRequestHeaders | null;
  id?: string | number | null;
}

export interface PricingPlan {
  discount: number;
  discountType: string;
  title: string;
  planId?: number;
  price: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  description?: string;
  currency_code:string;
  maxUserLimit?:number | null;
  recommended?:string | null;
  freeTrial: boolean;
  trialDays: number;
  aiCreditsLimit: number | null,
  freeTrialUserLimit?:number | null,
  freeTrialAiCreditLimit?:number | null,
  minLicenses?: number | null;
  maxLicenses?: number | null;
}
export interface Plan {
  id: number;
  name: string;
  display_name: string;
  description: string;
  plan_type: string;

  pricing: any;                 // detailed currency-based pricing array
  feature: any;                 // feature set array or object
  price: any;                   // fallback or summary price field (if used)
  currency: Currency;

  min_licenses: number | null;
  max_licenses: number | null;
  monthly_amounts: CurrencyAmount[];
  yearly_amounts: CurrencyAmount[];

  ai_credits_limit: number | null;
  max_user_limit: number | null;

  free_trial: number;           // 1 or 0
  free_trial_ai_credits_limit: number;           // 1 or 0
  free_trial_user_limit: number;           // 1 or 0
  number_of_days: number;       // trial duration

  mark_as_recommended: 'Yes' | 'No';
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

export type PlanWithPlatform = {
  id: number;
  name: string;
  display_name: string;
  description: string;
  plan_type: string;
  pricing: any[]; // replace with actual pricing type if needed
  feature: string[];
  platformName: string;
  platformId: number | null;
  min_licenses: number | null;
};
