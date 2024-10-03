import { useEffect, useState } from "react";
import useCreateStory from "../../../../hooks/Posting/Story/useCreateStory";
import { handleUploadeImg } from "../../../../utils/handleUploadImg";
import LightBox from "../../../shared/utilities/LightBox";
import PreviewImage from "../../../shared/utilities/PreviewImage";
import SyncLoad from "../../../shared/Loaders/SyncLoader";

export default function CreateStory() {
  const [isLightBox, setIsLightBox] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [storyGenre, setStoryGenre] = useState("");
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [imgPreviewLink, setImgPreviewLink] = useState("");
  const [imgUploading, setImgUploading] = useState(false);

  const createStory = useCreateStory({
    currentLanguage: "russian",
    description: storyDescription,
    genres: storyGenre,
    imgUrl: imgPreviewLink,
    title: storyTitle,
  });

  useEffect(() => {
    if (preview) {
      setImgUploading(true);
      handleUploadeImg({ preview })
        .then((r) => {
          setImgPreviewLink(r);
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

  useEffect(() => {
    if (isLightBox) {
      setStoryTitle("");
      setStoryDescription("");
      setStoryGenre("");
      setImgPreviewLink("");
      setPreview("");
    }
  }, [isLightBox]);
  return (
    <>
      <div className={`rounded-md shadow-md relative`}>
        <button
          onClick={() => {
            setIsLightBox(true);
          }}
          className="text-[1.5rem] outline-none active:scale-[0.99] w-full bg-neutral-alabaster hover:bg-green-300 hover:text-neutral-alabaster transition-all py-[1rem] p-[.5rem] rounded-md"
        >
          Создать Историю
        </button>
      </div>
      <LightBox isLightBox={isLightBox} setIsLightBox={setIsLightBox} />
      <aside
        className={`${
          isLightBox ? "" : "hidden"
        } flex flex-col gap-[1rem] p-[1rem] z-[3] fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white rounded-md shadow-md sm:w-[30rem] h-fit w-[25rem]`}
      >
        <PreviewImage
          imagePreview={preview}
          setPreview={setPreview}
          imgClasses="w-full h-full object-cover rounded-md"
          divClasses="h-[15rem] rounded-md shadow-sm relative"
        />
        <form
          className="flex flex-col gap-[1rem]"
          onSubmit={(e) => {
            e.preventDefault();
            createStory.mutate();
            setIsLightBox(false);
          }}
        >
          <input
            type="text"
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
            className="w-full text-[1.6rem] placeholder:text-gray-500 text-gray-700 px-[1rem] py-[.5rem] border-dashed border-gray-500 border-[2px] rounded-md transition-all"
            placeholder="Тайтл Истории"
          />
          <input
            type="text"
            value={storyGenre}
            onChange={(e) => setStoryGenre(e.target.value)}
            className="w-full text-[1.5rem] placeholder:text-gray-500 text-gray-700 px-[1rem] py-[.5rem] border-dashed border-gray-500 border-[2px] rounded-md transition-all"
            placeholder="Жанры Истории"
          />
          <textarea
            value={storyDescription}
            onChange={(e) => setStoryDescription(e.target.value)}
            className="w-full text-[1.4rem] max-h-[10rem] placeholder:text-gray-500 text-gray-700 px-[1rem] py-[.5rem] border-dashed border-gray-500 border-[2px] rounded-md transition-all"
            placeholder="Описание Истории"
          />
          <button className="w-full px-[1rem] py-[.5rem] text-[1.5rem] rounded-md hover:shadow-md border-gray-700 border-[1px] active:scale-[0.99] transition-all">
            Создать
          </button>
        </form>
        <SyncLoad
          className="bg-white shadow-md rounded-sm top-[1rem] right-[1rem]"
          conditionToLoading={!imgUploading}
          conditionToStart={imgUploading}
        />
      </aside>
    </>
  );
}
