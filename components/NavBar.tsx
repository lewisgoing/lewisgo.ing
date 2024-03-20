import React from 'react'
import Link from 'next/link'

const NavBar = () => {
    return (
        <nav className="flex justify-between items-center py-4 px-2">
            <div className="flex items-center gap-[1ch]">
                <div className="w-5 h-5 bg-yellow-400 rounded-full"/>
                <span className="gradient-text text-transparent text-sm font-semibold tracking-widest animate-gradient">LEWISGOING</span>
                {/* <span className="text-sm font-semibold tracking-widest">LEWIS GOING</span> */}
            </div>
            <div className="flex gap-12 text-md text-zinc-400">
                <Link href="#" className="text-black font-medium">Home</Link>
                <Link href="/projects">Projects</Link>
                <Link href="/about">About</Link>
            </div>
        </nav>
    )
}

export default NavBar