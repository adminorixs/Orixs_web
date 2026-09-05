import axiosInstance from "@/lib/config/axiosInstance";
import {
  HandlePartnerParams,
  PricingSuccessResponse,
  ValidationErrorResponse,
} from "@/lib/interface/pricing";

/**
 * Strongly typed handler for pricing-related API calls.
 */
export const handlePartner = async ({
  method,
  type,
  data = null,
  id = null,
}: HandlePartnerParams): Promise<PricingSuccessResponse> => {
  try {
   
    const baseEndpoint = "/partner";
    const endpoints: Record<string, string> = {
      "add": "",
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
        
        })
      : await axiosInstance.request<PricingSuccessResponse>({
          method,
          url: endpoint,
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
      // Optionally throw full error response if needed for form validations
      throw axiosError.response.data;
    }

    throw axiosError.response?.data || axiosError || "Unexpected error";
  }
};
