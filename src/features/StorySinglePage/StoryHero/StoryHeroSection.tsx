import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import keyButton from "../../../assets/images/Story/keyButton.png";
import { getAllCharacters } from "../../../hooks/Fetching/Character/useGetAllCharactersByStoryId";
import { getSeasonsByStoryId } from "../../../hooks/Fetching/Season/useGetSeasonsByStoryId";
import { getTranslationCharacters } from "../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useUpdateImg from "../../../hooks/Patching/useUpdateImg";
import SyncLoad from "../../../ui/Loaders/SyncLoader";
import PreviewImage from "../../../ui/shared/PreviewImage";
import { handleUploadeImg } from "../../../utils/handleUploadImg";

type StoryInfoTypes = {
  storyName: string;
  storyDescription: string;
  storyGenre: string;
  storyImg: string;
};

type StoryHeroSectionTypes = {
  setStoryInfo: React.Dispatch<React.SetStateAction<StoryInfoTypes>>;
  storyInfo: StoryInfoTypes;
};

export default function StoryHeroSection({ setStoryInfo, storyInfo }: StoryHeroSectionTypes) {
  const { storyId } = useParams();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [imgUploading, setImgUploading] = useState(false);

  useEffect(() => {
    if (preview) {
      setImgUploading(true);
      handleUploadeImg({ preview })
        .then((r) => {
          setStoryInfo((prev) => ({
            ...prev,
            storyImg: r,
          }));
          setImgUploading(false);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setImgUploading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  const updateImg = useUpdateImg({
    id: storyId || "",
    path: "/stories",
    preview: storyInfo.storyImg,
  });

  useEffect(() => {
    if (storyInfo.storyImg) {
      updateImg.mutate({});
    }
  }, [storyInfo.storyImg]);

  const [opacityFull, setOpacityFull] = useState({
    title: false,
    description: false,
    genres: false,
  });

  return (
    <section className="flex flex-col max-w-[1480px] mx-auto min-h-screen lg:items-start items-center mt-[10px] sm:mt-0 lg:mt-[25px] px-[10px]">
      <div className="flex lg:flex-row lg:w-full lg:mx-0 lg:items-start flex-col w-full gap-[10px] h-fit items-center mt-[20px] sm:px-0 px-[20px]">
        <div className="w-full lg:max-w-[200px] lg:h-[300px] max-w-[500px] h-[450px] relative bg-lightest-gray shadow-md shadow-gray-600 rounded-md">
          {storyInfo.storyImg ? (
            <img
              src={storyInfo.storyImg as string}
              alt="Story Img"
              draggable={false}
              className="absolute w-full h-full rounded-md object-cover"
            />
          ) : (
            <PreviewImage
              imagePreview={preview}
              setPreview={setPreview}
              imgClasses="w-full h-full object-cover rounded-md"
              divClasses="h-full rounded-md shadow-sm relative bg-primary"
            />
          )}
          <SyncLoad
            className="bg-secondary shadow-md rounded-sm bottom-[10px] right-[10px]"
            conditionToLoading={!imgUploading}
            conditionToStart={imgUploading}
          />
        </div>

        <div className="flex-grow flex flex-col gap-[5px] text-pretty max-w-[500px] w-full lg:text-right">
          <h1
            onMouseEnter={() =>
              setOpacityFull((prev) => {
                return {
                  ...prev,
                  title: true,
                };
              })
            }
            onMouseLeave={() =>
              setOpacityFull((prev) => {
                return {
                  ...prev,
                  title: false,
                };
              })
            }
            className="sm:text-[50px] lg:w-fit transition-all px-[10px] cursor-cell first-letter:capitalize text-[45px] lg:text-end text-center text-text break-words z-[10] relative"
          >
            {storyInfo.storyName}
            <span
              className={`absolute bg-background text-text transition-all w-full top-0 bottom-0 right-0 left-0 z-[-1] ${
                opacityFull.title ? "" : " opacity-30"
              } rounded-md`}
            ></span>
          </h1>
          <p
            onMouseEnter={() =>
              setOpacityFull((prev) => {
                return {
                  ...prev,
                  description: true,
                };
              })
            }
            onMouseLeave={() =>
              setOpacityFull((prev) => {
                return {
                  ...prev,
                  description: false,
                };
              })
            }
            className="sm:text-[30px] lg:w-fit transition-all px-[10px] cursor-cell text-[20px] text-text break-words z-[10] relative"
          >
            {storyInfo.storyDescription}
            <span
              className={`absolute bg-background transition-all w-full top-0 bottom-0 right-0 left-0 z-[-1] text-text ${
                opacityFull.description ? "" : " opacity-30"
              } rounded-md`}
            ></span>
          </p>
          <h4
            onMouseEnter={() =>
              setOpacityFull((prev) => {
                return {
                  ...prev,
                  genres: true,
                };
              })
            }
            onMouseLeave={() =>
              setOpacityFull((prev) => {
                return {
                  ...prev,
                  genres: false,
                };
              })
            }
            className="sm:text-[20px] lg:w-fit transition-all text-text px-[10px] cursor-cell text-[14px] text-right break-words z-[10] relative"
          >
            {storyInfo.storyGenre}
            <span
              className={`absolute bg-background transition-all w-full top-0 bottom-0 right-0 left-0 z-[-1] text-text ${
                opacityFull.genres ? "" : " opacity-30"
              } rounded-md`}
            ></span>
          </h4>
        </div>
      </div>
    </section>
  );
}

const KeyBindsBlock = () => {
  const { storyId } = useParams();

  const queryClient = useQueryClient();

  const prefetchTranslatedCharacters = () => {
    queryClient.prefetchQuery({
      queryKey: ["translation", "russian", "character", "story", storyId],
      queryFn: () =>
        getTranslationCharacters({
          language: "russian",
          storyId: storyId || "",
        }),
    });
  };

  const prefetchCharacters = () => {
    queryClient.prefetchQuery({
      queryKey: ["story", storyId, "characters"],
      queryFn: () =>
        getAllCharacters({
          storyId: storyId || "",
        }),
    });
  };

  const prefetchSeasons = () => {
    queryClient.prefetchQuery({
      queryKey: ["stories", storyId, "season", "language", "russian"],
      queryFn: () =>
        getSeasonsByStoryId({
          storyId: storyId || "",
          language: "russian",
        }),
    });
  };

  const handlePrefetches = () => {
    Promise.all([prefetchTranslatedCharacters(), prefetchCharacters(), prefetchSeasons()]);
  };

  return (
    <div className="flex gap-[10px] mt-[2rem] flex-wrap w-full mb-[10px]">
      <Link
        onFocus={handlePrefetches}
        onMouseOver={handlePrefetches}
        to={`/stories/${storyId}/keyBinds`}
        className="w-[15rem] h-[15rem] rounded-2xl hover:bg-primary-darker bg-primary transition-colors"
      >
        <img src={keyButton} alt="A" draggable="false" className="" />
      </Link>
    </div>
  );
};
