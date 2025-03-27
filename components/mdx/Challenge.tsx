// components/mdx/Challenge.tsx
import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

type Solver = {
  name: string;
  href?: string;
  avatar?: string;
};

interface ChallengeProps {
  authors: string[];
  solvers?: Solver[];
  category: string;
  points: number;
  solves: number;
  children: React.ReactNode;
}

const Challenge: React.FC<ChallengeProps> = ({
  authors,
  solvers,
  category,
  points,
  solves,
  children,
}) => {
  return (
    <div className="my-6 rounded-lg border border-border p-4 bg-secondary/30">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {category}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {points} points · {solves} solves
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm text-muted-foreground">
            by {authors.join(', ')}
          </div>
          {solvers && solvers.length > 0 && (
            <div className="flex -space-x-2">
              {solvers.map((solver, index) => (
                <a
                  key={index}
                  href={solver.href || '#'}
                  className="relative transition-transform hover:z-10 hover:-translate-y-1"
                  title={solver.name}
                >
                  {solver.avatar ? (
                    <Image
                      src={solver.avatar}
                      alt={solver.name}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full border-2 border-background"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-primary text-xs flex items-center justify-center text-primary-foreground border-2 border-background">
                      {solver.name.charAt(0)}
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="text-sm italic text-muted-foreground">{children}</div>
    </div>
  );
};

export default Challenge;