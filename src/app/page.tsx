'use client';

import Bento from '@/components/Bento';
import SectionContainer from '@/components/SectionContainer';

export default function Home() {
  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="mx-auto bento-md:-mx-[5vw] bento-lg:-mx-[20vw]">
          <Bento />
        </div>
      </div>
    </SectionContainer>
  );
}