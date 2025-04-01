// src/pages/about.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import siteMetadata from 'public/data/siteMetaData';
// import { unstable_after as after } from 'next/server';

// Components
import AboutHero from '@/components/features/about/AboutHero';
import AboutJourney from '@/components/features/about/AboutJourney';
import AboutSkills from '@/components/features/about/AboutSkills';
import AboutProjects from '@/components/features/about/AboutProjects';
import AboutMusic from '@/components/features/about/AboutMusic';
import AboutContact from '@/components/features/about/AboutContact';
import AboutLayout from '@/components/features/about/AboutLayout';
// import { after } from 'lodash';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2,
      duration: 0.8,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  }),
};

export default function About() {
  // For scrolling animations
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

//   // Log page view analytics after response
//   after(() => {
//     console.log('About page viewed:', new Date().toISOString());
//     // This would be where you'd integrate with your analytics provider
//   });

  return (
    // <AboutLayout>
    <>
          <Head>
        <title>About | {siteMetadata.title}</title>
        <meta name="description" content="About Lewis Going - Full-stack developer, creative, and student." />
      </Head>

      <div className="divide-y divide-accent-foreground dark:divide-accent">
        <div className="space-y-24 pt-10 sm:space-y-32 sm:pt-12 md:space-y-40 md:pt-16">
          {/* Hero Section */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={0}
            className="mt-10"
          >
            <AboutHero />
          </motion.section>

          {/* Professional Journey */}
          {/* <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            custom={1}
          >
            <AboutJourney />
          </motion.section> */}

          {/* Skills & Technologies */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            custom={2}
          >
            <AboutSkills />
          </motion.section>

          {/* Projects */}
          {/* <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            custom={3}
          >
            <AboutProjects />
          </motion.section> */}

          {/* Music & Creative */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            custom={4}
          >
            <AboutMusic />
          </motion.section>

          {/* Contact */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            custom={5}
          >
            <AboutContact />
          </motion.section>
        </div>
      </div>
    </>

      
    // </AboutLayout>
  );
}