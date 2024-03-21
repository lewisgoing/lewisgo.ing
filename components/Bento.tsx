"use client";

import React, { useEffect, useState } from "react";

import IntroBox from "./boxes/IntroBox";
import AudioVisualizerBox from "./boxes/AudioVisualizerBox";

import Image from "./assets/ImageBox";
import { lgLayout, mdLayout, smLayout } from "../scripts/utils/bento-layouts";

import HeroBox from "./boxes/HeroBox";
import PFPBox from "./boxes/PFPBox";
import ProjectPreviewBox from "./boxes/ProjectPreviewBox";

import { Skeleton } from "./shadcn/skeleton";
import {
  FaLinkedin,
  FaGithub,
  FaDiscord,
  FaSpotify,
  FaSoundcloud,
} from "react-icons/fa";
import { useLanyard } from "react-use-lanyard";

import DiscordPresence from './boxes/DiscordStatusBox'
import ExternalLink from "./assets/ExternalLink";
import GithubCalendar from "./boxes/GithubCalendar";
import SilhouetteHover from "./boxes/SilhouetteHover";
import SpotifyStatusBox from './boxes/SpotifyBox'

import { Responsive, WidthProvider } from "react-grid-layout";
import { Odor_Mean_Chey } from "next/font/google";

const ResponsiveGridLayout = WidthProvider(Responsive, {
  measureBeforeMount: true,
});

export default function Bento() {
    const lanyard = useLanyard({
        userId: '661068667781513236',
        // userId: process.env.NEXT_PUBLIC_DISCORD_USER_ID,
    })

    useEffect(() => {
      if (lanyard.data && !lanyard.isValidating) {
        // Lanyard data is valid
        // Add your validation logic here
        // Example: 
        if (lanyard.data.status === 'online') {
          console.log('User is online');
        } else {
          console.log('User is offline', lanyard.data);
        }
      } else {
        // Lanyard data is not available or still validating
        // Add your error handling logic here
        // Example:
        console.log('Lanyard data is not available or still validating');
      }
    }, [lanyard.data, lanyard.isValidating]);

  const [introSilhouette, setIntroSilhouette] = useState(false);

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isDiscordLoaded, setDiscordLoaded] = useState(false)
  const [isSpotifyLoaded, setIsSpotifyLoaded] = useState(false)

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

  const audioFile = "/test.mp3";

  return (
    <>
      <ResponsiveGridLayout
        className="mx-auto max-w-[375px] bento-md:max-w-[800px] bento-lg:max-w-[1200px]"
        layouts={{ lg: lgLayout, md: mdLayout, sm: smLayout }}
        // I don't know why but if I don't subtract 1 everything shits itself
        breakpoints={{ lg: 1199, md: 799, sm: 374 }}
        cols={{ lg: 4, md: 4, sm: 2 }}
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
        <div key="intro">
          <Image
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
          <Image
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
        </div>
        {/* <div key="intro"><IntroBox introSilhouette={introSilhouette}/></div> */}

        <div
          key="github"
          className="group"
          onMouseEnter={() => setIntroSilhouette(true)}
          onMouseLeave={() => setIntroSilhouette(false)}
        >
          <div className="relative flex h-full w-full items-center justify-center rounded-lg">
            <FaGithub className="absolute z-[1] text-primary w-20 h-20 bento-md:w-24 bento-md:h-24" />
            <SilhouetteHover
              silhouetteSrc="/static/images/bento/bento-github-silhouette.svg"
              silhouetteAlt="Bento Github Silhouette"
              mainSrc="../public/images/github.svg"
              mainAlt="Bento Github"
              className="rounded-3xl object-cover"
            />
            <ExternalLink href="https://github.com/lewisgoing" />
          </div>
        </div>
        <div key="image-1">
          <Image
            src="/static/images/bento/bento-image-1.svg"
            alt="Bento Box 1"
            fill
            noRelative
            className="rounded-3xl object-cover"
            skeletonClassName="rounded-3xl"
            unoptimized
            priority
          />
        </div>
        <div key="discord">
          {lanyard.data && !lanyard.isValidating ? ( // lanyard.data && !lanyard.isValidating ? (
            <DiscordPresence
              lanyard={lanyard.data}
              onLoad={() => setDiscordLoaded(true)}
            />
          ) : (
            <Skeleton className="w-full h-full rounded-3xl" />
          )}
        </div>

        <div
          key="latest-post"
          className="group"
          onMouseEnter={() => setIntroSilhouette(true)}
          onMouseLeave={() => setIntroSilhouette(false)}
        >
          {/* <SilhouetteHover
            silhouetteSrc="/static/images/bento/bento-latest-post-silhouette.svg"
            silhouetteAlt="Bento Latest Post Silhouette"
            mainSrc="/static/images/bento/bento-latest-post.svg"
            mainAlt="Bento Latest Post"
            className="rounded-3xl object-cover"
          > */}
            {/* <Image
              src="../public/gradient-bg.jpg"
              alt="posts 1"
              // src={posts[0].images[0]}
              // alt={posts[0].title}
              width={0}
              height={0}
              className="m-2 w-[80%] rounded-2xl border border-border bento-md:m-3 bento-lg:m-4"
              skeletonClassName="rounded-3xl"
              noRelative
              unoptimized
            /> */}
                        {/* <div className="m-2 w-[80%] rounded-2xl border border-border bento-md:m-3 bento-lg:m-4" skeletonClassName="rounded-3xl"> */}
              {/* <AudioVisualizerBox audioFile={audioFile} width="100%" height="100%" /> */}
            {/* </div> */}

           {/* FIT AUDIOVISUALIZERBOX HERE */}
          {/* </SilhouetteHover> */}
          <ExternalLink href="/#" newTab={false} />
          {/* <ExternalLink href={posts[0].path} newTab={false} /> */}
        </div>
        <div key="image-2">
          <Image
            src="/static/images/bento/bento-image-2.svg"
            alt="Bento Box 2"
            fill
            className="rounded-3xl object-cover"
            skeletonClassName="rounded-3xl"
            noRelative
            unoptimized
            priority
          />
        </div>
        <div
          key="about-ctfs"
          className="group bg-[url('/static/images/bento/bento-about-ctfs-bg.svg')] bg-cover bg-center"
          onMouseEnter={() => setIntroSilhouette(true)}
          onMouseLeave={() => setIntroSilhouette(false)}
        >
          <SilhouetteHover
            silhouetteSrc="/static/images/bento/bento-about-ctfs-silhouette.svg"
            silhouetteAlt="Bento About CTFs Silhouette"
            mainSrc="/static/images/bento/bento-about-ctfs.svg"
            mainAlt="Bento About CTFs"
            className="rounded-3xl object-cover"
          />
        </div>
        <div
          key="twitter"
          className="group"
          onMouseEnter={() => setIntroSilhouette(true)}
          onMouseLeave={() => setIntroSilhouette(false)}
        >
          <div className="relative flex h-full w-full items-center justify-center rounded-lg">
            <FaSoundcloud className="absolute z-[1] text-primary w-20 h-20 bento-md:w-24 bento-md:h-24" />
            <SilhouetteHover
              silhouetteSrc="/static/images/bento/bento-twitter-silhouette.svg"
              silhouetteAlt="Bento Twitter Silhouette"
              mainSrc="/static/images/bento/bento-twitter.svg"
              mainAlt="Bento Twitter"
              className="rounded-3xl object-cover"
            />
            <ExternalLink href="https://twitter.com/enscry" />
          </div>
        </div>
        <div
          key="spotify"
          className="group"
          onMouseEnter={() => setIntroSilhouette(true)}
          onMouseLeave={() => setIntroSilhouette(false)}
        >
            {lanyard.data && !lanyard.isValidating ? (
            <SpotifyStatusBox
              lanyard={lanyard.data}
              onLoad={() => setIsSpotifyLoaded(true)}
            />
          ) : (
            <Skeleton className="w-full h-full rounded-3xl z-[1]" />
          )}
          {/* <SilhouetteHover
            silhouetteSrc="/static/images/bento/bento-spotify-silhouette.svg"
            silhouetteAlt="Bento Spotify Silhouette"
            mainSrc="/static/images/bento/bento-spotify.svg"
            mainAlt="Bento Spotify"
            className="hidden bento-lg:block object-cover rounded-3xl ml-auto"
          />
          <SilhouetteHover
            silhouetteSrc="/static/images/bento/bento-spotify-silhouette-2x1.svg"
            silhouetteAlt="Bento Spotify Silhouette"
            mainSrc="/static/images/bento/bento-spotify-2x1.svg"
            mainAlt="Bento Spotify"
            className="block bento-lg:hidden object-cover rounded-3xl ml-auto"
          /> */}
        </div>
        <div key="tech">
          <Image
            src="/static/images/bento/bento-technologies.svg"
            alt="Bento Technologies"
            fill
            className="rounded-3xl object-cover"
            skeletonClassName="rounded-3xl"
            noRelative
            unoptimized
          />
        </div>
        <div
          key="contributions"
          className="group flex items-center justify-center"
          onMouseEnter={() => setIntroSilhouette(true)}
          onMouseLeave={() => setIntroSilhouette(false)}
        >
          <SilhouetteHover
                    silhouetteSrc="svg/contri1.svg"
                    silhouetteAlt="Bento GitHub Contributions Silhouette"
                    mainSrc="svg/contri0.svg"
                    mainAlt="Bento GitHub Contributions"
                    className="rounded-3xl object-cover z-[2] flex items-center justify-center p-4"
                >
          <GithubCalendar
            username="lewisgoing"
            hideColorLegend
            hideTotalCount
            blockMargin={6}
            blockSize={20}
            blockRadius={7}
          />
          </SilhouetteHover>
        </div>

        {/* <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4"> */}
        {/* <div key="intro">
        <HeroBox key="intro" />
      </div>
      <div key="about-ctfs">
        <PFPBox key="about-ctfs" />
      </div> */}
        {/* </section> */}

        {/* <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
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
      </section> */}
      </ResponsiveGridLayout>
    </>
  );
}
