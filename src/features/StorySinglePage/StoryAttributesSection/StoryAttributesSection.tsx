import characterImg from "../../../assets/images/Story/characters.png";
import emotionImg from "../../../assets/images/Story/emotion.png";
import wardrobeImg from "../../../assets/images/Story/wardrobe.png";
import characteristicImg from "../../../assets/images/Story/characteristic.png";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState, useTransition } from "react";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import "../../Editor/Flowchart/FlowchartStyles.css";
import useCreateCharacteristic from "../../../hooks/Posting/Characteristic/useCreateCharacteristic";
import useGetAllCharacteristicsByStoryId from "../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import { TranslationCharacterCharacteristicTypes } from "../../../types/Additional/TranslationTypes";
import useUpdateCharacteristicTranslation from "../../../hooks/Patching/Translation/useUpdateCharacteristicTranslation";
import { useQueryClient } from "@tanstack/react-query";
import { getTranslationCharactersByType } from "../../../hooks/Fetching/Translation/Characters/useGetTranslationCharactersByType";
import { SearchCharacterVariationTypes } from "../../Character/CharacterListPage";

export default function StoryAttributesSection() {
  return (
    <section className="h-screen flex flex-col w-full gap-[.5rem] p-[1rem] items-center justify-center sm:my-0 my-[1rem]">
      <div className="flex sm:flex-row flex-col max-w-[100rem] justify-center w-full gap-[.5rem] sm:h-[40%] min-h-fit min-w-[30rem] flex-wrap">
        <CardBlock img={characterImg} alt="Персонажи" path="characters" />
        <CardBlock img={emotionImg} alt="Эмоции" path="emotions" />
      </div>
      <div className="flex sm:flex-row flex-col max-w-[100rem] justify-center w-full gap-[.5rem] sm:h-[40%] min-h-fit min-w-[30rem] flex-wrap">
        <CardBlock img={wardrobeImg} alt="Гардероб" path="wardrobes" />
        <CardCharacteristicBlock img={characteristicImg} alt="Характеристики" />
      </div>
    </section>
  );
}

type CardBlockTypes = {
  img: string;
  alt: string;
  path: string;
};

function CardBlock({ img, path, alt }: CardBlockTypes) {
  const { storyId } = useParams();

  const queryClient = useQueryClient();
  const prefetchCharacters = () => {
    queryClient.prefetchQuery({
      queryKey: [
        "translation",
        "russian",
        "character",
        "type",
        "",
        "story",
        storyId,
        "search",
        "",
      ],
      queryFn: () =>
        getTranslationCharactersByType({
          language: "russian",
          storyId: storyId || "",
          characterType: "" as SearchCharacterVariationTypes,
          debouncedValue: "",
        }),
    });
  };
  return (
    <div
      onMouseEnter={() => {
        if (path === "characters") {
          prefetchCharacters();
        }
      }}
      onFocus={() => {
        if (path === "characters") {
          prefetchCharacters();
        }
      }}
      className="sm:flex-grow flex-grow-0 sm:w-auto min-w-[20rem] min-h-[18rem] rounded-md shadow-md bg-secondary sm:h-full relative hover:scale-[1.01] transition-all"
    >
      <Link to={`/stories/${storyId}/${path}`}>
        <img
          src={img}
          alt={alt}
          className="w-[15rem] sm:w-[20rem] absolute object-contain left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-md"
        />
      </Link>
    </div>
  );
}

type CardCharacteristicBlockTypes = {
  img: string;
  alt: string;
};

function CardCharacteristicBlock({ img, alt }: CardCharacteristicBlockTypes) {
  const { storyId } = useParams();
  const [showBackSide, setShowBackSide] = useState(false);
  const [characteristic, setCharacteristic] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const { data: characteristics } = useGetAllCharacteristicsByStoryId({
    language: "russian",
    storyId: storyId || "",
  });

  useOutOfModal({
    modalRef,
    setShowModal: setShowBackSide,
    showModal: showBackSide,
  });

  const createCharacteristic = useCreateCharacteristic({
    characteristicName: characteristic,
    language: "russian",
    storyId: storyId || "",
  });

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShowBackSide(true);
        }}
        className={`${
          showBackSide ? "hidden" : "hover:scale-[1.01]"
        } sm:flex-grow flex-grow-0 sm:w-auto min-w-[20rem] min-h-[18rem] rounded-md shadow-md bg-secondary sm:h-full relative  transition-all`}
      >
        <img
          src={img}
          alt={alt}
          className={`w-[15rem] cursor-pointer sm:w-[20rem] absolute object-contain left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-md`}
        />
      </div>
      <div
        ref={modalRef}
        className={`${
          showBackSide ? "" : "hidden"
        } overflow-y-auto sm:w-[calc(50%-0.25rem)] p-[1rem] w-full min-h-[18rem] max-h-[30rem] rounded-md shadow-md bg-secondary sm:h-full relative transition-all | containerScroll`}
      >
        <form
          className="flex gap-[1rem]"
          onSubmit={(e) => {
            e.preventDefault();
            createCharacteristic.mutate();
            startTransition(() => {
              setCharacteristic("");
            });
          }}
        >
          <input
            type="text"
            value={characteristic}
            onChange={(e) => setCharacteristic(e.target.value)}
            placeholder="Характеристика"
            className="flex-grow text-text-light outline-none rounded-md shadow-sm shadow-gray-200 text-[1.4rem] px-[1rem] py-[.5rem]"
          />
          <button
            disabled={isPending}
            className="text-[1.4rem] shadow-sm shadow-gray-200 px-[1rem] rounded-md text-text-dark hover:text-text-light transition-colors"
          >
            Создать
          </button>
        </form>

        <ul className="flex w-full gap-[1rem] flex-wrap mt-[1rem]">
          {characteristics?.map((c) => (
            <CharacteristicItem key={c._id} {...c} />
          ))}
        </ul>
      </div>
    </>
  );
}

function CharacteristicItem({
  characteristicId,
  translations,
  storyId,
}: TranslationCharacterCharacteristicTypes) {
  const [clicked, setClicked] = useState({
    first: false,
    second: false,
  });

  const [characteristic, setCharacteristic] = useState(
    translations[0]?.text || ""
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!clicked.second) {
        setClicked({
          first: false,
          second: false,
        });
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [clicked.first, clicked.second]);

  const updateCharacteristic = useUpdateCharacteristicTranslation({
    characterCharacteristicId: characteristicId,
    language: "russian",
    storyId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClicked({
      first: false,
      second: false,
    });
    if (!characteristic?.trim().length) {
      setCharacteristic(translations[0]?.text || "");
      return;
    }
    if (characteristic === (translations[0]?.text || "")) {
      return;
    }

    updateCharacteristic.mutate({ characteristicName: characteristic });
  };

  return (
    <>
      <li
        onClick={() => {
          if (clicked.first) {
            setClicked({
              first: true,
              second: true,
            });
          } else {
            setClicked({
              first: true,
              second: false,
            });
          }
        }}
        className={`${
          clicked.first && clicked.second ? "hidden" : ""
        } flex-grow text-text-light cursor-cell min-w-[15rem] px-[1rem] py-[.5rem] rounded-md text-[1.4rem] shadow-sm shadow-gray-200`}
      >
        {characteristic}
      </li>
      <form
        className={`${
          clicked.first && clicked.second ? "" : "hidden"
        } flex-grow min-w-[15rem]`}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          type="text"
          value={characteristic}
          onChange={(e) => setCharacteristic(e.target.value)}
          className="w-full text-text-light opacity-70 border-[1px] border-dashed border-orange-200 px-[1rem] py-[.5rem] rounded-md text-[1.4rem] shadow-sm shadow-gray-200 outline-orange-200"
        />
      </form>
    </>
  );
}
