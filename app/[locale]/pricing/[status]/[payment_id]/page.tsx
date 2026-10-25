'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Page() {
  const t = useTranslations('Payment');
  const { status, payment_id } = useParams<{ status: string; payment_id: string }>();

  const isSuccess = status === 'success';

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        {isSuccess ? (
          <>
            <svg
              viewBox="0 0 24 24"
              className="text-green-600 w-16 h-16 mx-auto my-6"
              fill="currentColor"
            >
              <path d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-900">{t('doneTitle')}</h3>
            <p className="text-gray-600 mt-2">{t('doneMessage')}</p>
            <p className="text-sm mt-1 text-gray-500">{t('paymentId')} <span dir="ltr">{payment_id}</span></p>
            <div className="py-6">
              <Link href="/" className="px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 inline-block rounded">
                {t('goBack')}
              </Link>
            </div>
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              className="text-red-600 w-16 h-16 mx-auto my-6"
              fill="currentColor"
            >
              <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm5.657 16.243l-1.414 1.414L12 13.414l-4.243 4.243-1.414-1.414L10.586 12 6.343 7.757l1.414-1.414L12 10.586l4.243-4.243 1.414 1.414L13.414 12l4.243 4.243z" />
            </svg>
            <h3 className="text-2xl font-semibold text-red-600">{t('failedTitle')}</h3>
            <p className="text-gray-600 mt-2">{t('failedMessage')}</p>
            <p className="text-sm mt-1 text-gray-500">{t('paymentId')} <span dir="ltr">{payment_id}</span></p>
            <div className="py-6">
              <Link href="/" className="px-6 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 inline-block rounded">
                {t('goBack')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
