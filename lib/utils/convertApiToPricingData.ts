
import { PlatformPricing, PricingPlan, Plan } from '../interface/pricing';
import { formatPlatformName } from './formatPlatformName';

/**
 * Convert raw API response into the shape the Pricing page expects.
 *
 * New fields added:
 *  • aiCreditsLimit   – per‑plan AI credit cap
 *  • maxUserLimit     – maximum users allowed
 *  • freeTrial        – boolean flag
 *  • trialDays        – number of trial days
 *  • minLicenses / maxLicenses – licence boundaries (nullable → undefined)
 */
export function convertApiToPricingData(
  data: PlatformPricing[],
  currency: string = 'INR'
): Record<string, PricingPlan[]> {
  const result: Record<string, PricingPlan[]> = {};

  data.forEach((platformData) => {
    const tabKey = formatPlatformName(platformData.platform.name);

    result[tabKey] = platformData.plans.map((plan: Plan, index: number) => {
      // price block for the requested currency
      const currencyData = plan.pricing?.find(
        (p: PricingPlan) => p.currency_code === currency
      );

      /* ---------- core values ---------- */
      const price        = currencyData?.amount || '0';
      const discount     = currencyData?.discount || 0;
      const discountType = currencyData?.discount_type || 'none';

      /* ---------- NEW values ---------- */
      const aiCreditsLimit = plan.ai_credits_limit ?? null;
      const maxUserLimit   = plan.max_user_limit ?? null;
      const freeTrial      = Boolean(plan.free_trial);   // 0 / 1 → false / true
      const trialDays      = plan.number_of_days ?? 0;
      const minLicenses    = plan.min_licenses ?? undefined;
      const maxLicenses    = plan.max_licenses ?? undefined;
      const recommended    = plan.mark_as_recommended ?? "No";
      const freeTrialUserLimit    = plan.free_trial_user_limit ?? 0;
      const freeTrialAiCreditLimit    = plan.free_trial_ai_credits_limit ?? 0
      ;

      return {
        /* existing fields */
        title: plan.name,
        description: plan.description,
        price,
        planType: plan.plan_type,
        planId: plan.id,
        features: plan.feature,
        cta:'Get Started',
        highlight: index === 1,
        discount,
        discountType,
        currency_code: currencyData?.currency_code || currency, // Add currency_code
        freeTrialUserLimit,
        freeTrialAiCreditLimit,
        /* new fields surfaced to UI */
        aiCreditsLimit,
        maxUserLimit,
        freeTrial,
        trialDays,
        minLicenses,
        maxLicenses,
        recommended,
      } as PricingPlan;
    });
  });

  return result;
}
