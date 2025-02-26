// components/Bento.tsx

"use client";

import ShaderGradientBox from "./boxes/ShaderGradientBox";
// import ShaderParkReactiveBox from "../../marchWebsite/assets/ShaderParkBoxReactive";
import dynamic from "next/dynamic";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import React, { useEffect, useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";
import SoundcloudBox from "./boxes/SoundcloudBox"
import SkillsBox from "./boxes/SkillsBox";

import LottiePlayPauseButton from "../components/LottiePlayPauseButton";

const LottiePlayPauseWithNoSSR = dynamic(
  () => import("../components/LottiePlayPauseButton"),
  {
    ssr: false,
  }
);

import AudioBox from "./boxes/AudioBox";
import IntroBox from "./boxes/IntroBox";

import Image from "./assets/ImageBox";
import NextImage from "next/image";
import { lgLayout, mdLayout, smLayout } from "../scripts/utils/bento-layouts";

import ProjectPreviewBox from "./boxes/ProjectPreviewBox";

import { Skeleton } from "./shadcn/skeleton";
import {
  FaLinkedin,
  FaCompactDisc,
  FaMusic,
  FaGithub,
  FaCaretSquareUp,
  FaAngleDoubleRight,
  FaAngleDoubleLeft,
  FaBackward,
  FaDiscord,
  FaSpotify,
  FaSoundcloud,
} from "react-icons/fa";
import { useLanyard } from "react-use-lanyard";

import DiscordPresence from "./boxes/DiscordStatusBox";
import ExternalLink from "./assets/ExternalLink";
import GithubCalendar from "./boxes/GithubCalendar";
import SilhouetteHover from "./boxes/SilhouetteHover";
import SpotifyStatusBox from "./boxes/SpotifyBox";

import { Responsive, WidthProvider } from "react-grid-layout";
import { Odor_Mean_Chey } from "next/font/google";
import { Button } from "@/components/shadcn/button.tsx";
import GithubBox from "./boxes/GithubBox";

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  bot: boolean;
  // Add other properties as needed
}

interface LanyardData {
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_web: boolean;
  activities: any[]; // Adjust the type according to your data structure
  discord_status: string; // Include discord_status here
  discord_user: DiscordUser;
  kv: {
    spotify_last_played: string; // or any other type as per your data structure
  };
  listening_to_spotify: boolean;
  spotify: null; // or the correct type if spotify data is available
}

interface LanyardResponse {
  data: LanyardData;
  // Include any other top-level properties of the Lanyard response
}

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Bento() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  const audio = "./test.mp3";
  useEffect(() => {
    setAudioPlayer(new Audio(audio));
  }, []);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const lanyard = useLanyard({
    userId: "661068667781513236",
    // userId: process.env.NEXT_PUBLIC_DISCORD_USER_ID,
  });

  // useEffect(() => {
  //   // if (lanyard.data && !lanyard.isValidating) {
  //     // Lanyard data is valid
  //     // Add your validation logic here
  //     // Example:

  //     // if (lanyard.data.data.discord_status === "online") {
  //       // console.log("Lanyard data is valid", lanyard.data);
  //       // console.log("User is online");
  //     // } else {
  //       // console.log("User is offline", lanyard.data.data.discord_status);
  //     // }
  //   // } else {
  //     // Lanyard data is not available or still validating
  //     // Add your error handling logic here
  //     // Example:
  //     // console.log("Lanyard data is not available or still validating");
  //   }
  // }, [lanyard.data, lanyard.isValidating]);

  const [introSilhouette, setIntroSilhouette] = useState(false);

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isDiscordLoaded, setDiscordLoaded] = useState(false);
  const [isSpotifyLoaded, setIsSpotifyLoaded] = useState(false);

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
    <>
      <ResponsiveGridLayout
        className="mx-auto max-w-[375px] bento-md:max-w-[800px] bento-lg:max-w-[1200px]"
        layouts={{ lg: lgLayout, md: mdLayout, sm: smLayout }}
        // I don't know why but if I don't subtract 1 everything shits itself
        breakpoints={{ lg: 1199, md: 799, sm: 374 }}
        cols={{ lg: 4, md: 4, sm: 2 }}
        rowHeight={rowHeight}
        isResizable={false}
        isDraggable={false} 
        onWidthChange={handleWidthChange}
        isBounded
        margin={[16, 16]}
        useCSSTransforms={false}
        onDragStart={(layout, oldItem, newItem, placeholder, e, element) =>
          handleDragStart(element)
        }
        onDragStop={(layout, oldItem, newItem, placeholder, e, element) =>
          handleDragStop(element)
        }
      >
        <div key="intro">
          {/* <p className="pl-10">intro</p> */}
                                <Image
                src="/svg/lewis-card-hover-4.svg"
                alt="Bento Intro Silhouette"
                fill
                className={`rounded-3xl object-cover `}
                skeletonClassName="rounded-3xl"
                noRelative
                unoptimized
                priority
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 2}}
              />

            <ShaderGradientBox
                className={`rounded-3xl object-cover transition-opacity duration-300 skeleton rounded-3xl`}
            animate="on" // Disable animation to make the component non-reactive to interactions.
            control="props" // Control the component entirely through props.
            positionX={0}
            positionY={0}
            positionZ={0}
            rotationX={0} // Ensure the gradient does not rotate in response to user clicks.
            rotationY={10}
            rotationZ={50}
            // color1="#893D63"
            // color2="#9E59B6"
            // color3="#7060CF"
            color1="#FF0006"
            color2="#003FFF"
            color3="#4AA6FF"
            wireframe={false}
            shader="defaults" // Use a default shader that does not react to user input.
            type="sphere" // Example; adjust as needed.
            uAmplitude={1.4}
            uDensity={1.2}
            uFrequency={1.5}
            uSpeed={0.04}
            uStrength={1.4}
            cDistance={10}
            cameraZoom={20}
            cAzimuthAngle={0}
            cPolarAngle={90}
            uTime={2} // Static time value to ensure the gradient's appearance is fixed.
            lightType="3d" // Example lighting; adjust as needed.
            envPreset="dawn"
            reflection={0.4}
            brightness={1.9}
            grain="off" // Disable grain effect for static appearance.
            toggleAxis={false} // Ensure axis toggling does not react to user input.
            hoverState="off"
            // skeletonClassName="rounded-3xl"
            />
              </div>





        <div
          key="github"
          className="group"
          onMouseEnter={() => setIntroSilhouette(true)}
          onMouseLeave={() => setIntroSilhouette(false)}
        >
          <GithubBox />
        </div>
        <div key="tall-gradient" className="h-full w-full overflow-hidden">
            <ShaderGradientBox
                className={`rounded-3xl object-cover transition-opacity duration-300 skeleton`}
            animate="on" // Disable animation to make the component non-reactive to interactions.
            control="props" // Control the component entirely through props.
            positionX={1}
            positionY={0}
            positionZ={2}
            rotationX={1} // Ensure the gradient does not rotate in response to user clicks.
            rotationY={10}
            rotationZ={50}
            // color1="#893D63"
            // color2="#9E59B6"
            // color3="#7060CF"
            color1="#FF0006"
            color2="#003FFF"
            color3="#4AA6FF"
            wireframe={false}
            shader="defaults" // Use a default shader that does not react to user input.
            type="plane" // Example; adjust as needed.
            uAmplitude={1.4}
            uDensity={1.2}
            uFrequency={1.5}
            uSpeed={0.08}
            uStrength={1.4}
            cDistance={10}
            cameraZoom={29}
            cAzimuthAngle={30}
            cPolarAngle={90}
            uTime={2} // Static time value to ensure the gradient's appearance is fixed.
            lightType="3d" // Example lighting; adjust as needed.
            envPreset="dawn"
            reflection={0.4}
            brightness={1.5}
            grain="off" // Disable grain effect for static appearance.
            toggleAxis={false} // Ensure axis toggling does not react to user input.
            hoverState="off"
            // skeletonClassName="rounded-3xl"
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

        {/* <div
          key="latest-post"
          className="group"
          onMouseEnter={() => setIntroSilhouette(true)}
          onMouseLeave={() => setIntroSilhouette(false)}
        > */}
          {/* <div className="flex flex-row "> */}
          {/* <ShaderGradientBox
            className="rounded-3xl object-cover"
            animate="on" // Disable animation to make the component non-reactive to interactions.
            control="props" // Control the component entirely through props.
            positionX={0}
            positionY={0}
            positionZ={0}
            rotationX={0} // Ensure the gradient does not rotate in response to user clicks.
            rotationY={10}
            rotationZ={50}
            // color1="#893D63"
            // color2="#9E59B6"
            // color3="#7060CF"
            color1="#FF0006"
            color2="#003FFF"
            color3="#4AA6FF"
            wireframe={false}
            shader="defaults" // Use a default shader that does not react to user input.
            type="sphere" // Example; adjust as needed.
            uAmplitude={1.4}
            uDensity={1.2}
            uFrequency={1.5}
            uSpeed={0.04}
            uStrength={1.4}
            cDistance={10}
            cameraZoom={20}
            cAzimuthAngle={0}
            cPolarAngle={90}
            uTime={2} // Static time value to ensure the gradient's appearance is fixed.
            lightType="3d" // Example lighting; adjust as needed.
            envPreset="dawn"
            reflection={0.4}
            brightness={1.9}
            grain="off" // Disable grain effect for static appearance.
            toggleAxis={false} // Ensure axis toggling does not react to user input.
            hoverState="off"
            /> */}
            {/* <span className="text-right">AudioPlayer</span> */}

          {/* </div> */}
          {/* <SilhouetteHover
            silhouetteSrc=""
            silhouetteAlt=""
            mainSrc="/svg/intro-paragraph.svg"
            mainAlt="Bento Latest Post"
            className="rounded-3xl object-cover"
          ></SilhouetteHover> */}
          {/* <>
            <div className="flex flex-row w-full h-full" style={{border: '1px solid red'}}>
              <div className="flex flex-col items-center w-1/4 h-full" style={{border: '1px solid red' }}>
                <div className="uppergfx" style={{border: '1px solid red' }}></div>
                <div className="player-controls" style={{border: '1px solid red' }}>
                  <div className="tracklengthbar" style={{border: '1px solid red' }}></div>
                  <div className="buttons" style={{border: '1px solid red' }}>
                  <div className="back"></div>
                  <div className="playpause"></div>
                  <div className="next"></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center w-3/4 h-full" style={{border: '1px solid red'}}></div>
            </div>
          </>
          <> */}
          {/* <div className="flex flex-col w-full h-full">
              <div
                className="flex flex-col items-center w-1/2"
                style={{ border: "1px solid red" }}
              >
                <div className="w-full">Header</div>
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div className="w-full">Avatar</div>
                <div className="w-full flex justify-center">Discord Icon</div>
                <div className="w-full">Username</div>
              </div>
              <div className="flex flex-col items-center w-full bg-tertiary/50">
                <div className="w-full p-2">Badges</div>
                <div className="w-full p-2">Main Activity Placeholder</div>
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="w-full p-2">Additional Info Placeholder</div>
              </div>
            </div> */}

          {/*
          <div className="relative flex h-full w-full items-center justify-center rounded-lg">
            <button onClick={togglePlay}>
              <Image
                src={
                  isPlaying ? "./svg/player/pause.svg" : "./svg/player/play.svg"
                }
                alt="play"
                width={20}
                height={20}
              />
            </button>
          </div>
          <p>Projects</p> */}
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
          {/* <ExternalLink href="/#" newTab={false} /> */}
          {/* <ExternalLink href={posts[0].path} newTab={false} /> */}
        {/* </div> */}
        {/* <div key="image-2"> */}
          {/* <Image
            src="/svg/image-2.svg"
            alt="Bento Box 2"
            fill
            className="rounded-3xl object-cover"
            skeletonClassName="rounded-3xl"
            noRelative
            unoptimized
            priority
          /> */}
                    {/* <ShaderGradientBox
            className="rounded-3xl object-cover"
            animate="on" // Disable animation to make the component non-reactive to interactions.
            control="props" // Control the component entirely through props.
            positionX={0}
            positionY={0}
            positionZ={0}
            rotationX={0} // Ensure the gradient does not rotate in response to user clicks.
            rotationY={10}
            rotationZ={50}
            // color1="#893D63"
            // color2="#9E59B6"
            // color3="#7060CF"
            color1="#FF0006"
            color2="#003FFF"
            color3="#4AA6FF"
            wireframe={false}
            shader="defaults" // Use a default shader that does not react to user input.
            type="plane" // Example; adjust as needed.
            uAmplitude={1.4}
            uDensity={1.2}
            uFrequency={1.5}
            uSpeed={0.1}
            uStrength={2.4}
            cDistance={10}
            cameraZoom={10}
            cAzimuthAngle={0}
            cPolarAngle={90}
            uTime={2} // Static time value to ensure the gradient's appearance is fixed.
            lightType="3d" // Example lighting; adjust as needed.
            envPreset="dawn"
            reflection={0.4}
            brightness={1.9}
            grain="off" // Disable grain effect for static appearance.
            toggleAxis={false} // Ensure axis toggling does not react to user input.
            hoverState="off"
            /> */}
          {/* 
          <ShaderGradientCanvas
            importedFiber={{ ...fiber, ...drei, ...reactSpring }}
            style={{
              position: "absolute",
              top: 0,
            }}
          >
            <ShaderGradient
              control="query"
              urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=1&color1=%2352ff89&color2=%23dbba95&color3=%23d0bce1&embedMode=off&envPreset=city&fov=45&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=0&shader=defaults&type=plane&uDensity=1.3&uFrequency=5.5&uSpeed=0.4&uStrength=4&uTime=0&wireframe=false&zoomOut=false"
            />
          </ShaderGradientCanvas> */}
          {/* <ShaderGradientBox
            className="rounded-3xl object-cover grayscale"
            animate="on" // Disable animation to make the component non-reactive to interactions.
            control="props" // Control the component entirely through props.
            positionX={-1.4}
            positionY={0}
            positionZ={0}
            rotationX={0} // Ensure the gradient does not rotate in response to user clicks.
            rotationY={10}
            rotationZ={50}
            color1="#893D63"
            color2="#9E59B6"
            color3="#7060CF"
            wireframe={false}
            shader="defaults" // Use a default shader that does not react to user input.
            type="plane" // Example; adjust as needed.
            uAmplitude={1.4}
            uDensity={1.3}
            uFrequency={5.5}
            uSpeed={0.4}
            uStrength={4}
            cDistance={3.6}
            cameraZoom={45}
            cAzimuthAngle={0}
            cPolarAngle={90}
            uTime={1} // Static time value to ensure the gradient's appearance is fixed.
            lightType="env" // Example lighting; adjust as needed.
            envPreset="dawn"
            reflection={0.4}
            brightness={0.9}
            grain="on" // Disable grain effect for static appearance.
            toggleAxis={false} // Ensure axis toggling does not react to user input.
            hoverState="off"
          /> */}
          {/* <ShaderGradientCanvas
            importedFiber={{ ...fiber, ...drei, ...reactSpring }}
            style={{
              position: "absolute",
              top: 0,
              rounded: "3xl",
              pointerEvents: "none",
            }}
            className="rounded-3xl grayscale"
          >
            <ShaderGradient
              animate="on" // Disable animation to make the component non-reactive to interactions.
              control="props" // Control the component entirely through props.
              positionX={-1.4}
              positionY={0}
              positionZ={0}
              rotationX={0} // Ensure the gradient does not rotate in response to user clicks.
              rotationY={10}
              rotationZ={50}
              color1="#893D63"
              color2="#9E59B6"
              color3="#7060CF"
              wireframe={false}
              shader="defaults" // Use a default shader that does not react to user input.
              type="plane" // Example; adjust as needed.
              uAmplitude={1.4}
              uDensity={1.3}
              uFrequency={5.5}
              uSpeed={0.4}
              uStrength={4}
              cDistance={3.6}
              cameraZoom={45}
              cAzimuthAngle={0}
              cPolarAngle={90}
              uTime={1} // Static time value to ensure the gradient's appearance is fixed.
              lightType="env" // Example lighting; adjust as needed.
              envPreset="dawn"
              reflection={0.4}
              brightness={0.9}
              grain="on" // Disable grain effect for static appearance.
              toggleAxis={false} // Ensure axis toggling does not react to user input.
              hoverState="off"
            /> */}
          {/* <ShaderGradient animate="on" type="waterPlane" range={"disabled"} uTime={0} uSpeed={0.05} uStrength={1.5} uDensity={1.5} uFrequency={0} uAmplitude={0} positionX={0} positionY={0} positionZ={0} rotationX={0} rotationY={0} rotationZ={0} color3="#cdadff" color2="#dbf3ff" color1="#ffffff" reflection={0.5} wireframe={false} shader="defaults" lightType="3d" grain="off" cameraZoom={1} cDistance={5} cAzimuthAngle={0} cPolarAngle={90} brightness={1.2} envPreset={"city"} /> */}
          {/* </ShaderGradientCanvas> */}
          {/* <p>Image/Animation</p> */}
        {/* </div> */}
        {/* <div
          key="about-ctfs"
          className="group bg-[url('/static/images/bento/bento-about-ctfs-bg.svg')] bg-cover bg-center"
          onMouseEnter={() => setIntroSilhouette(true)}
          onMouseLeave={() => setIntroSilhouette(false)}
        >
          <p>About Me/Interests</p> */}
        {/* <SilhouetteHover
            silhouetteSrc="/static/images/bento/bento-about-ctfs-silhouette.svg"
            silhouetteAlt="Bento About CTFs Silhouette"
            mainSrc="/static/images/bento/bento-about-ctfs.svg"
            mainAlt="Bento About CTFs"
            className="rounded-3xl object-cover"
          /> */}
        {/* </div> */}
        <div
          key="audiobox"
          className="group bg-[url('/static/images/bento/bento-about-ctfs-bg.svg')] bg-cover bg-center"
          onMouseEnter={() => setIntroSilhouette(true)}
          onMouseLeave={() => setIntroSilhouette(false)}
        >
          <AudioBox />
        </div>
        <div
          key="twitter"
          className="group"
          onMouseEnter={() => setIntroSilhouette(true)}
          onMouseLeave={() => setIntroSilhouette(false)}
        >
        <SoundcloudBox />
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
        <div key="tech" style={{ display: "flex", justifyContent: "center" }}>
          <SkillsBox />
          {/* <div style={{ textAlign: "center" }}>
          <div className="text-black uppercase font-bold">Skills</div>
            <div className="text-[10px] text-muted-foreground">Made using NextJS, TailwindCSS. Deployed using Vercel</div>

          </div> */}
        </div>
        {/* <div key="tech">
          <Image
            src="/static/images/bento/bento-technologies.svg"
            alt="Bento Technologies"
            fill
            className="rounded-3xl object-cover"
            skeletonClassName="rounded-3xl"
            noRelative
            unoptimized
          />
        </div> */}
        <div
          key="contributions"
          className="group flex items-center justify-center"
          onMouseEnter={() => setIntroSilhouette(true)}
          onMouseLeave={() => setIntroSilhouette(false)}
        >
          {/* <SilhouetteHover
                    silhouetteSrc="svg/contri1.svg"
                    silhouetteAlt="Bento GitHub Contributions Silhouette"
                    mainSrc="svg/contri0.svg"
                    mainAlt="Bento GitHub Contributions"
                    className="rounded-3xl object-cover z-[2] flex items-center justify-center p-4"
                > */}
          <GithubCalendar
            username="lewisgoing"
            hideColorLegend
            hideTotalCount
            blockMargin={6}
            blockSize={20}
            blockRadius={7}
          />
          {/* </SilhouetteHover> */}
        </div>

        {/* <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4"> */}
        {/* <div key="intro">
        <HeroBox key="intro" />
      </div>
      <div key="audiobox">
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
          key="tall-gradient"
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
