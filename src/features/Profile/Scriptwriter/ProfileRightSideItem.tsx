import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSeasonsByStoryId } from "../../../hooks/Fetching/Season/useGetSeasonsByStoryId";
import useUpdateImg from "../../../hooks/Patching/useUpdateImg";
import { EpisodeStatusTypes } from "../../../types/StoryData/Episode/EpisodeTypes";
import PreviewImage from "../../../ui/shared/PreviewImage";

type ProfileRightSideItemTypes = {
  storyStatus?: EpisodeStatusTypes;
  storyId: string;
  title: string;
  description: string;
  imgUrl: string;
};

export default function ProfileRightSideItem({
  storyId,
  storyStatus,
  title,
  imgUrl,
  description,
}: ProfileRightSideItemTypes) {
  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const uploadImgMutation = useUpdateImg({
    id: storyId,
    path: "/stories",
    preview: imagePreview,
  });
  const [isMounted, setIsMounted] = useState(false);

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
      className={`w-full h-[210px] rounded-md flex gap-[10px] border-border border-[1px] bg-secondary`}
    >
      <div className={`relative w-1/2 rounded-md rounded-bl-none rounded-tl-none h-full`}>
        {imgUrl ? (
          <img src={imgUrl} alt="StoryBg" className="w-full h-full object-cover absolute rounded-md" />
        ) : (
          <PreviewImage
            imgClasses="w-full h-full object-cover rounded-md absolute top-0 bottom-0 left-0 right-0 bg-secondary"
            imagePreview={imagePreview}
            setPreview={setPreview}
          />
        )}
        <div
          className={`absolute bottom-[0rem] left-[0rem] ${
            storyStatus === "doing" ? "text-white bg-orange" : "text-white bg-green"
          } rounded-md rounded-bl-none rounded-tl-none p-[5px]`}
        >
          <p className={`text-[13px]`}>{storyStatus === "doing" ? "В процессе" : "Завершена"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-[10px] w-1/2 p-[10px]">
        <Link to={`/stories/${storyId}`} className={`text-[20px] text-heading hover:underline transition-all w-full`}>
          {title.length > 25 ? title.substring(0, 25) + "..." : title}
        </Link>
        <p className="text-[15px] text-paragraph">{description}</p>
      </div>
    </article>
  );
}
