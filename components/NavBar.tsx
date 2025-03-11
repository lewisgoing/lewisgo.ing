// components/NavBar.tsx

'use client';

import headerNavLinks from '../public/data/headerNavLinks';
import siteMetadata from 'public/data/siteMetaData';
import { cn } from '../src/utils/tailwind-helpers';
import NextImage from 'next/image';
import { useEffect, useState } from 'react';

import Link from './assets/Link';
// import MobileNav from './MobileNav'
// import SearchButton from './SearchButton'
import ThemeSwitch from './assets/ThemeSwitch';
import { Button } from './shadcn/button';

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
        'fixed inset-x-0 top-4 z-40 flex h-[60px] mx-8 bento-md:mx-auto items-center justify-between rounded-3xl bg-secondary border-border border px-4 bento-md:px-8 shadow-sm saturate-100 backdrop-blur-[10px] transition-all duration-200 bento-md:max-w-[768px] bento-lg:max-w-[1168px]',
        isScrolled && 'bg-background/80 border-transparent',
      )}
    >
      <div className="w-full mx-auto flex h-[60px] items-center justify-between">
        <div>
          <Link href="/" aria-label={siteMetadata.headerTitle}>
            <div className="flex items-center justify-between">
              <NextImage src={logo} alt="Logo" width="40" height="40" unoptimized />
              <p className="px-3 py-2 text-md font-medium text-muted-foreground hover:text-foreground">
                lewis<i>going</i>
              </p>
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
                  <Link
                    // className="rounded px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-secondary hover:brightness-125"
                    href={link.href}
                  >
                    {link.title}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
          {/* <SearchButton /> */}
          {/* <ThemeSwitch /> */}
          {/* <MobileNav /> */}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
