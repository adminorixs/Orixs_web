import axiosInstance from "@/lib/config/axiosInstance";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

// --- Interfaces ---
export interface PricingResponse {
  platform: {
    display_name: any;
    id: number;
    name: string;
    description: string;
    plans: Plan[];
  };
}

export interface Plan {
  feature: never[];
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

// --- Types ---
type PricingEndpoint = "allPlan" | "plan";

type FetchPricingParams = {
  endpoint?: PricingEndpoint;
  id?: number | string | null;
};

// --- API Fetcher ---
export const fetchPricing = async ({
  endpoint = "allPlan",
  id = null,
}: FetchPricingParams): Promise<PricingResponse[] | Plan> => {
  const routes: Record<PricingEndpoint, string> = {
      allPlan: "/plans-by-platform",
      plan: ""
  };

  const url = routes[endpoint];
  if (!url) throw new Error("Invalid endpoint");

  const response = await axiosInstance.get(url);
  return response.data;
};
export function usePlan(
  endpoint: PricingEndpoint = "allPlan",
  id: number | string | null = null,
  options?: UseQueryOptions<PricingResponse[] | Plan, AxiosError>
) {
  return useQuery<PricingResponse[] | Plan, AxiosError>({
queryKey: ["plan", endpoint, id],
    queryFn: () => fetchPricing({ endpoint, id }),
    enabled: !!endpoint && (endpoint !== "plan" || !!id),
    retry: false,
    ...options,
  });
}