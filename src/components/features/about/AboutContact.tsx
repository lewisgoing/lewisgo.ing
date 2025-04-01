// components/about/AboutContact.tsx
'use cache';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { FaSoundcloud } from 'react-icons/fa';
import siteMetadata from 'public/data/siteMetaData';
import { Button } from '@/ui/button';
import Link from '@/components/shared/Link';
import ShaderGradientBox from '@/components/features/bento/boxes/ShaderGradientBox';
import SectionHeading from './SectionHeading';

// Define social media link type
interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

const AboutContact = () => {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  // Create social media links based on site metadata
  const socialLinks: SocialLink[] = [
    {
      name: 'Email',
      url: `mailto:${siteMetadata.email}`,
      icon: <Mail size={24} />,
      color: 'hover:text-primary'
    },
    {
      name: 'GitHub',
      url: siteMetadata.github || 'https://github.com/lewisgoing',
      icon: <Github size={24} />,
      color: 'hover:text-github'
    },
    {
      name: 'LinkedIn',
      url: siteMetadata.linkedin || 'https://www.linkedin.com/in/lewisgoing',
      icon: <Linkedin size={24} />,
      color: 'hover:text-linkedin'
    },
    {
      name: 'SoundCloud',
      url: siteMetadata.soundcloud || 'https://soundcloud.com/lewisgoing',
      icon: <FaSoundcloud size={24} />,
      color: 'hover:text-soundcloud'
    }
  ];

  return (
    <section className="mb-16">
      {/* Section heading */}
      <SectionHeading 
        title="Contact & Connect"
        subtitle="Let's work together or just have a chat"
      />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        {/* Left side - text and links */}
        <div className="lg:col-span-3 space-y-6">
          <motion.p 
            className="text-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Whether you&apos;re interested in working together on a project, have questions about my work, or just want to say hello, I&apos;d love to hear from you.
          </motion.p>

          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            I&apos;m currently open to freelance opportunities, collaborations, and interesting projects. The best way to reach me is through email or LinkedIn.
          </motion.p>

          {/* Social links */}
          <motion.div 
            className="flex flex-wrap gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {socialLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
              >
                <motion.div
                  className={`flex items-center gap-2 py-2 px-4 rounded-full border border-border bg-secondary transition-all ${link.color}`}
                  whileHover={{ y: -5, x: 0 }}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </motion.div>
              </Link>
            ))}
          </motion.div>

          {/* Resume button */}
          <motion.div 
            className="pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              className="rounded-full"
              variant="default"
            >
              <ExternalLink size={16} className="mr-2" />
              Download Resume
            </Button>
          </motion.div>
        </div>

        {/* Right side - decorative shader gradient */}
        {/* <motion.div 
          className="relative lg:col-span-2 h-80 rounded-3xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ShaderGradientBox
            className="rounded-3xl w-full h-full"
            animate="on"
            control="props"
            positionX={0}
            positionY={0}
            positionZ={0}
            rotationX={0}
            rotationY={10}
            rotationZ={isHovered !== null ? 70 : 30}
            color1="#FF0006"
            color2="#003FFF"
            color3="#E9D3B6"
            wireframe={false}
            shader="defaults"
            type="sphere"
            uAmplitude={1.4}
            uDensity={1.0}
            uFrequency={isHovered !== null ? 2.0 : 1.0}
            uSpeed={isHovered !== null ? 0.08 : 0.03}
            uStrength={1.4}
            cDistance={10}
            cameraZoom={20}
            cAzimuthAngle={0}
            cPolarAngle={90}
            uTime={2}
            lightType="3d"
            envPreset="dawn"
            reflection={0.4}
            brightness={1.9}
            grain="off"
            toggleAxis={false}
            hoverState="off"
          /> */}

          {/* Overlay text */}
          {/* <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-md">Let's Create Something Amazing</h3>
            <p className="text-white/80 drop-shadow-md">I'm always open to new opportunities and collaborations</p>
          </div>
        </motion.div>*/}
      </div> 

      {/* Additional contact note */}
      <motion.div 
        className="mt-12 bg-tertiary/30 rounded-2xl p-6 border border-border"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-bold mb-2">A Note on Response Time</h3>
        <p className="text-muted-foreground">
          I typically respond to messages within 24-48 hours. If you&apos;re reaching out about a time-sensitive matter, please mention it in your message, and I&apos;ll do my best to prioritize it.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutContact;