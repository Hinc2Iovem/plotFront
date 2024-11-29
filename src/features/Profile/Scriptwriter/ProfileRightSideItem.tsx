import { Link } from "react-router-dom";
import AssignScriptwriterModal from "./AssignScriptwriterModal";
import PreviewImage from "../../shared/utilities/PreviewImage";
import { useEffect, useState } from "react";
import useUpdateImg from "../../../hooks/Patching/useUpdateImg";
import { EpisodeStatusTypes } from "../../../types/StoryData/Episode/EpisodeTypes";
import { StoryFilterTypes } from "../../Story/Story";
import useGetDecodedJWTValues from "../../../hooks/Auth/useGetDecodedJWTValues";
import { useQueryClient } from "@tanstack/react-query";
import { getSeasonsByStoryId } from "../../../hooks/Fetching/Season/useGetSeasonsByStoryId";

type ProfileRightSideItemTypes = {
  storiesType: StoryFilterTypes;
  storyStatus?: EpisodeStatusTypes;
  storyId: string;
  setOpenedStoryId: React.Dispatch<React.SetStateAction<string>>;
  openedStoryId: string;
  setCharacterIds: React.Dispatch<React.SetStateAction<string[]>>;
  characterIds: string[];
  setShowScriptwriters: React.Dispatch<React.SetStateAction<boolean>>;
  showScriptwriters: boolean;
  assignedWorkers?:
    | {
        staffId: string;
        storyStatus: EpisodeStatusTypes;
      }[]
    | undefined;
  title: string;
  imgUrl: string;
};

export default function ProfileRightSideItem({
  characterIds,
  openedStoryId,
  setCharacterIds,
  setOpenedStoryId,
  storiesType,
  storyId,
  assignedWorkers,
  storyStatus,
  title,
  imgUrl,
  setShowScriptwriters,
  showScriptwriters,
}: ProfileRightSideItemTypes) {
  const { roles } = useGetDecodedJWTValues();
  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const uploadImgMutation = useUpdateImg({
    id: storyId,
    path: "/stories",
    preview: imagePreview,
  });
  const [isMounted, setIsMounted] = useState(false);
  const theme = localStorage.getItem("theme");

  useEffect(() => {
    if (isMounted && imagePreview) {
      uploadImgMutation.mutate({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const queryClient = useQueryClient();
  const prefetchSeason = () => {
    queryClient.prefetchQuery({
      queryKey: ["stories", storyId, "season", "language", "russian"],
      queryFn: () => getSeasonsByStoryId({ language: "russian", storyId }),
    });
  };
  return (
    <article
      onMouseEnter={prefetchSeason}
      onFocus={prefetchSeason}
      className={`w-full h-[26rem] ${
        theme === "light" ? "bg-secondary" : "bg-secondary-darker"
      } rounded-md shadow-sm relative flex flex-col justify-between`}
    >
      <div
        className={`relative border-[3px] w-full max-h-[23rem] rounded-md rounded-b-none h-full ${
          theme === "light" ? "bg-secondary border-secondary" : "bg-primary border-primary"
        } `}
      >
        {imgUrl ? (
          <img src={imgUrl} alt="StoryBg" className="w-full h-full object-cover absolute rounded-md" />
        ) : (
          <PreviewImage
            imgClasses="w-full h-full object-cover rounded-md absolute top-0 bottom-0 left-0 right-0 border-[2px] border-secondary"
            imagePreview={imagePreview}
            setPreview={setPreview}
          />
        )}
        <div
          className={`${
            (storyStatus && storiesType === "all") || storiesType === "allAssigned" ? "" : "hidden"
          } absolute top-[.5rem] right-[.5rem] bg-secondary rounded-md shadow-md p-[.5rem]`}
        >
          <p className={`text-[1.5rem] self-end text-text-light`}>
            Статус:{" "}
            <span className={`text-[1.4rem] ${storyStatus === "doing" ? "text-orange-400" : "text-green-400"}`}>
              {storyStatus === "doing" ? "В процессе" : "Завершена"}
            </span>
          </p>
        </div>
      </div>
      {roles?.includes("editor") || roles?.includes("headscriptwriter") ? (
        <AssignScriptwriterModal
          openedStoryId={openedStoryId}
          setOpenedStoryId={setOpenedStoryId}
          storyTitle={title}
          storyId={storyId}
          setCharacterIds={setCharacterIds}
          characterIds={characterIds}
          assignedWorkers={assignedWorkers}
          setShowScriptwriters={setShowScriptwriters}
          showScriptwriters={showScriptwriters}
        />
      ) : null}
      <Link
        to={`/stories/${storyId}`}
        className={`text-[1.5rem] hover:text-text-light text-text-dark transition-all ${
          theme === "light" ? "bg-secondary border-secondary" : "bg-primary border-primary"
        } w-full p-[1rem] rounded-b-md`}
      >
        {title.length > 25 ? title.substring(0, 25) + "..." : title}
      </Link>
    </article>
  );
}
