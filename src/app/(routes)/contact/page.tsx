'use client';

import ContactForm from '@/components/ContactForm';
import SectionContainer from '@/components/SectionContainer';
import { Metadata } from 'next';
import { recordPageVisitAfterResponse } from 'src/utils/after-utils';
import { useEffect } from 'react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Lewis Going',
};

export default function ContactPage() {
  // Record page visit after the component renders and response is sent
  useEffect(() => {
    recordPageVisitAfterResponse('/contact');
  }, []);

  return (
    <SectionContainer>
      <div className="divide-y divide-accent-foreground dark:divide-accent">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-foreground sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Contact
          </h1>
          <p className="text-lg text-muted-foreground">
            Have a question or want to work together? Get in touch!
          </p>
        </div>
        
        <div className="py-8">
          <ContactForm />
        </div>
      </div>
    </SectionContainer>
  );
}