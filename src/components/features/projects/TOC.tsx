// components/projects/TOC.tsx
import React, { useState, useEffect } from 'react';
import { cn } from 'src/utils/tailwind-helpers';

export interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

interface TOCProps {
  headings: TOCHeading[];
  title?: string;
}

const TOC: React.FC<TOCProps> = ({ headings, title = 'Table of Contents' }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    // Observe all section headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div className="sticky top-20 hidden xl:block">
      <div className="rounded-lg border border-border p-4 bg-background/50 backdrop-blur">
        <h4 className="mb-3 text-sm font-medium">{title}</h4>
        <nav className="max-h-[calc(100vh-12rem)] overflow-auto">
          <ul className="space-y-1 text-sm">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={cn(
                  'transition-colors',
                  heading.level === 2 ? 'mt-2' : '',
                  heading.level > 2 ? `ml-${(heading.level - 2) * 3}` : ''
                )}
              >
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    'inline-block py-1 text-muted-foreground no-underline transition-colors hover:text-foreground',
                    activeId === heading.id ? 'text-primary font-medium' : ''
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: 'smooth',
                    });
                    setActiveId(heading.id);
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TOC;