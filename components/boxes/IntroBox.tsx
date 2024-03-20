import React, { useState } from "react";
import ImageBox from "../assets/ImageBox";
// import Cursor from "../oldcursor";

const IntroBox = () => {
    const [isActive, setIsActive] = useState(false);
    const [introSilhouette, setIntroSilhouette] = useState(false);
  return (
    <div key="intro">
      <ImageBox
        src="gradient-bg.jpg"
        alt="Bento Intro Silhouette"
        fill
        className={`rounded-3xl object-cover transition-opacity duration-300 ${
          introSilhouette ? "opacity-100" : "opacity-0 delay-75"
        }`}
        skeletonClassName="rounded-3xl"
        noRelative
        unoptimized
        priority
      />
      <ImageBox
        src="gradient-bg.jpg"
        alt="Bento Intro"
        fill
        className={`rounded-3xl object-cover transition-opacity duration-300 ${
          introSilhouette ? "opacity-0 delay-75" : "opacity-100"
        }`}
        skeletonClassName="rounded-3xl"
        noRelative
        unoptimized
        priority
      />
      {/* <Cursor isActive={isActive} /> */}
    </div>
  );
};

export default IntroBox;
