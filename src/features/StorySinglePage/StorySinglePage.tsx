import { useEffect, useState } from "react";
import { Parallax } from "react-parallax";
import { Link } from "react-router-dom";
import storyImg from "../../assets/images/Story/storyBg.png";
import homeIcon from "../../assets/images/shared/home.png";
import useGetDecodedJWTValues from "../../hooks/Auth/useGetDecodedJWTValues";
import StoryHeroSection from "./StoryHero/StoryHeroSection";
import StoryAttributesSection from "./StoryAttributesSection/StoryAttributesSection";
import "../Editor/Flowchart/FlowchartStyles.css";
import StoryMainContent from "./StoryMainContent/StoryMainContent";
import StoryFooter from "./StoryFooter/StoryFooter";

export default function StorySinglePage() {
  const [showHomeIcon, setShowHomeIcon] = useState(false);
  const { userId } = useGetDecodedJWTValues();

  useEffect(() => {
    const handleScroll = () => {
      const yOffset = window.scrollY;
      if (yOffset > 100) {
        setShowHomeIcon(true);
      } else {
        setShowHomeIcon(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <main className="w-full overflow-y-auto relative | containerScorll">
      {/* <StorySinglePageHeader /> */}
      {/* <StorySinglePageMain /> */}
      <Link
        className={`${
          showHomeIcon ? "delay-100 opacity-100" : "opacity-0"
        } transition-all `}
        to={`/profile/${userId}`}
      >
        <img
          src={homeIcon}
          alt="Profile"
          draggable={false}
          className="fixed right-[0rem] top-[0rem] p-[.5rem] bg-secondary shadow-md rounded-bl-full w-[4.5rem] cursor-pointer z-[11]"
        />
      </Link>
      <Parallax
        blur={8}
        strength={200}
        bgImage={storyImg}
        bgImageAlt="Story Image"
        bgImageStyle={{
          objectFit: "fill",
          width: "100%",
          height: "100%",
        }}
        bgClassName="bg-center"
        className="min-h-screen w-full"
      >
        <StoryHeroSection />
      </Parallax>
      <StoryAttributesSection />
      <StoryMainContent />
      <StoryFooter />
    </main>
  );
}
