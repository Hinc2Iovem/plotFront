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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StoryAttributesSection() {
  return (
    <section className="h-screen my-[40px] sm:my-0 flex flex-col w-full md:max-h-[1100px] gap-[5px] sm:p-[40px] px-[10px] items-center justify-center">
      <div className="flex sm:flex-row flex-col max-w-[1200px] justify-center w-full gap-[5px] sm:h-[45%] max-h-[500px] min-h-fit sm:min-w-[600px] flex-grow flex-wrap">
        <CardBlock cardColor={"bg-brand-gradient-left"} img={characterImg} alt="Персонажи" path="characters" />
        <CardBlock cardColor={"bg-generall-yellow"} img={emotionImg} alt="Эмоции" path="emotions" />
      </div>
      <div className="flex sm:flex-row flex-col max-w-[1200px] justify-center w-full gap-[5px] sm:h-[45%] max-h-[500px] min-h-fit sm:min-w-[600px] flex-grow flex-wrap">
        <CardBlock cardColor={"bg-generall-yellow"} img={wardrobeImg} alt="Гардероб" path="wardrobes" />
        <CardCharacteristicBlock cardColor={"bg-brand-gradient-left"} img={characteristicImg} alt="Характеристики" />
      </div>
    </section>
  );
}

type CardBlockTypes = {
  img: string;
  alt: string;
  path: string;
  cardColor: string;
};

function CardBlock({ img, path, alt, cardColor }: CardBlockTypes) {
  const { storyId } = useParams();

  const queryClient = useQueryClient();
  const prefetchCharacters = () => {
    queryClient.prefetchQuery({
      queryKey: ["translation", "russian", "character", "type", "", "story", storyId, "search", ""],
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
      className={`sm:flex-grow sm:w-auto min-w-[250px] min-h-[180px] rounded-md shadow-md ${cardColor} sm:h-full relative hover:scale-[1.01] transition-all`}
    >
      <Link to={`/stories/${storyId}/${path}`}>
        <img
          src={img}
          alt={alt}
          className="min-w-[150px] max-w-[250px] max-sm:w-[300px] h-full absolute object-contain left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-md"
        />
      </Link>
    </div>
  );
}

type CardCharacteristicBlockTypes = {
  img: string;
  alt: string;
  cardColor: string;
};

function CardCharacteristicBlock({ img, alt, cardColor }: CardCharacteristicBlockTypes) {
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
        } ${cardColor} sm:flex-grow flex-grow-0 sm:w-auto min-w-[250px] min-h-[180px] rounded-md shadow-md sm:h-full relative transition-all`}
      >
        <img
          src={img}
          alt={alt}
          className={`min-w-[150px] max-w-[250px] h-full max-sm:w-[300px] cursor-pointer absolute object-contain left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-md`}
        />
      </div>
      <div
        ref={modalRef}
        className={`${
          showBackSide ? "" : "hidden"
        } overflow-y-auto sm:w-[calc(50%-2.5px)] p-[10px] w-full min-h-[180px] max-h-[300px] rounded-md shadow-md bg-secondary sm:h-full relative transition-all | containerScroll`}
      >
        <form
          className="flex gap-[10px]"
          onSubmit={(e) => {
            e.preventDefault();
            createCharacteristic.mutate();
            startTransition(() => {
              setCharacteristic("");
            });
          }}
        >
          <Input
            type="text"
            value={characteristic}
            onChange={(e) => setCharacteristic(e.target.value)}
            placeholder="Характеристика"
            className="flex-grow text-text outline-none rounded-md border-border border-[1px] text-[14px] px-[10px] py-[5px]"
          />
          <Button
            disabled={isPending}
            className="text-[14px] bg-brand-gradient hover:shadow-sm hover:shadow-brand-gradient-right px-[10px] active:scale-[.99] rounded-md text-white transition-all"
          >
            Создать
          </Button>
        </form>

        <ul className="flex w-full gap-[10px] flex-wrap mt-[10px]">
          {characteristics?.map((c) => (
            <CharacteristicItem key={c._id} {...c} />
          ))}
        </ul>
      </div>
    </>
  );
}

function CharacteristicItem({ characteristicId, translations, storyId }: TranslationCharacterCharacteristicTypes) {
  const [clicked, setClicked] = useState({
    first: false,
    second: false,
  });

  const [characteristic, setCharacteristic] = useState(translations[0]?.text || "");

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
        } flex-grow text-text cursor-cell min-w-[150px] px-[10px] py-[5px] rounded-md text-[14px] border-border border-[1px]`}
      >
        {characteristic}
      </li>
      <form
        className={`${clicked.first && clicked.second ? "" : "hidden"} flex-grow min-w-[150px]`}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <Input
          type="text"
          value={characteristic}
          onChange={(e) => setCharacteristic(e.target.value)}
          className="w-full text-text border-orange border-[1px] px-[10px] py-[5px] rounded-md text-[14px] outline-orange-200"
        />
      </form>
    </>
  );
}
