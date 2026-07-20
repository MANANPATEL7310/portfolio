import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiGit,
  SiGithub,
  SiPostman,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiTensorflow,
  SiPytorch,
  SiJupyter,
  SiHuggingface,
  SiTypescript,
  SiJavascript,
  SiCplusplus,
  SiPython,
  SiLinux,
  SiUbuntu,
  SiDocker,
  SiFirebase,
  SiVercel,
  SiRender,
  SiBootstrap,
  SiWebrtc,
  SiSocketdotio,
  SiLangchain
} from "react-icons/si";

import { FaJava, FaAws } from "react-icons/fa";
import { TbBrandOpenai } from "react-icons/tb";

export const getTechIcon = (tech: string) => {
  const iconProps = { className: "w-3.5 h-3.5 inline-block mr-1.5 align-text-bottom" };
  
  // Wrapper for logos that are black or very dark, giving them a white background pad
  const DarkBgWrapper = ({ children }: { children: React.ReactNode }) => (
    <span className="bg-white/95 rounded-[3px] p-[1.5px] mr-1.5 inline-flex items-center justify-center">
      {children}
    </span>
  );

  const darkIconProps = { className: "w-3 h-3 inline-block" };

  switch (tech.toLowerCase()) {
    case "react":
      return <SiReact color="#61DAFB" {...iconProps} />;
    case "next.js":
      return (
        <DarkBgWrapper>
          <SiNextdotjs color="#000000" {...darkIconProps} />
        </DarkBgWrapper>
      );
    case "tailwind css":
      return <SiTailwindcss color="#06B6D4" {...iconProps} />;
    case "node.js":
      return <SiNodedotjs color="#339933" {...iconProps} />;
    case "express":
      return (
        <DarkBgWrapper>
          <SiExpress color="#000000" {...darkIconProps} />
        </DarkBgWrapper>
      );
    case "postgresql":
      return <SiPostgresql color="#4169E1" {...iconProps} />;
    case "mongodb":
      return <SiMongodb color="#47A248" {...iconProps} />;
    case "git":
      return <SiGit color="#F05032" {...iconProps} />;
    case "github":
      return (
        <DarkBgWrapper>
          <SiGithub color="#181717" {...darkIconProps} />
        </DarkBgWrapper>
      );
    case "postman":
      return <SiPostman color="#FF6C37" {...iconProps} />;
    case "scikit-learn":
      return <SiScikitlearn color="#F7931E" {...iconProps} />;
    case "pandas":
      return (
        <DarkBgWrapper>
          <SiPandas color="#150458" {...darkIconProps} />
        </DarkBgWrapper>
      );
    case "numpy":
      return (
        <DarkBgWrapper>
          <SiNumpy color="#013243" {...darkIconProps} />
        </DarkBgWrapper>
      );
    case "tensorflow":
      return <SiTensorflow color="#FF6F00" {...iconProps} />;
    case "pytorch":
      return <SiPytorch color="#EE4C2C" {...iconProps} />;
    case "jupyter":
      return <SiJupyter color="#F37626" {...iconProps} />;
    case "hugging face":
      return <SiHuggingface color="#FFD21E" {...iconProps} />;
    case "langchain":
      return (
        <DarkBgWrapper>
          <SiLangchain color="#1C3C3C" {...darkIconProps} />
        </DarkBgWrapper>
      );
    case "openai api":
      return (
        <DarkBgWrapper>
          <TbBrandOpenai color="#000000" {...darkIconProps} />
        </DarkBgWrapper>
      );
    case "typescript":
      return <SiTypescript color="#3178C6" {...iconProps} />;
    case "javascript":
      return <SiJavascript color="#F7DF1E" {...iconProps} />;
    case "c/c++":
    case "c++":
      return <SiCplusplus color="#00599C" {...iconProps} />;
    case "python":
      return <SiPython color="#3776AB" {...iconProps} />;
    case "java":
      return <FaJava color="#5382A1" {...iconProps} />;
    case "linux (ubuntu)":
    case "linux":
      return <SiLinux color="#FCC624" {...iconProps} />;
    case "ubuntu":
      return <SiUbuntu color="#E95420" {...iconProps} />;
    case "docker":
      return <SiDocker color="#2496ED" {...iconProps} />;
    case "aws":
      return <FaAws color="#FF9900" {...iconProps} />;
    case "firebase":
      return <SiFirebase color="#FFCA28" {...iconProps} />;
    case "vercel":
      return (
        <DarkBgWrapper>
          <SiVercel color="#000000" {...darkIconProps} />
        </DarkBgWrapper>
      );
    case "render":
      return <SiRender color="#46E3B7" {...iconProps} />;
    case "bootstrap":
      return <SiBootstrap color="#7952B3" {...iconProps} />;
    case "webrtc":
      return (
        <DarkBgWrapper>
          <SiWebrtc color="#333333" {...darkIconProps} />
        </DarkBgWrapper>
      );
    case "socket.io":
      return (
        <DarkBgWrapper>
          <SiSocketdotio color="#010101" {...darkIconProps} />
        </DarkBgWrapper>
      );
    default:
      return null;
  }
};
