'use client';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../shadcn/tooltip';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeSwitch = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // When mounted on client, now we can show the UI
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return null;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <button
                        aria-label="Toggle Dark Mode"
                        className="flex cursor-pointer items-center transition-opacity duration-300 hover:brightness-125"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        {mounted && theme === 'dark' ? <Sun /> : <Moon />}
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <span>Toggle dark mode</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ThemeSwitch;