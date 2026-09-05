import axiosInstance from "@/lib/config/axiosInstance";
import {
  HandlePricingParams,
  PricingActionType,
  PricingSuccessResponse,
  ValidationErrorResponse,
} from "@/lib/interface/pricing";
import axios, { AxiosRequestHeaders } from "axios";

/**
 * Strongly typed handler for pricing-related API calls.
 */
export const handlePricing = async ({
  method,
  type,
  data = null,
  headers = {} as AxiosRequestHeaders | null,
  id = null,
}: HandlePricingParams): Promise<PricingSuccessResponse> => {
  try {
    const config = { headers };

    const baseEndpoint = "/master-clients";
    const endpoints: Record<PricingActionType, string> = {
      [PricingActionType.ADD_MASTERCLIENT]: "",
    };

    const path = endpoints[type];
    if (path === undefined) {
      throw new Error(`Endpoint not defined for action type: ${type}`);
    }

    const endpoint = `${baseEndpoint}${path}`;

    const response = data
      ? await axiosInstance.request<PricingSuccessResponse>({
          method,
          url: endpoint,
          ...(data && { data }),
          ...(headers ? { headers } : {}),
          ...config,
        })
      : await axiosInstance.request<PricingSuccessResponse>({
          method,
          url: endpoint,
          ...(headers ? { headers } : {}),
          ...(config && { config }),
        });

    return response.data;
  } catch (err: unknown) {
    const axiosError = err as {
      response?: {
        data?: ValidationErrorResponse;
      };
      message: string;
    };
    
    if (axiosError.response?.data?.error) {
      console.log(axiosError.response.data.error);
      // Optionally throw full error response if needed for form validations
      throw axiosError.response.data;
    }
    console.error("Pricing API error:");
    throw axiosError.response?.data?.message || axiosError.message || "Unexpected error";
  }
};
