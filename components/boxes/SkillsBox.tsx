import React from 'react';

import { FaPython } from 'react-icons/fa';
import { FaJava } from 'react-icons/fa';
import { SiNextdotjs } from 'react-icons/si';
import { SiReact } from 'react-icons/si';
import { SiCss3 } from 'react-icons/si';
import { SiTailwindcss } from 'react-icons/si';
import { SiTypescript } from 'react-icons/si';
import { SiJavascript } from 'react-icons/si';
import { SiGit } from 'react-icons/si';
import { SiAbletonlive } from 'react-icons/si';
import { SiFigma } from 'react-icons/si';
import { SiHtml5 } from 'react-icons/si';
import { SiPowerautomate } from 'react-icons/si';
import { FaMarkdown } from 'react-icons/fa';
import { SiGnubash } from 'react-icons/si';
import { FaSmileBeam } from 'react-icons/fa';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../shadcn/tooltip';

// Prepare your icons in an array for easy mapping
const icons = [
  { Icon: FaPython, description: 'Python' },
  { Icon: SiNextdotjs, description: 'Next.js' },
  { Icon: FaJava, description: 'Java' },
  { Icon: SiReact, description: 'React' },
  { Icon: SiCss3, description: 'CSS' },
  { Icon: SiTailwindcss, description: 'Tailwind CSS' },
  { Icon: SiTypescript, description: 'TypeScript' },
  { Icon: SiJavascript, description: 'JavaScript' },
  { Icon: SiGit, description: 'Git' },
  { Icon: SiAbletonlive, description: 'Ableton Live' },
  { Icon: SiFigma, description: 'Figma' },
  { Icon: SiHtml5, description: 'HTML' },
  { Icon: SiPowerautomate, description: 'Power Automate' },
  { Icon: FaMarkdown, description: 'Markdown' },
  { Icon: SiGnubash, description: 'Bash' },
  { Icon: FaSmileBeam, description: 'Soft Skills' },
];

const SkillsBox = () => {
  return (
    <TooltipProvider>
      <div
        className="grid          

                overflow-hidden 
                            transition-all 
                            duration-300

                            bento-sm:grid-cols-4 
                                                        gap-4

                            bento-md:grid-cols-8
                            bento-md:gap-1 

                              bento-lg:gap-4
                            bento-lg:grid-cols-4 
                            lg: grid-cols-4
                            xl:grid-cols-4 
                                                               xl:gap-4
                            
      

                    

                            
                     
                    "
      >
        {icons.map(({ Icon, description }, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className="bg-tertiary/50 
                                            rounded-3xl 
                                            flex 
                                            justify-center 
                                            items-center 
                                            p-2
                                            sm:p-4
                                            md:p-2
                                            lg:p-3 
                                            xl:p-3
                                            transition-all 
                                            duration-300 
                                            grayscale 
                                            xl:mt-0
                                            xl:mb-0
                                            lg:mt-0
                                            lg:mb-0
                                            md:mt-1
                                            md:mb-1
                                            sm:mt-0
                                            sm:mb-0
                                            hover:bg-tertiary 
                                            hover:grayscale-0"
              >
                <Icon
                  size={24}
                  className="text-primary sm:h-full sm:w-full md:w-6 md:h-12  lg:w-6 lg:h-6 xl:w-full xl:h-full"
                />{' '}
              </div>
            </TooltipTrigger>
            <TooltipContent className="z-50 overflow-visible" side="top" align="center">
              <span>{description}</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SkillsBox;
