// components/mdx/InfoBox.tsx
import React from 'react';
import { cn } from 'src/utils/tailwind-helpers';
import { InfoIcon, AlertTriangleIcon, FlagIcon } from 'lucide-react';

type InfoBoxType = 'info' | 'warning' | 'flag';

interface InfoBoxProps {
  type?: InfoBoxType;
  children: React.ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({ type = 'info', children }) => {
  const getIcon = (type: InfoBoxType) => {
    switch (type) {
      case 'warning':
        return <AlertTriangleIcon className="h-5 w-5 text-amber-500" />;
      case 'flag':
        return <FlagIcon className="h-5 w-5 text-emerald-500" />;
      case 'info':
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: InfoBoxType) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'flag':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'info':
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div
      className={cn(
        'my-6 rounded-lg border p-4',
        getBackgroundColor(type)
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 pt-1">{getIcon(type)}</div>
        <div className="flex-grow [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoBox;