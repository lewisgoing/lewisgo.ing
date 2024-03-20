import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Define a type for the props expected by BlurryCursor
interface BlurryCursorProps {
  isActive: boolean;
}

// Use React.FC to define a functional component with TypeScript, passing the props type
const BlurryCursor: React.FC<BlurryCursorProps> = ({ isActive }) => {
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const delayedMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const circle = useRef<HTMLDivElement>(null); // Use HTMLDivElement for a ref to a div element
  const size = isActive ? 400 : 30;

  const lerp = (x: number, y: number, a: number): number => x * (1 - a) + y * a;

  const manageMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;

    mouse.current = {
      x: clientX,
      y: clientY,
    };
  };

  const animate = () => {
    const { x, y } = delayedMouse.current;

    delayedMouse.current = {
      x: lerp(x, mouse.current.x, 0.075),
      y: lerp(y, mouse.current.y, 0.075),
    };

    moveCircle(delayedMouse.current.x, delayedMouse.current.y);

    rafId.current = window.requestAnimationFrame(animate);
  };

  const moveCircle = (x: number, y: number) => {
    if (circle.current) { // Check if circle.current is not null before using it
      gsap.set(circle.current, { x, y, xPercent: -50, yPercent: -50 });
    }
  };

  useEffect(() => {
    animate();
    window.addEventListener('mousemove', manageMouseMove);
    return () => {
      window.removeEventListener('mousemove', manageMouseMove);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, [isActive]); // Make sure to include dependencies in the dependency array

  return (
    <div className='relative h-screen'>
      <div
        style={{
          backgroundColor: '#BCE4F2',
          width: size,
          height: size,
          filter: `blur(${isActive ? 30 : 0}px)`,
          transition: 'height 0.3s ease-out, width 0.3s ease-out, filter 0.3s ease-out',
        }}
        className='top-0 left-0 fixed rounded-full mix-blend-difference pointer-events-none'
        ref={circle}
      />
    </div>
  );
};

export default BlurryCursor;
