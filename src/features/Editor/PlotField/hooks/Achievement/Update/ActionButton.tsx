import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import useCreateAchievementInsideCommandAchievement from "../CommandAchievement/useCreateAchievementInsideCommandAchievement";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useParams } from "react-router-dom";

type ActionButtonTypes = {
  plotfieldCommandId: string;
  text: string;
  setCurrentAchievement: React.Dispatch<
    React.SetStateAction<{
      textValue: string;
      id: string;
    }>
  >;
};

export default function ActionButton({ plotfieldCommandId, text, setCurrentAchievement }: ActionButtonTypes) {
  const { storyId } = useParams();
  const ref = useRef<HTMLButtonElement>(null);
  const createAchievement = useCreateAchievementInsideCommandAchievement({
    language: "russian",
    plotFieldCommandId: plotfieldCommandId,
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Button
      onClick={() => {
        const achievementId = generateMongoObjectId();
        setCurrentAchievement({ id: achievementId, textValue: text });
        createAchievement.mutate({ achievementId, storyId: storyId || "", text });
      }}
      className="outline"
      ref={ref}
    >
      Создать
    </Button>
  );
}
