import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGetSingleStory from "../../../hooks/Fetching/Story/useGetSingleStory";
import useGetTranslationStoryById from "../../../hooks/Fetching/Story/useGetTranslationStoryById";
import useUpdateImg from "../../../hooks/Patching/useUpdateImg";
import { handleUploadeImg } from "../../../utils/handleUploadImg";
import SyncLoad from "../../shared/Loaders/SyncLoader";
import PreviewImage from "../../shared/utilities/PreviewImage";

export default function StoryHeroSection() {
  const { storyId } = useParams();
  const { data: translatedStory } = useGetTranslationStoryById({
    language: "russian",
    storyId: storyId || "",
  });

  const { data: story } = useGetSingleStory({ storyId: storyId || "" });
  const [storyImg, setStoryImg] = useState("");
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [imgUploading, setImgUploading] = useState(false);

  const [storyInfo, setStoryInfo] = useState({
    storyName: "",
    storyDescription: "",
    storyGenre: "",
  });

  useEffect(() => {
    if (translatedStory) {
      translatedStory.translations.map((ts) => {
        if (ts.textFieldName === "storyName") {
          setStoryInfo((prev) => {
            return {
              ...prev,
              storyName: ts?.text || "",
            };
          });
        } else if (ts.textFieldName === "storyDescription") {
          setStoryInfo((prev) => {
            return {
              ...prev,
              storyDescription: ts?.text || "",
            };
          });
        } else if (ts.textFieldName === "storyGenre") {
          setStoryInfo((prev) => {
            return {
              ...prev,
              storyGenre: ts?.text || "",
            };
          });
        }
      });
    }
  }, [translatedStory]);

  useEffect(() => {
    if (story) {
      setStoryImg(story?.imgUrl || "");
    }
  }, [story]);
  console.log("story: ", story);

  useEffect(() => {
    if (preview) {
      setImgUploading(true);
      handleUploadeImg({ preview })
        .then((r) => {
          setStoryImg(r);
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
    preview: storyImg,
  });

  useEffect(() => {
    if (storyImg) {
      updateImg.mutate();
    }
  }, [storyImg]);

  const [opacityFull, setOpacityFull] = useState({
    title: false,
    description: false,
    genres: false,
  });

  return (
    <section className="flex max-w-[148rem] mx-auto min-h-screen lg:items-start sm:items-center mt-[1rem] sm:mt-0 lg:mt-[2.5rem] px-[1rem] relative">
      <div className="flex lg:flex-row lg:w-full lg:mx-0 lg:items-start flex-col w-[100rem] gap-[1rem] h-fit items-center mx-auto">
        <div className="w-full lg:max-w-[20rem] lg:h-[30rem] sm:max-w-[50rem] h-[45rem] relative bg-lightest-gray shadow-md shadow-gray-600 rounded-md">
          {storyImg ? (
            <img
              src={storyImg as string}
              alt="Story Img"
              draggable={false}
              className="absolute w-full h-full rounded-md object-cover"
            />
          ) : (
            <PreviewImage
              imagePreview={preview}
              setPreview={setPreview}
              imgClasses="w-full h-full object-cover rounded-md"
              divClasses="h-full rounded-md shadow-sm relative"
            />
          )}
          <SyncLoad
            className="bg-secondary shadow-md rounded-sm bottom-[1rem] right-[1rem]"
            conditionToLoading={!imgUploading}
            conditionToStart={imgUploading}
          />
        </div>

        <div className="flex-grow flex flex-col gap-[.5rem] text-pretty sm:max-w-[50rem] w-full lg:text-right">
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
            className="sm:text-[5rem] lg:w-fit transition-all hover:text-black px-[1rem] cursor-cell first-letter:capitalize text-[4.5rem] lg:text-end text-center text-gray-700 break-words z-[10] relative"
          >
            {storyInfo.storyName}
            <span
              className={`absolute bg-secondary transition-all w-full top-0 bottom-0 right-0 left-0 z-[-1] ${
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
            className="sm:text-[3rem] lg:w-fit transition-all hover:text-black px-[1rem] cursor-cell text-[2rem] text-gray-700 break-words z-[10] relative"
          >
            {storyInfo.storyDescription}
            <span
              className={`absolute bg-secondary transition-all w-full top-0 bottom-0 right-0 left-0 z-[-1] ${
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
            className="sm:text-[2rem] lg:w-fit transition-all hover:text-black px-[1rem] cursor-cell text-[1.4rem] text-gray-700 text-right break-words z-[10] relative"
          >
            {storyInfo.storyGenre}
            <span
              className={`absolute bg-secondary transition-all w-full top-0 bottom-0 right-0 left-0 z-[-1] ${
                opacityFull.genres ? "" : " opacity-30"
              } rounded-md`}
            ></span>
          </h4>
        </div>
      </div>
    </section>
  );
}
