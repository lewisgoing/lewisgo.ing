// components/NavBar.tsx
'use client';

import headerNavLinks from '../public/data/headerNavLinks';
import siteMetadata from 'public/data/siteMetaData';
import { cn } from '../src/utils/tailwind-helpers';
import NextImage from 'next/image';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import ThemeSwitch from './assets/ThemeSwitch';
import { Button } from './ui/button';

const NavBar = () => {
  const logo = './logo.png';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    document.addEventListener('scroll', changeBackground);

    return () => document.removeEventListener('scroll', changeBackground);
  }, []);

  return (
    <header
    className={cn(
      'fixed inset-x-0 bento-xl:left-16 top-4 z-40 flex h-[60px] mx-8 bento-md:mx-auto items-center justify-between rounded-3xl px-4 bento-md:pr-8 transition-all duration-200 bento-md:max-w-[768px] bento-lg:max-w-[1200px] bento-xl:max-w-[1600px]',
      isScrolled && 'bg-background/80 border-transparent shadow-sm saturate-100 backdrop-blur-[10px]',
    )}
  >
        <div className='w-full mx-auto flex h-[60px] items-center justify-between'>
          <Link href="/" aria-label={siteMetadata.headerTitle}>
            <div className="flex items-center justify-between">
              <p className="px-3 py-2 text-md font-medium text-muted-foreground hover:text-foreground">lewisgo.ing</p>
            </div>
          </Link>
        </div>
        <div className="flex items-center md:space-x-3">
          <ul className="hidden space-x-2 md:flex">
            {headerNavLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="ghost"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Link href={link.href}>
                    {link.title}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
    </header>
  );
};

export default NavBar;