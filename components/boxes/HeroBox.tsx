import React from "react";
import SocialButton from "../SocialButton";

import LinkedIn from "../../public/svg/linkedin.svg";
import Instagram from "../../public/svg/instagram.svg";
import GitHub from "../../public/svg/github.svg";
import SoundCloud from "../../public/svg/soundcloud.svg";

const HeroBox = () => {
  return (
    <>
      <div className="h-[30rem] rounded-3xl p-10 flex flex-col gap-16 bg-[url('/gradient-bg.jpg')] bg-cover">
        <h1 className="text-4xl font-semibold">
          Hi, I'm Lewis Going 👋 
          {/* <br /> Full-stack developer & Creative */}
        </h1>
        <p className="flex-1">
          - Third-year student at the University of Washington, studying Informatics with a focus in Software Developement & Human-Computer Interaction. <br /> 
{/*         
          - Passionate about creating things that are both functional and beautiful. <br /> 
          - Currently seeking internship opportunities for Summer 2025.  */}
        </p>
        <div className="flex flex-col lg:flex-row items-center gap-4 justify-self-end">
          <button className="bg-black text-white font-medium py-3 px-12 rounded-full w-60 lg:w-auto">
            Contact me
          </button>
          <div className="flex items-center gap-4">
            <SocialButton bgColor="instagram" href="https://instagram.com/lewisgoing">
              <Instagram className="w-5 h-5" />
            </SocialButton>
            <SocialButton bgColor="linkedin" href="https://linkedin.com/in/lewisgoing">
              <LinkedIn className="w-5 h-5" />
            </SocialButton>
            <SocialButton bgColor="github" href="https://github.com/lewisgoing">
              <GitHub className="w-5 h-5" />
            </SocialButton>
            <SocialButton bgColor="soundcloud" href="https://soundcloud.com/lewisgoing">
              <SoundCloud className="w-5 h-5" />
            </SocialButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroBox;
