// public/data/headerNavLinks.ts
import { LinkProps } from 'next/link';

interface NavLink {
  href: LinkProps<string>['href'];
  title: string;
}

const headerNavLinks: NavLink[] = [
    // { href: '/projects', title: 'Projects' },
    // { href: '/projects', title: 'Projects' },
    // { href: '/music', title: 'Music' },
    // { href: '/about', title: 'About Me' },
]

export default headerNavLinks
