// components/assets/ExternalLink.tsx
import { MoveUpRight } from 'lucide-react';
import CustomLink from './Link';
import { ReactNode } from 'react';

interface ExternalLinkProps {
  href: any;
  newTab?: boolean;
  className?: string;
  children?: ReactNode;
}

const ExternalLink = ({
  href,
  newTab = true,
  className,
  children,
}: ExternalLinkProps) => {
  return children ? (
    <CustomLink 
      href={href} 
      className={className}
      target={newTab ? "_blank" : undefined} 
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      {children}
      <div className="absolute bottom-0 right-0 m-3 flex w-fit items-end rounded-full border border-border bg-tertiary/50 p-3 text-primary transition-all duration-300 hover:brightness-125">
        <MoveUpRight size={16} />
      </div>
    </CustomLink>
  ) : (
    <CustomLink 
      href={href} 
      className={className}
      target={newTab ? "_blank" : undefined} 
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      <div className="absolute bottom-0 right-0 m-3 flex w-fit items-end rounded-full border border-border bg-tertiary/50 p-3 text-primary transition-all duration-300 hover:brightness-125">
        <MoveUpRight size={16} />
      </div>
    </CustomLink>
  );
};

export default ExternalLink;