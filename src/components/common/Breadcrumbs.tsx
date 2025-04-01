// components/Breadcrumbs.tsx
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

export interface BreadcrumbItem {
  href?: string;
  label: string;
  icon?: LucideIcon;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 ${className || ''}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground">
            <HomeIcon className="size-4" />
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <span className="mx-2 text-muted-foreground">/</span>
            {index === items.length - 1 ? (
              <span className="flex items-center gap-x-2">
                {item.icon && <item.icon className="size-4" />}
                {item.label}
              </span>
            ) : (
              <a 
                href={item.href || '#'} 
                className="flex items-center gap-x-2 text-muted-foreground hover:text-foreground"
              >
                {item.icon && <item.icon className="size-4" />}
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}