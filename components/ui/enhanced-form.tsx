'use client';

import Form from 'next/form';
import { useRouter } from 'next/navigation';
import React from 'react';
import { cn } from 'src/utils/tailwind-helpers';

interface EnhancedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  action: string;
  method?: 'get' | 'post'; 
  children: React.ReactNode;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  resetOnSuccess?: boolean;
}

/**
 * Enhanced Form component that uses Next.js 15's Form component
 * Provides client-side navigation and prefetching with progressive enhancement
 */
export default function EnhancedForm({
  action,
  method = 'get',
  children,
  className,
  onSuccess,
  onError,
  resetOnSuccess = false,
  ...props
}: EnhancedFormProps) {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // If JS is disabled, the form will submit normally
    if (method === 'get') {
      // Let Form component handle get requests with client-side navigation
      return;
    }

    // For POST requests, we can add additional behavior
    try {
      // Let the form component handle it, but we can add our own success logic
      if (onSuccess) {
        onSuccess();
      }
      if (resetOnSuccess && formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };

  return (
    <Form
      ref={formRef}
      action={action}
      method={method}
      className={cn('space-y-4', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </Form>
  );
}