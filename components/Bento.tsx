import React from "react";

import HeroBox from "./boxes/HeroBox";
import PFPBox from "./boxes/PFPBox";
import ProjectPreviewBox from "./boxes/ProjectPreviewBox";

export default function Bento() {
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4">
        <HeroBox />
        <PFPBox />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
        <ProjectPreviewBox 
            name="Project 1"
            description="Project 1 description"
            imageUrl="/project-1.png"
            bgColor="#e4e4e7"
            dark
        />
        <ProjectPreviewBox 
            name="Project 2"
            description="Project 2 description"
            imageUrl="/project-2.png"
            bgColor="#e4e4e7"
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
    </>
  );
}
