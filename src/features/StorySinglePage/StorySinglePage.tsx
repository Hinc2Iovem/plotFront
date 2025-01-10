import { useEffect, useState } from "react";
import { Parallax } from "react-parallax";
import storyImg from "../../assets/images/Story/storyBg.png";
import usePrepareStoryState from "./hooks/usePrepareStoryState";
import KeyBinds from "./KeyBinds/KeyBinds";
import StoryAttributesSection from "./StoryAttributesSection/StoryAttributesSection";
import StoryFooter from "./StoryFooter/StoryFooter";
import StoryHeroSection from "./StoryHero/StoryHeroSection";
import StoryMainContent from "./StoryMainContent/StoryMainContent";
import "../Editor/Flowchart/FlowchartStyles.css";

export default function StorySinglePage() {
  const [showHomeIcon, setShowHomeIcon] = useState(false);

  const { setStoryInfo, storyInfo } = usePrepareStoryState();

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
      <Parallax
        blur={8}
        strength={200}
        bgImage={storyInfo.storyImg ? storyImg : ""}
        bgImageAlt="Story Image"
        bgImageStyle={{
          objectFit: "fill",
          width: "100%",
          height: "100%",
        }}
        bgClassName="bg-center"
        className="min-h-screen w-full bg-background"
      >
        <StoryHeroSection storyInfo={storyInfo} setStoryInfo={setStoryInfo} />
      </Parallax>
      <StoryAttributesSection />
      <StoryMainContent />
      <KeyBinds />
      <StoryFooter />
    </main>
  );
}
