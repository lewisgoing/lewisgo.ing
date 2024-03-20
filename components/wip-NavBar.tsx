import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "../scripts/utils/tailwind-helpers";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const changeBackground = () => {
        if (window.scrollY > 10) {
            setIsScrolled(true)
        } else {
            setIsScrolled(false)
        }
    }
    // if (window.location.pathname.includes('/shop')) {
    //     setAnimateToShop(true);
    // }

    document.addEventListener('scroll', changeBackground)

    return () => document.removeEventListener('scroll', changeBackground)
}, [])

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

  return (
    <nav
      className={cn(
        "flex justify-between items-center py-4 px-2 md:mx-auto bg-secondary border-border md:px-8 md:max-w-[768px] lg:max-w-[1168px] fixed inset-x-0 top-4 z-40 mx-8 flex h-[60px] items-center justify-between rounded-3xl border px-4 shadow-sm saturate-100 backdrop-blur-[10px] transition-all duration-200",
        isScrolled && "bg-background/80 border-transparent"
      )}
    >
      <div className="flex items-center gap-[1ch]">
        <div className="w-5 h-5 bg-yellow-400 rounded-full" />
        <span className="text-sm font-semibold tracking-widest">
          LEWIS GOING
        </span>
      </div>
      <div className="flex gap-12 text-md text-zinc-400">
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/about">About</Link>
      </div>
    </nav>
  );
};

export default NavBar;
