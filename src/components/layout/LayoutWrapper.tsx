// components/LayoutWrapper.tsx
'use client';
import { ReactNode } from 'react';

import Footer from './Footer';
import NavBar from './NavBar';
import SectionContainer from './SectionContainer';
import { fontClass } from '../../utils/fonts';
import AnimatedCursor from 'react-animated-cursor';

interface Props {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: Props) => {
  return (
    <SectionContainer>
      <AnimatedCursor
        innerSize={8}
        outerSize={8}
        color="193, 11, 111"
        outerAlpha={0.2}
        innerScale={0.7}
        outerScale={5}
        showSystemCursor={false}
        clickables={[
          'a',
          'input[type="text"]',
          'input[type="email"]',
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          'label[for]',
          'select',
          'textarea',
          'button',
          '.link',
          {
            target: '.react-grid-item',
            options: {
              innerSize: 12,
              outerSize: 16,
              color: '255, 255, 255',
              outerAlpha: 0.3,
              innerScale: 0.7,
              outerScale: 5,
            },
          } as any,
        ]}
      />
      <div className={`${fontClass} flex flex-col font-mono`}>
        <NavBar />
        <main className="flex-grow mb-4">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  );
};

export default LayoutWrapper;