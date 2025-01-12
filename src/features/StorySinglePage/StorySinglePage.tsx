import { Parallax } from "react-parallax";
import usePrepareStoryState from "./hooks/usePrepareStoryState";
import KeyBinds from "./KeyBinds/KeyBinds";
import StoryAttributesSection from "./StoryAttributesSection/StoryAttributesSection";
import StoryFooter from "./StoryFooter/StoryFooter";
import StoryHeroSection from "./StoryHero/StoryHeroSection";
import StoryMainContent from "./StoryMainContent/StoryMainContent";
import GoBackButton from "@/ui/Buttons/StoryPage/GoBackButton";
import useGetDecodedJWTValues from "@/hooks/Auth/useGetDecodedJWTValues";
import "../Editor/Flowchart/FlowchartStyles.css";

export default function StorySinglePage() {
  const { setStoryInfo, storyInfo } = usePrepareStoryState();
  const { userId } = useGetDecodedJWTValues();

  return (
    <main className="w-full overflow-y-auto relative | containerScorll">
      <Parallax
        blur={8}
        strength={200}
        bgImage={storyInfo.storyImg ? storyInfo.storyImg : ""}
        bgImageAlt="Story Image"
        bgImageStyle={{
          objectFit: "fill",
          width: "100%",
          height: "100%",
        }}
        bgClassName="bg-center"
        className="min-h-screen w-full bg-background relative"
      >
        <StoryHeroSection storyInfo={storyInfo} setStoryInfo={setStoryInfo} />
        <GoBackButton className="absolute bottom-0 left-0" link={`/profile/${userId}`} />
      </Parallax>
      <StoryAttributesSection />
      <StoryMainContent />
      <KeyBinds />
      <StoryFooter />
    </main>
  );
}
