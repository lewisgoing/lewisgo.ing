// components/boxes/IntroBox.tsx

import React, { useState } from 'react';
import ImageBox from '../assets/ImageBox';
// import Cursor from "../oldcursor";

const IntroBox = ({ introSilhouette }: { introSilhouette: boolean }) => {
  'use cache';
  return (
    <>
      <ImageBox
        src="/svg/grad1.svg"
        alt="Bento Intro Silhouette"
        fill
        className={`rounded-3xl object-cover transition-opacity duration-300 ${
          introSilhouette ? 'opacity-100' : 'opacity-0 delay-75'
        }`}
        skeletonClassName="rounded-3xl"
        noRelative
        unoptimized
        priority
      />
    </>
  );
};

export default IntroBox;
