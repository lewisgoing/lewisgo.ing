// components/assets/ExternalLink.tsx
import { MoveUpRight } from 'lucide-react'
import Link from './Link'
import { ReactNode } from 'react'

interface ExternalLinkProps {
    href: string
    newTab?: boolean
    className?: string
    children?: ReactNode  // Add this line to allow children
}

const ExternalLink = ({ 
    href, 
    newTab = true, 
    className, 
    children  // Add children to destructured props
}: ExternalLinkProps) => {
    const linkProps = {
        href,
        className,
        ...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})
    };

    return children ? (
        <Link {...linkProps}>
            {children}
            <div className="absolute bottom-0 right-0 m-3 flex w-fit items-end rounded-full border border-border bg-tertiary/50 p-3 text-primary transition-all duration-300 hover:brightness-125">
                <MoveUpRight size={16} />
            </div>
        </Link>
    ) : (
        <Link {...linkProps}>
            <div className="absolute bottom-0 right-0 m-3 flex w-fit items-end rounded-full border border-border bg-tertiary/50 p-3 text-primary transition-all duration-300 hover:brightness-125">
                <MoveUpRight size={16} />
            </div>
        </Link>
    );
}

export default ExternalLink