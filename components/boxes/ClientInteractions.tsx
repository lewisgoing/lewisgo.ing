'use client';

import { useState } from 'react';

type ClientInteractionsProps = {
  children: (props: {
    isHovered: boolean;
    setIsHovered: (value: boolean) => void;
  }) => React.ReactNode;
};

// This client component handles interactive behaviors
// while allowing the main content to be server-rendered
export default function ClientInteractions({ children }: ClientInteractionsProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return <>{children({ isHovered, setIsHovered })}</>;
}