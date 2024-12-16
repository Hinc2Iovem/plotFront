import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUpdateImg from "../../hooks/Patching/useUpdateImg";
import { StoryTypes } from "../../types/StoryData/Story/StoryTypes";
import SyncLoad from "../../ui/Loaders/SyncLoader";
import PreviewImage from "../../ui/shared/PreviewImage";

export default function StoryItem({ _id, imgUrl }: StoryTypes) {
  // const { data } = useGetTranslationStory({ id: _id, language: "russian" });

  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const uploadImgMutation = useUpdateImg({
    id: _id,
    path: "/stories",
    preview: imagePreview,
  });

  useEffect(() => {
    if (imagePreview) {
      uploadImgMutation.mutate({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview]);

  return (
    <article className="flex flex-col gap-[1rem] w-full rounded-md shadow-sm bg-secondary h-[30rem] relative">
      {imgUrl ? (
        <div className="w-full h-1/2 rounded-t-md relative shadow-sm">
          <img
            src={imgUrl}
            alt="StoryBackground"
            className="object-cover w-full h-full cursor-pointer rounded-t-md border-[3px] border-white"
          />
        </div>
      ) : (
        <PreviewImage
          imgClasses="w-full h-full object-cover rounded-md absolute top-0 bottom-0 left-0 right-0 border-[2px] border-white"
          divClasses="w-full h-1/2 p-[1rem] relative shadow-sm"
          imagePreview={imagePreview}
          setPreview={setPreview}
        />
      )}
      {uploadImgMutation.isPending && (
        <SyncLoad
          conditionToLoading={uploadImgMutation.isPending}
          conditionToStart={uploadImgMutation.isPending}
          className="top-[1rem] right-[1rem]"
        />
      )}
      <Link className="flex flex-col" to={`/stories/${_id}`}>
        <div className="flex flex-col gap-[.5rem] p-[1rem]">
          {/* <h3 className="text-[1.8rem] m-0 p-0">
            {data?.find((d) => d.textFieldName === "storyName")?.text}
          </h3>
          <h4 className="text-[1.3rem]">
            {" "}
            {data?.find((d) => d.textFieldName === "storyGenre")?.text}
          </h4> */}
        </div>
        <p className="text-[1.2rem] self-end p-[1rem] mt-auto">Эпизодов 0</p>
      </Link>
    </article>
  );
}
