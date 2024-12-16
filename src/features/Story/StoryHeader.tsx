import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosCustomized } from "../../api/axios";
import createStory from "../../assets/images/Story/createStory.png";
import profile from "../../assets/images/Story/profile.png";
import ButtonHoverPromptModal from "../../ui/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import LightBox from "../../ui/shared/LightBox";
import { StoryTypes } from "../../types/StoryData/Story/StoryTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import useGetDecodedJWTValues from "../../hooks/Auth/useGetDecodedJWTValues";

type StoryHeaderTypes = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string;
};

type CreatingStoryTypes = {
  currentLanguage?: CurrentlyAvailableLanguagesTypes;
  genres: string;
  title: string;
  description: string;
};

const handleCreatingStory = async ({
  description,
  genres,
  title,
  currentLanguage = "russian",
}: CreatingStoryTypes): Promise<StoryTypes> => {
  return await axiosCustomized
    .post("/stories", {
      currentLanguage,
      genres,
      title,
      description,
    })
    .then((r) => r.data);
};

export default function StoryHeader({ setSearchValue, searchValue }: StoryHeaderTypes) {
  const { userId } = useGetDecodedJWTValues();
  const [showCreatingModal, setShowCreatingModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState("");

  const navigate = useNavigate();

  const createStoryMutation = useMutation({
    mutationFn: () => handleCreatingStory({ description, genres, title }),
    mutationKey: ["create", "story", title],
    onSuccess: (result) => {
      setTitle("");
      setDescription("");
      setGenres("");
      navigate(`/stories/${result._id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title?.trim() || !description?.trim().length || !genres?.trim().length) {
      console.error("Title, description and genres should be filled");
      return;
    }
    try {
      createStoryMutation.mutate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <header className="flex justify-between mt-[1rem] p-[1rem] bg-secondary rounded-md shadow-md">
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <input
            type="text"
            value={searchValue}
            className="py-[.5rem] px-[1rem] rounded-md outline-none sm:w-[30rem] w-[20rem] placeholder:text-gray-300 placeholder:font-medium text-gray-700 text-[1.6rem]"
            placeholder="Зомби Апокалипсис"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
        <div className="flex gap-[1rem] items-center">
          <ButtonHoverPromptModal
            contentName="Создать Историю"
            positionByAbscissa="right"
            asideClasses="text-[1.5rem]"
            onClick={() => setShowCreatingModal(true)}
            className="outline-none"
          >
            <img src={createStory} alt="CreateStory" className="w-[3.5rem]" />
          </ButtonHoverPromptModal>
          <ButtonHoverPromptModal contentName="Профиль" positionByAbscissa="right" asideClasses="text-[1.5rem]">
            <Link to={`/profile/${userId}`}>
              <img src={profile} alt="Profile" className="w-[3.5rem]" />
            </Link>
          </ButtonHoverPromptModal>
        </div>
      </header>
      <aside
        className={`${
          showCreatingModal ? "top-[10rem]" : "-top-[100%]"
        } bg-secondary md:w-[40rem] w-[30rem] transition-all md:h-[40rem] min-h-[30rem] h-fit rounded-md fixed z-[10] left-1/2 -translate-x-1/2`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-[1rem] p-[1.5rem] h-full">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Тайтл Истории"
            className="text-[1.5rem] w-full outline-none p-[1rem] border-[2px] border-dotted border-dark-dark-blue rounded-md text-gray-600 font-medium"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание Истории"
            cols={30}
            rows={10}
            className="text-[1.5rem] max-h-[35rem] w-full outline-none p-[1rem] border-[2px] border-dotted border-dark-dark-blue rounded-md text-gray-600 font-medium"
          />
          <input
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            type="text"
            placeholder="Жанры Истории"
            className="text-[1.5rem] w-full outline-none p-[1rem] border-[2px] border-dotted border-dark-dark-blue rounded-md text-gray-600 font-medium"
          />
          <button
            type="submit"
            className="text-[1.5rem] w-fit self-end mt-[2rem] px-[1rem] py-[.5rem] rounded-md border-[1px] border-black hover:scale-[1.01] hover:shadow-sm active:scale-[0.98]"
          >
            Завершить
          </button>
        </form>
      </aside>
      <LightBox isLightBox={showCreatingModal} setIsLightBox={setShowCreatingModal} />
    </>
  );
}
