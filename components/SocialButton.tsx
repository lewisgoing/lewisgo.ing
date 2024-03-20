import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  bgColor?: string | undefined;
  href: string;
}

const SocialButton: React.FC<Props> = ({ children, bgColor = "black", href }) => {
  let bgHoverColorClass;

  switch (bgColor) {
    case "instagram":
      bgHoverColorClass = "hover:bg-instagram";
      break;
    case "linkedin":
      bgHoverColorClass = "hover:bg-linkedin";
      break;
    case "github":
      bgHoverColorClass = "hover:bg-github";
      break;
    case "soundcloud":
      bgHoverColorClass = "hover:bg-soundcloud";
      break;
    default:
      bgHoverColorClass = "hover:bg-black";
      break;
  }

  return (
    <a
      href={href}
      className={`group h-12 w-12 bg-white ${bgHoverColorClass} rounded-full transition-colors duration-200 ease-in-out flex justify-center items-center`}
    >
      <div className="fill-black transition-colors duration-200 ease-in-out">
        {children}
      </div>
    </a>
  );
};

export default SocialButton;
