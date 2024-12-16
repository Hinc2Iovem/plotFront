import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosCustomized } from "../../../api/axios";
import useGetSingleStory from "../../../hooks/Fetching/Story/useGetSingleStory";
import useUpdateImg from "../../../hooks/Patching/useUpdateImg";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationStoryTypes } from "../../../types/Additional/TranslationTypes";
import SyncLoad from "../../../ui/Loaders/SyncLoader";
import PreviewImage from "../../../ui/shared/PreviewImage";

type GetAllTranslationsTypes = {
  id: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

const getAllTranslations = async ({
  id,
  language = "russian",
}: GetAllTranslationsTypes): Promise<TranslationStoryTypes[]> => {
  return await axiosCustomized.get(`/translations/stories/${id}?currentLanguage=${language}`).then((r) => r.data);
};

export default function StoryDebounced({ _id, storyId }: TranslationStoryTypes) {
  const story = useGetSingleStory({ storyId });
  const storyTextFieldNamesTranslations = useQuery({
    queryKey: ["translation", "stories", storyId],
    queryFn: () => getAllTranslations({ id: storyId }),
  });

  const [genres, setGenres] = useState("");
  const [storyName, setStoryName] = useState("");

  useEffect(() => {
    if (storyTextFieldNamesTranslations.data) {
      storyTextFieldNamesTranslations.data.map((st) => {
        st.translations.map((stt) => {
          if (stt.textFieldName === "storyName") {
            setStoryName(stt.text);
          } else if (stt.textFieldName === "storyGenre") {
            setGenres(stt.text);
          }
        });
      });
    }
  }, [storyTextFieldNamesTranslations.data]);

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
      {story?.data?.imgUrl ? (
        <div className="w-full h-1/2 rounded-t-md relative shadow-sm">
          <img
            src={story?.data?.imgUrl}
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
      <Link className="flex flex-col" to={`/stories/${storyId}`}>
        <div className="flex flex-col gap-[.5rem] p-[1rem]">
          <h3 className="text-[1.8rem] m-0 p-0">{storyName}</h3>
          <h4 className="text-[1.3rem]">{genres}</h4>
        </div>
        <p className="text-[1.2rem] self-end p-[1rem] mt-auto">Эпизодов 0</p>
      </Link>
    </article>
  );
}
