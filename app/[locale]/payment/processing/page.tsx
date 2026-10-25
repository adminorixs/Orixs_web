'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

function PaymentProcessStatusPageInner() {
  const t = useTranslations('Payment');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('razorpay_payment_link_status');
    const paymentId = searchParams.get('razorpay_payment_id');

    if (!status) return;

    if (status === 'paid' && paymentId) {
      router.replace(`/payment/success/${paymentId}`);
    } else {
      router.replace(`/payment/success/${paymentId}`);
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600 text-lg">{t('processing')}</p>
    </div>
  );
}

export default function PaymentProcessStatusPage() {
  const t = useTranslations('Payment');

  return (
    <Suspense fallback={<div>{t('loading')}</div>}>
      <PaymentProcessStatusPageInner />
    </Suspense>
  );
}
