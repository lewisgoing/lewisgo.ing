import React, { useEffect, useState } from 'react'
import { lgLayout, mdLayout, smLayout } from '../scripts/utils/bento-layouts'  


import HeroBox from "./boxes/HeroBox";
import PFPBox from "./boxes/PFPBox";
import ProjectPreviewBox from "./boxes/ProjectPreviewBox";

import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive, {
  measureBeforeMount: true,
});

export default function Bento() {
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const [rowHeight, setRowHeight] = useState(280);
  const handleWidthChange = (width) => {
    if (width <= 500) {
      setRowHeight(158);
    } else if (width <= 1100) {
      setRowHeight(180);
    } else {
      setRowHeight(280);
    }
  };

  const handleDragStart = (element) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    document.querySelectorAll(".react-grid-item").forEach((item) => {
      (item as HTMLElement).style.zIndex = "1";
    });

    element.style.zIndex = "10";
  };

  const handleDragStop = (element) => {
    timeoutRef.current = setTimeout(() => {
      element.style.zIndex = "1";
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ResponsiveGridLayout
      className="mx-auto max-w-[375px] md:max-w-[800px] lg:max-w-[1200px]"
      layouts={{ lg: lgLayout, md: mdLayout, sm: smLayout }}
      // I don't know why but if I don't subtract 1 everything shits itself
      breakpoints={{ lg: 1199, md: 799, sm: 374 }}
      cols={{ lg: 2, md: 2, sm: 1 }}
      rowHeight={rowHeight}
      isResizable={false}
      onWidthChange={handleWidthChange}
      isBounded
      margin={[16, 16]}
      // useCSSTransforms={false}
      onDragStart={(layout, oldItem, newItem, placeholder, e, element) =>
        handleDragStart(element)
      }
      onDragStop={(layout, oldItem, newItem, placeholder, e, element) =>
        handleDragStop(element)
      }
    >
      {/* <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4"> */}
        <div key='intro'><HeroBox key="intro"/></div>
        <div key="about-ctfs"><PFPBox key="about-ctfs"/></div>
      {/* </section> */}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
        <ProjectPreviewBox
          name="Project 1"
          description="Project 1 description"
          imageUrl="/project-1.png"
          bgColor="#e4e4e7"
          dark
          key="image-1"
        />
        <ProjectPreviewBox
          name="Project 2"
          description="Project 2 description"
          imageUrl="/project-2.png"
          bgColor="#e4e4e7"
          key="image-2"
        />
        <ProjectPreviewBox
          name="Project 3"
          description="Project 3 description"
          imageUrl="/project-3.png"
          bgColor="#e4e4e7"
          dark
        />
        <ProjectPreviewBox
          name="Project 4"
          description="Project 4 description"
          // imageUrl="/project-4.png"
          bgColor="#e4e4e7"
        />
        <ProjectPreviewBox
          name="Project 5"
          description="Project 5 description"
          // imageUrl="/project-5.png"
          bgColor="#e4e4e7"
          dark
        />
        <ProjectPreviewBox
          name="Project 6"
          description="Project 6 description"
          // imageUrl="/project-6.png"
          bgColor="#e4e4e7"
        />
      </section>
    </ResponsiveGridLayout>
  );
}
