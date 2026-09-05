'use client';

import React, { ComponentType, useState } from 'react';
import { FormSuccessPopup } from './FormSuccessPopup';

interface WithFormSuccessProps {
  onSuccess?: () => void;
  successMessage?: string;
}

// Higher Order Component that adds success popup to any form component
export function withFormSuccess<P extends object>(
  WrappedComponent: ComponentType<P>,
  defaultSuccessMessage = 'Form submitted successfully!'
) {
  return function WithFormSuccess({
    onSuccess,
    successMessage = defaultSuccessMessage,
    ...props
  }: P & WithFormSuccessProps) {
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFormSuccess = () => {
      setShowSuccess(true);
    };

    const handleSuccessClose = () => {
      setShowSuccess(false);
      if (onSuccess) {
        onSuccess();
      }
    };

    return (
      <div className="relative">
        <FormSuccessPopup 
          show={showSuccess} 
          onClose={handleSuccessClose} 
          message={successMessage}
        />
        <WrappedComponent 
          {...(props as P)} 
          onFormSuccess={handleFormSuccess} 
        />
      </div>
    );
  };
} 