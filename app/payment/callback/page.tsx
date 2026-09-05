'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function PaymentProcessStatusPageInner() {
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
      <p className="text-gray-600 text-lg">Processing your payment...</p>
    </div>
  );
}

export default function PaymentProcessStatusPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentProcessStatusPageInner />
    </Suspense>
  );
}
