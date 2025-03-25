// components/Footer.tsx

'use client';

import siteMetadata from 'public/data/siteMetaData';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { usePathname } from 'next/navigation';

import Link from './assets/Link';

export default function Footer() {
  const pathName = usePathname();

  return (
    <footer className="mt-auto py-8">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          {siteMetadata.linkedin && (
            <a
              href={siteMetadata.linkedin}
              title='linkedin'
              className="text-muted-foreground hover:brightness-125 dark:hover:brightness-125"
            >
              <Linkedin size={24} />
            </a>
          )}
          {siteMetadata.email && (
            <a
              href={`mailto:${siteMetadata.email}`}
              title='email'
              className="text-muted-foreground hover:brightness-125 dark:hover:brightness-125"
            >
              <Mail size={24} />
            </a>
          )}
          {siteMetadata.github && (
            <a
              href={siteMetadata.github}
              title='Github'
              className="text-muted-foreground hover:brightness-125 dark:hover:brightness-125"
            >
              <Github size={24} />
            </a>
          )}
        </div>
        {pathName == '/' && (
          <div className="mb-2 text-xs text-muted-foreground/50 text-center">
            Homepage assets by{' '}
            <Link href="https://freepik.com" className="underline text-muted-foreground/75">
              Freepik
            </Link>
            <br /> Made with ❤️ by {'lewisgoing'} using NextJS, Typescript and TailwindCSS
          </div>
        )}
        <div className="mb-10 flex space-x-2 text-sm text-muted-foreground">
          <div>{`© ${new Date().getFullYear()} ${siteMetadata.author}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  );
}
