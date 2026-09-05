import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Building2, CheckCircle2, Handshake, Mail, MapPin, Phone, User, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Modal from './modal';
import { usePlan, PricingResponse } from '@/hooks/api/usePlan';
import { handlePartner } from '@/lib/api/tanstack/partnerApi';

interface PartnerModalProps {
  open: boolean;
  onClose: () => void;
}

type PartnerType = 'referrer' | 'distributor';

type FieldErrors = Partial<Record<
  | 'name'
  | 'email'
  | 'type'
  | 'company_name'
  | 'company_email'
  | 'company_phone'
  | 'company_address'
  | 'agreed',
  string
>>;

const initialFormState = {
  name: '',
  email: '',
  type: 'referrer' as PartnerType,
  companyName: '',
  companyEmail: '',
  companyPhone: '',
  companyPhoneCode: '+91',
  companyAddress: '',
};

const phoneOptions = [
  { value: '+91', label: 'India (+91)' },
  { value: '+1', label: 'USA (+1)' },
  { value: '+27', label: 'Africa (+27)' },
  { value: '+44', label: 'Europe (+44)' },
];

const partnerTypes: { value: PartnerType; label: string }[] = [
  { value: 'referrer', label: 'Referrer' },
  { value: 'distributor', label: 'Distributor' },
];

const enabledPlatformKeywords = ['business', 'construction', 'insurance'];

const isPlatformEnabled = (label: string) =>
  enabledPlatformKeywords.some((keyword) => label.toLowerCase().includes(keyword));

const PartnerModal: React.FC<PartnerModalProps> = ({ open, onClose }) => {
  const [form, setForm] = useState(initialFormState);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const { data } = usePlan();

  const platformOptions = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const seen = new Set<string>();
    return (data as PricingResponse[]).reduce<{ value: string; label: string }[]>((options, item) => {
      const id = item.platform?.id;
      const label = item.platform?.display_name || item.platform?.name;

      if (!id || !label || seen.has(String(id))) return options;

      seen.add(String(id));
      options.push({
        value: String(id),
        label: String(label).replace(/_/g, ' '),
      });

      return options;
    }, []);
  }, [data]);

  const visiblePlatformOptions = useMemo(
    () => platformOptions.filter((platform) => isPlatformEnabled(platform.label)),
    [platformOptions]
  );

  const { mutate, isPending } = useMutation({
    mutationFn: handlePartner,
    onSuccess: (data) => {
      setSuccessMessage(
        data?.message ||
        'Your partner application has been submitted. Our team will review it and contact you soon.'
      );
    },
    onError: (error: any) => {
      const details = error?.error?.details;

      if (details && typeof details === 'object') {
        const nextErrors: FieldErrors = {};

        Object.keys(details).forEach((field) => {
          const fieldErrors = details[field];

          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            nextErrors[field as keyof FieldErrors] = fieldErrors[0];
          }
        });

        setErrors(nextErrors);
        return;
      }

      setErrors({
        email: error?.message || 'Unable to submit the application. Please try again.',
      });
    },
  });

  const resetForm = useCallback(() => {
    setForm(initialFormState);
    setSelectedPlatforms([]);
    setAgreed(false);
    setErrors({});
    setSuccessMessage('');
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const validatePhone = (code: string, phone: string) => {
    if (!phone) return false;
    if (code === '+91') return /^([6-9][0-9]{9})$/.test(phone);
    if (code === '+1') return /^\d{10}$/.test(phone);
    if (code === '+44') return /^\d{10,11}$/.test(phone);
    if (code === '+27') return /^\d{9}$/.test(phone);

    return /^\d{6,}$/.test(phone);
  };

  const validate = () => {
    const nextErrors: FieldErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Name is required';
    else if (form.name.length > 50) nextErrors.name = 'Name cannot exceed 50 characters';

    if (!form.email.trim()) nextErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address';
    else if (form.email.length > 100) nextErrors.email = 'Email cannot exceed 100 characters';

    if (!form.type) nextErrors.type = 'Partner type is required';

    if (form.companyEmail && !/^\S+@\S+\.\S+$/.test(form.companyEmail)) {
      nextErrors.company_email = 'Enter a valid company email';
    }

    if (!validatePhone(form.companyPhoneCode, form.companyPhone)) {
      nextErrors.company_phone = 'Enter a valid mobile number';
    }

    if (!agreed) nextErrors.agreed = 'You must agree before submitting';

    return nextErrors;
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const errorKeyMap: Record<string, keyof FieldErrors> = {
      companyName: 'company_name',
      companyEmail: 'company_email',
      companyPhone: 'company_phone',
      companyAddress: 'company_address',
    };
    const errorKey = errorKeyMap[name] || (name as keyof FieldErrors);

    setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((current) =>
      current.includes(platformId)
        ? current.filter((id) => id !== platformId)
        : [...current, platformId]
    );
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    mutate({
      method: 'post',
      type: 'add',
      data: {
        application_only: true,
        name: form.name.trim(),
        email: form.email.trim(),
        type: form.type,
        channel_partner_type: form.type,
        role: 'reseller',
        company_name: form.companyName.trim(),
        company_email: form.companyEmail.trim(),
        company_phone_code: form.companyPhoneCode,
        company_phone: form.companyPhone.trim(),
        mobile: form.companyPhone.trim(),
        company_address: form.companyAddress.trim(),
        platform: selectedPlatforms.map((platform) => ({ platform })),
      },
    });
  };

  const inputClass =
    'w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100';
  const labelClass = 'mb-1.5 block text-sm font-medium text-gray-800';

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="relative w-full max-w-2xl rounded-lg border border-gray-200 bg-white shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-purple-700 focus:outline-none"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {successMessage ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-10 text-center">
            <CheckCircle2 className="mb-5 h-16 w-16 text-purple-600" />
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Application Submitted</h2>
            <p className="max-w-md text-sm leading-6 text-gray-600">{successMessage}</p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-8 rounded-md bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-6 sm:px-7 sm:py-7">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-purple-50 text-purple-700">
                <Handshake className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-purple-700 sm:text-3xl">Become a Partner</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="partner-name">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="partner-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                    placeholder="e.g. John Doe"
                    maxLength={50}
                  />
                </div>
                {errors.name && <div className="mt-1 text-xs text-red-500">{errors.name}</div>}
              </div>

              <div>
                <label className={labelClass} htmlFor="partner-email">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="partner-email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className={`${inputClass} pl-9`}
                    placeholder="e.g. john@example.com"
                    maxLength={100}
                  />
                </div>
                {errors.email && <div className="mt-1 text-xs text-red-500">{errors.email}</div>}
              </div>

              <div>
                <label className={labelClass} htmlFor="partner-type">
                  Partner Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Handshake className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select
                    id="partner-type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                  >
                    {partnerTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.type && <div className="mt-1 text-xs text-red-500">{errors.type}</div>}
              </div>

              <div>
                <label className={labelClass} htmlFor="partner-phone">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex w-full">
                  <select
                    aria-label="Country code"
                    name="companyPhoneCode"
                    value={form.companyPhoneCode}
                    onChange={handleChange}
                    className="w-[118px] rounded-l-md border border-r-0 border-gray-200 bg-gray-50 px-2 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  >
                    {phoneOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="relative min-w-0 flex-1">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="partner-phone"
                      name="companyPhone"
                      value={form.companyPhone}
                      onChange={handleChange}
                      className={`${inputClass} rounded-l-none pl-9`}
                      placeholder="Mobile Number"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onInput={(event) => {
                        const input = event.currentTarget;
                        input.value = input.value.replace(/[^0-9]/g, '');
                      }}
                    />
                  </div>
                </div>
                {errors.company_phone && (
                  <div className="mt-1 text-xs text-red-500">{errors.company_phone}</div>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="partner-company-name">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="partner-company-name"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="partner-company-email">
                  Company Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="partner-company-email"
                    name="companyEmail"
                    value={form.companyEmail}
                    onChange={handleChange}
                    type="email"
                    className={`${inputClass} pl-9`}
                    placeholder="Company Email"
                  />
                </div>
                {errors.company_email && (
                  <div className="mt-1 text-xs text-red-500">{errors.company_email}</div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass} htmlFor="partner-company-address">
                  Company Address
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <textarea
                    id="partner-company-address"
                    name="companyAddress"
                    value={form.companyAddress}
                    onChange={handleChange}
                    className={`${inputClass} min-h-[86px] resize-none pl-9`}
                    placeholder="Company Address"
                  />
                </div>
              </div>
            </div>

            {visiblePlatformOptions.length > 0 && (
              <div className="mt-6">
                <label className={labelClass}>Interested Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {visiblePlatformOptions.map((platform) => {
                    const selected = selectedPlatforms.includes(platform.value);

                    return (
                      <button
                        key={platform.value}
                        type="button"
                        onClick={() => togglePlatform(platform.value)}
                        className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                          selected
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:text-purple-700'
                        }`}
                      >
                        {platform.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="flex items-start gap-2 text-sm text-gray-700" htmlFor="partner-agreed">
                <input
                  type="checkbox"
                  id="partner-agreed"
                  checked={agreed}
                  onChange={(event) => {
                    setAgreed(event.target.checked);
                    setErrors((prev) => ({ ...prev, agreed: undefined }));
                  }}
                  className="mt-1"
                />
                <span>
                  <span className="text-red-500">*</span> I agree to the{' '}
                  <a href="/privacy" target="_blank" className="text-purple-600 underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/terms-and-conditions" target="_blank" className="text-purple-600 underline">
                    Terms &amp; Conditions
                  </a>
                  .
                </span>
              </label>
              {errors.agreed && <div className="mt-1 text-xs text-red-500">{errors.agreed}</div>}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isPending}
              >
                {isPending ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default PartnerModal;
