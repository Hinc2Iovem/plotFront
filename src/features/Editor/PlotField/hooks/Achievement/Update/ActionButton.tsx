import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import useCreateAchievementInsideCommandAchievement from "../CommandAchievement/useCreateAchievementInsideCommandAchievement";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { toastSuccessStyles } from "@/components/shared/toastStyles";

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
        toast.dismiss();
        const achievementId = generateMongoObjectId();
        setCurrentAchievement({ id: achievementId, textValue: text });
        createAchievement.mutate({ achievementId, storyId: storyId || "", text });
        toast("Ачивка создана", toastSuccessStyles);
      }}
      className={`outline-white focus-within:bg-white focus-within:shadow-md focus-within:animate-pulse focus-within:shadow-white hover:bg-white focus-within:text-black hover:text-black text-white transition-all`}
      ref={ref}
    >
      Создать
    </Button>
  );
}
