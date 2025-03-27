import React, { useState, useEffect } from 'react';
import { Command, KeySquare, RefreshCw, Lock, Unlock, CommandIcon } from 'lucide-react';

// Option 1: Floating Pill Indicators that fade in/out
const FloatingPillIndicators = ({ isDraggable }) => {
  const [visible, setVisible] = useState(true);
  
  // Fade out after 5 seconds, show again on state change
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [isDraggable]);
  
  return (
    <div className={`fixed bottom-6 right-6 flex flex-col gap-2 transition-opacity duration-500 ${visible ? 'opacity-80' : 'opacity-0 hover:opacity-60'}`}>
      <div className="flex items-center bg-secondary/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-border">
        <Command size={14} className="text-primary mr-1" />
        <span className="text-xs font-medium mr-1">L</span>
        <span className="text-xs text-muted-foreground">
          {isDraggable ? 'Lock' : 'Unlock'} grid
        </span>
        {isDraggable ? 
          <Lock size={14} className="ml-1.5 text-muted-foreground" /> : 
          <Unlock size={14} className="ml-1.5 text-primary" />
        }
      </div>
      
      <div className="flex items-center bg-secondary/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-border">
        <Command size={14} className="text-primary mr-1" />
        <span className="text-xs font-medium mr-1">K</span>
        <span className="text-xs text-muted-foreground">Reset layout</span>
        <RefreshCw size={12} className="ml-1.5 text-muted-foreground" />
      </div>
    </div>
  );
};

// Option 2: Minimalist Footer Pills
const MinimalistFooterPills = ({ isDraggable }) => {
  return (
    <div className="mx-auto flex justify-center gap-4 py-2 mt-3 mb-6">
      <div className="flex items-center px-3 py-1 rounded-full bg-secondary/40 backdrop-blur-sm border border-border/50">
        <KeySquare size={12} className="text-primary mr-1.5" />
        <span className="text-xs font-medium mx-0.5">⌘L</span>
        <span className="text-xs text-muted-foreground ml-1 mr-0.5">
          {isDraggable ? 'Lock' : 'Unlock'}
        </span>
      </div>
      
      <div className="flex items-center px-3 py-1 rounded-full bg-secondary/40 backdrop-blur-sm border border-border/50">
        <KeySquare size={12} className="text-primary mr-1.5" />
        <span className="text-xs font-medium mx-0.5">⌘K</span>
        <span className="text-xs text-muted-foreground ml-1 mr-0.5">Reset</span>
      </div>
    </div>
  );
};

// Option 3: Status Indicator with Icon
const StatusIndicator = ({ isDraggable }) => {
  return (
    <div className="fixed bottom-6 left-6 flex items-center bg-secondary/80 backdrop-blur-md px-3 py-2 rounded-full shadow-md border border-border">
      {isDraggable ? (
        <>
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          <span className="text-xs">Drag enabled</span>
          <div className="mx-2 h-3 w-px bg-border" />
        </>
      ) : (
        <>
          <div className="w-2 h-2 rounded-full bg-primary mr-2" />
          <span className="text-xs">Locked</span>
          <div className="mx-2 h-3 w-px bg-border" />
        </>
      )}
      <div className="flex items-center space-x-2">
        <div className="flex -space-x-1">
          <kbd className="text-[10px] px-1.5 py-0.5 bg-background border rounded">⌘D</kbd>
          <kbd className="text-[10px] px-1.5 py-0.5 bg-background border rounded">⌘K</kbd>
        </div>
      </div>
    </div>
  );
};

// Option 4: First-time Visitor Welcome Toast (complementary to above options)
const WelcomeToast = ({ onClose }) => {
  return (
    <div className="fixed top-6 right-6 max-w-xs bg-secondary border border-border rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-top duration-300">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <KeySquare className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium">Keyboard shortcuts available</h3>
            <div className="mt-2 text-xs text-muted-foreground">
              <p className="mb-1 flex items-center">
                <kbd className="px-1.5 py-0.5 mr-1.5 bg-background border rounded text-[10px]">⌘D</kbd>
                Toggle grid dragging
              </p>
              <p className="flex items-center">
                <kbd className="px-1.5 py-0.5 mr-1.5 bg-background border rounded text-[10px]">⌘K</kbd>
                Reset layout
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-3 bg-secondary flex justify-end">
        <button 
          onClick={onClose}
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

// Option 5: Subtle Icon Button that expands on hover
const ExpandableShortcutButton = ({ isDraggable }) => {
  return (
    <div className="fixed bottom-6 right-6 group">
      <div className="relative">
        <button className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all duration-300">
          <CommandIcon size={18} />
        </button>
        
        {/* Expandable content */}
        <div className="absolute bottom-full right-0 mb-2 min-w-48 overflow-hidden max-h-0 group-hover:max-h-40 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
          <div className="bg-secondary border border-border rounded-lg shadow-md p-3">
            <h3 className="text-xs font-medium mb-2">Keyboard Shortcuts</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <kbd className="text-[10px] px-1.5 py-0.5 bg-background border rounded">⌘D</kbd>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {isDraggable ? 'Lock' : 'Unlock'} grid
                  </span>
                </div>
                {isDraggable ? 
                  <Unlock size={12} className="text-primary" /> : 
                  <Lock size={12} className="text-muted-foreground" />
                }
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <kbd className="text-[10px] px-1.5 py-0.5 bg-background border rounded">⌘K</kbd>
                  <span className="ml-2 text-xs text-muted-foreground">Reset layout</span>
                </div>
                <RefreshCw size={12} className="text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component showing all options
const KeyboardShortcutsIndicators = ({ isDraggable = true }) => {
  const [showWelcomeToast, setShowWelcomeToast] = useState(true);
  
  // In a real implementation, you'd use localStorage to show the welcome toast only once
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeToast');
    if (hasSeenWelcome) {
      setShowWelcomeToast(false);
    } else {
      const timer = setTimeout(() => {
        localStorage.setItem('hasSeenWelcomeToast', 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);
  
  return (
    <div className="relative">
      {/* Option 1 */}
      <FloatingPillIndicators isDraggable={isDraggable} />
      
      {/* Option 2 */}
      {/* <MinimalistFooterPills isDraggable={isDraggable} /> */}
      
      {/* Option 3 */}
      {/* <StatusIndicator isDraggable={isDraggable} /> */}
      
      {/* Option 4 */}
      {/* {showWelcomeToast && <WelcomeToast onClose={() => setShowWelcomeToast(false)} />} */}
      
      {/* Option 5 */}
      {/* <ExpandableShortcutButton isDraggable={isDraggable} /> */}
    </div>
  );
};

export default KeyboardShortcutsIndicators;