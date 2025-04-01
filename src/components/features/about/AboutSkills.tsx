// components/about/AboutSkills.tsx
'use cache';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/ui/tooltip';
import SectionHeading from './SectionHeading';

// Icon imports
import { FaPython, FaJava } from 'react-icons/fa';
import { 
  SiNextdotjs, 
  SiReact, 
  SiCss3, 
  SiTailwindcss, 
  SiTypescript, 
  SiJavascript, 
  SiGit, 
  SiAbletonlive, 
  SiFigma, 
  SiHtml5, 
  SiPowerautomate, 
  SiNodedotjs,
  SiMongodb,
  SiPostgresql,
  SiGraphql,
  SiDocker,
  SiAmazonaws,
  SiGithubactions,
  SiFirebase,
  SiVercel,
  SiVisualstudiocode,
  SiThreedotjs
} from 'react-icons/si';
import { FaMarkdown, FaSmileBeam, FaServer, FaMobileAlt } from 'react-icons/fa';
import { SiGnubash } from 'react-icons/si';

// Skill category definition
interface SkillCategory {
  name: string;
  description: string;
  skills: Skill[];
}

// Skill definition with proficiency level
interface Skill {
  name: string;
  icon: React.ElementType;
  proficiency: number; // 1-5 scale
  description: string;
}

// Skill categories
const skillCategories: SkillCategory[] = [
  {
    name: "Frontend Development",
    description: "Building responsive, accessible, and interactive user interfaces",
    skills: [
      { 
        name: "React", 
        icon: SiReact, 
        proficiency: 5,
        description: "Advanced state management, custom hooks, and optimized rendering" 
      },
      { 
        name: "Next.js", 
        icon: SiNextdotjs, 
        proficiency: 5,
        description: "Server components, app router, and advanced data fetching strategies" 
      },
      { 
        name: "TypeScript", 
        icon: SiTypescript, 
        proficiency: 4,
        description: "Type-safe components, generics, and utility types" 
      },
      { 
        name: "Tailwind CSS", 
        icon: SiTailwindcss, 
        proficiency: 5,
        description: "Custom configurations, animations, and responsive design" 
      },
      { 
        name: "Three.js", 
        icon: SiThreedotjs, 
        proficiency: 3,
        description: "3D visualizations, WebGL, and creative coding" 
      },
      { 
        name: "HTML5", 
        icon: SiHtml5, 
        proficiency: 5,
        description: "Semantic markup, accessibility, and SEO optimization" 
      },
      { 
        name: "CSS3", 
        icon: SiCss3, 
        proficiency: 4,
        description: "Advanced animations, grid layouts, and custom properties" 
      },
      { 
        name: "JavaScript", 
        icon: SiJavascript, 
        proficiency: 5,
        description: "ES6+, async programming, and functional patterns" 
      }
    ]
  },
  {
    name: "Backend Development",
    description: "Creating robust server-side solutions and APIs",
    skills: [
      { 
        name: "Node.js", 
        icon: SiNodedotjs, 
        proficiency: 4,
        description: "RESTful APIs, middleware, and asynchronous programming" 
      },
      { 
        name: "Python", 
        icon: FaPython, 
        proficiency: 4,
        description: "Data processing, automation, and server-side applications" 
      },
      { 
        name: "GraphQL", 
        icon: SiGraphql, 
        proficiency: 3,
        description: "Schema design, resolvers, and API optimization" 
      },
      { 
        name: "MongoDB", 
        icon: SiMongodb, 
        proficiency: 3,
        description: "Document modeling, queries, and aggregation pipelines" 
      },
      { 
        name: "PostgreSQL", 
        icon: SiPostgresql, 
        proficiency: 3,
        description: "Relational data modeling, complex queries, and performance tuning" 
      },
      { 
        name: "Java", 
        icon: FaJava, 
        proficiency: 3,
        description: "Object-oriented design, data structures, and algorithms" 
      },
      { 
        name: "Server Architecture", 
        icon: FaServer, 
        proficiency: 3,
        description: "API design, microservices, and scalable systems" 
      }
    ]
  },
  {
    name: "DevOps & Tools",
    description: "Deployment, automation, and development workflows",
    skills: [
      { 
        name: "Git", 
        icon: SiGit, 
        proficiency: 4,
        description: "Branching strategies, collaborative workflows, and version control" 
      },
      { 
        name: "Docker", 
        icon: SiDocker, 
        proficiency: 3,
        description: "Containerization, multi-container applications, and orchestration" 
      },
      { 
        name: "AWS", 
        icon: SiAmazonaws, 
        proficiency: 2,
        description: "S3, Lambda, CloudFront, and serverless architectures" 
      },
      { 
        name: "GitHub Actions", 
        icon: SiGithubactions, 
        proficiency: 3,
        description: "CI/CD pipelines, automated testing, and deployment workflows" 
      },
      { 
        name: "Firebase", 
        icon: SiFirebase, 
        proficiency: 4,
        description: "Authentication, Firestore, and real-time features" 
      },
      { 
        name: "Vercel", 
        icon: SiVercel, 
        proficiency: 5,
        description: "Deployment, preview environments, and edge functions" 
      },
      { 
        name: "VS Code", 
        icon: SiVisualstudiocode, 
        proficiency: 5,
        description: "Custom extensions, snippets, and productive workflows" 
      },
      { 
        name: "Bash/CLI", 
        icon: SiGnubash, 
        proficiency: 3,
        description: "Shell scripting, automation, and command-line tools" 
      }
    ]
  },
  {
    name: "Design & Creative",
    description: "User experience design and creative tooling",
    skills: [
      { 
        name: "Figma", 
        icon: SiFigma, 
        proficiency: 4,
        description: "UI design, prototyping, and design systems" 
      },
      { 
        name: "Ableton Live", 
        icon: SiAbletonlive, 
        proficiency: 4,
        description: "Music production, sound design, and creative audio" 
      },
      { 
        name: "Mobile Design", 
        icon: FaMobileAlt, 
        proficiency: 3,
        description: "Responsive layouts, native-like experiences, and mobile UX patterns" 
      },
      { 
        name: "Automation", 
        icon: SiPowerautomate, 
        proficiency: 3,
        description: "Workflow automation, integrations, and productivity systems" 
      },
      { 
        name: "Markdown", 
        icon: FaMarkdown, 
        proficiency: 5,
        description: "Documentation, content formatting, and technical writing" 
      },
      { 
        name: "Soft Skills", 
        icon: FaSmileBeam, 
        proficiency: 5,
        description: "Communication, teamwork, problem-solving, and user empathy" 
      }
    ]
  }
];

// Helper to generate skill progress bar
const SkillProgressBar = ({ proficiency }: { proficiency: number }) => {
  const percentage = (proficiency / 5) * 100;
  
  return (
    <div className="w-full h-1.5 bg-tertiary/50 rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const AboutSkills = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="mb-16">
      {/* Section heading */}
      <SectionHeading 
        title="Skills & Technologies"
        subtitle="Tools and technologies I work with"
      />

      {/* Category tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {skillCategories.map((category, index) => (
          <motion.button
            key={index}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === index
                ? 'bg-primary text-primary-foreground'
                : 'bg-tertiary/50 text-muted-foreground hover:bg-tertiary'
            }`}
            onClick={() => setSelectedCategory(index)}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Category description */}
      <motion.p 
        className="text-muted-foreground mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={selectedCategory}
        transition={{ duration: 0.5 }}
      >
        {skillCategories[selectedCategory].description}
      </motion.p>

      {/* Skills grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        key={selectedCategory}
      >
        {skillCategories[selectedCategory].skills.map((skill, index) => (
          <motion.div 
            key={index}
            className="bg-secondary border border-border rounded-2xl p-5 hover:shadow-md transition-all"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center mb-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-tertiary/50 p-3 rounded-xl text-primary mr-3">
                      <skill.icon size={24} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{skill.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="flex-1">
                <h3 className="font-semibold">{skill.name}</h3>
                <SkillProgressBar proficiency={skill.proficiency} />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{skill.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default AboutSkills;