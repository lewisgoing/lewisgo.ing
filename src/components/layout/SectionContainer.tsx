// components/SectionContainer.tsx

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-20 bento-sm:px-6 bento-xl:max-w-[50rem] bento-xl:px-8">
      {children}
    </section>
  );
}
