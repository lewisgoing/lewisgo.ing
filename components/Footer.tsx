'use client'


import siteMetadata from 'public/data/siteMetaData'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'
import { usePathname } from 'next/navigation'

import Link from './assets/Link'

export default function Footer() {
    const pathName = usePathname()

    return (
        <footer>
            <div className="mt-16 flex flex-col items-center">
                <div className="mb-3 flex space-x-4">
                    {siteMetadata.linkedin && (
                        <a
                            href={siteMetadata.linkedin}
                            className="text-muted-foreground hover:brightness-125 dark:hover:brightness-125"
                        >
                            <Linkedin size={24} />
                        </a>
                    )}
                    {siteMetadata.email && (
                        <a
                            href={`mailto:${siteMetadata.email}`}
                            className="text-muted-foreground hover:brightness-125 dark:hover:brightness-125"
                        >
                            <Mail size={24} />
                        </a>
                    )}
                    {siteMetadata.github && (
                        <a
                            href={siteMetadata.github}
                            className="text-muted-foreground hover:brightness-125 dark:hover:brightness-125"
                        >
                            <Github size={24} />
                        </a>
                    )}
                </div>
                {pathName == '/' && (
                    <div className="mb-2 text-xs text-muted-foreground/50 text-center">
                        Homepage assets by{' '}
                        <Link
                            href="https://freepik.com"
                            className="underline text-muted-foreground/75"
                        >
                            Freepik
                        </Link>
                        
                        <br />  Made with ❤️ by {'lewisgoing'} using NextJS, Typescript and TailwindCSS
                    </div>
                )}
                <div className="mb-10 flex space-x-2 text-sm text-muted-foreground">
                    <div>{siteMetadata.author}</div>
                    <div>{` • `}</div>
                    <div>{`© ${new Date().getFullYear()}`}</div>
                    <div>{` • `}</div>
                    <Link href="/">{siteMetadata.title}</Link>
                </div>
            </div>
        </footer>
    )
}
