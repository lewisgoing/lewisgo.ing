// components/assets/Link.tsx
/* eslint-disable jsx-a11y/anchor-has-content */
import NextLink from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';

// Define a simpler props interface for our custom Link component
interface CustomLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: any;
  children?: ReactNode;
}

const CustomLink = ({ href, children, ...rest }: CustomLinkProps) => {
  const isInternalLink = href && href.startsWith('/');
  const isAnchorLink = href && href.startsWith('#');

  if (isInternalLink) {
    return <NextLink href={href} {...rest}>{children}</NextLink>;
  }

  if (isAnchorLink) {
    return <a href={href} {...rest}>{children}</a>;
  }

  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest}>{children}</a>;
};

export default CustomLink;