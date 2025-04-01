// components/assets/ExternalLink.tsx
import { MoveUpRight } from 'lucide-react';
import CustomLink from '../shared/Link';
import { ReactNode } from 'react';

interface ExternalLinkProps {
  href: any;
  newTab?: boolean;
  className?: string;
  children?: ReactNode;
  iconSize?: number;
  ariaLabel?: string; // Add aria-label support
  title?: string; // Add title support
}

const ExternalLink = ({
  href,
  newTab = true,
  className,
  children,
  iconSize = 16,
  ariaLabel, // Accessibility label
  title, // Tooltip text
}: ExternalLinkProps) => {
  return children ? (
    <CustomLink 
      href={href} 
      className={className}
      target={newTab ? "_blank" : undefined} 
      rel={newTab ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      title={title}
    >
      {children}
      <div className="absolute bottom-0 right-0 m-3 flex w-fit items-end rounded-full border bg-secondary/50 p-3 text-primary transition-all duration-300 hover:rotate-12 hover:ring-1 hover:ring-primary">
        <MoveUpRight size={iconSize} className="bento-xl:hidden" />
        <MoveUpRight size={iconSize * 1.25} className="hidden bento-xl:block" />
      </div>
    </CustomLink>
  ) : (
    <CustomLink 
      href={href} 
      className={className}
      target={newTab ? "_blank" : undefined} 
      rel={newTab ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      title={title}
    >
      <div className="absolute bottom-0 right-0 m-3 flex w-fit items-end rounded-full border bg-secondary/50 p-3 text-primary transition-all duration-300 hover:rotate-12 hover:ring-1 hover:ring-primary">
        <MoveUpRight size={iconSize} className="bento-xl:hidden" />
        <MoveUpRight size={iconSize * 1.25} className="hidden bento-xl:block" />
      </div>
    </CustomLink>
  );
};

export default ExternalLink;