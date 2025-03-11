'use client';

import { useState } from 'react';
import { Button } from './shadcn/button';
import EnhancedForm from './ui/enhanced-form';
import { recordPageVisitAfterResponse } from '@/utils/after-utils';

export default function ContactForm() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Record the form submission attempt after response
    recordPageVisitAfterResponse('/contact-form-submission');
    
    // Example form handling
    try {
      // This would be replaced with your actual form submission logic
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API request
      setFormStatus('success');
    } catch (error) {
      setFormStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <EnhancedForm
      action="/api/contact"
      method="post"
      className="space-y-4 max-w-md mx-auto"
      onSubmit={handleSubmit}
      resetOnSuccess={true}
      onSuccess={() => setFormStatus('success')}
      onError={() => {
        setFormStatus('error');
        setErrorMessage('Something went wrong. Please try again later.');
      }}
    >
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full rounded-md border border-border bg-background p-2 text-foreground"
          disabled={formStatus === 'submitting'}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-md border border-border bg-background p-2 text-foreground"
          disabled={formStatus === 'submitting'}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full rounded-md border border-border bg-background p-2 text-foreground"
          disabled={formStatus === 'submitting'}
        ></textarea>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={formStatus === 'submitting'}
      >
        {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
      </Button>
      
      {formStatus === 'success' && (
        <div className="mt-4 rounded-md bg-green-100 p-3 text-green-800 dark:bg-green-900 dark:text-green-200">
          Message sent successfully! I'll get back to you soon.
        </div>
      )}
      
      {formStatus === 'error' && (
        <div className="mt-4 rounded-md bg-red-100 p-3 text-red-800 dark:bg-red-900 dark:text-red-200">
          {errorMessage}
        </div>
      )}
    </EnhancedForm>
  );
}