import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import wardrobe from "../../assets/images/Story/wardrobe.png";
import useGetCharacterById from "../../hooks/Fetching/Character/useGetCharacterById";
import useUpdateImg from "../../hooks/Patching/useUpdateImg";
import { TranslationCharacterTypes } from "../../types/Additional/TranslationTypes";
import PreviewImage from "../shared/utilities/PreviewImage";
import CharacterItemMainHero from "./CharacterMainHero";

export default function CharacterItemDebounce({
  characterId,
  translations,
}: TranslationCharacterTypes) {
  const { data: character } = useGetCharacterById({ characterId });

  const [isFrontSide, setIsFrontSide] = useState(true);
  const [characterName, setCharacterName] = useState("");
  const [characterUnknownName, setCharacterUnknownName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");

  useEffect(() => {
    if (translations) {
      translations.map((tc) => {
        if (tc.textFieldName === "characterName") {
          setCharacterName(tc.text);
        } else if (tc.textFieldName === "characterDescription") {
          setCharacterDescription(tc.text);
        } else if (tc.textFieldName === "characterUnknownName") {
          setCharacterUnknownName(tc.text);
        }
      });
    }
  }, [translations]);

  return (
    <>
      {character?.type === "maincharacter" ? (
        <article
          onClick={() => setIsFrontSide((prev) => !prev)}
          className={`${
            isFrontSide ? "hover:scale-[1.01]" : ""
          } cursor-pointer flex flex-col rounded-md bg-white w-full h-[30rem] border-[2px] border-dashed border-gray-300 relative`}
        >
          <CharacterItemMainHero
            img={character?.img}
            characterId={characterId}
            characterName={characterName}
            isFrontSide={isFrontSide}
          />
        </article>
      ) : character?.type === "minorcharacter" ? (
        <article
          onClick={() => setIsFrontSide((prev) => !prev)}
          className={`${
            isFrontSide ? "hover:scale-[1.01]" : ""
          } cursor-pointer flex flex-col rounded-md bg-white w-full h-[30rem] border-[2px] border-dashed border-gray-300 relative`}
        >
          <CharacterItemMinor
            img={character?.img}
            characterId={characterId}
            nameTag={character?.nameTag ?? ""}
            characterName={characterName}
            characterDescription={characterDescription}
            characterUnknownName={characterUnknownName}
            isFrontSide={isFrontSide}
          />
        </article>
      ) : (
        <article
          onClick={() => setIsFrontSide((prev) => !prev)}
          className={`${
            isFrontSide ? "hover:scale-[1.01]" : ""
          } cursor-pointer flex flex-col rounded-md bg-white w-full h-[30rem] border-[2px] border-dashed border-gray-300 relative`}
        >
          <CharacterItemEmpty
            img={character?.img}
            characterId={characterId}
            characterName={characterName}
            isFrontSide={isFrontSide}
          />
        </article>
      )}
    </>
  );
}

type CharacterItemMinorTypes = {
  characterName: string;
  characterDescription: string;
  characterUnknownName: string;
  isFrontSide: boolean;
  nameTag: string;
  img?: string;
  characterId: string;
};

function CharacterItemMinor({
  isFrontSide,
  characterDescription,
  characterName,
  nameTag,
  img,
  characterId,
  characterUnknownName,
}: CharacterItemMinorTypes) {
  const { storyId } = useParams();
  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(
    null
  );

  const uploadImgMutation = useUpdateImg({
    id: characterId,
    path: "/characters",
    preview: imagePreview,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted && imagePreview) {
      uploadImgMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isFrontSide ? (
        <>
          {img ? (
            <div className="w-full h-full rounded-t-md relative shadow-sm">
              <img
                src={img}
                alt="StoryBackground"
                className="object-cover w-full h-full cursor-pointer rounded-t-md border-[3px] border-b-0 border-white"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-neutral-alabaster">
              <PreviewImage
                imgClasses="object-cover rounded-md border-[2px] border-b-0 rounded-b-none border-white"
                divClasses="top-1/2 relative"
                imagePreview={imagePreview}
                setPreview={setPreview}
              />
            </div>
          )}
          <div className="w-full rounded-b-md bg-neutral-alabaster p-[1rem] text-[1.5rem] shadow-sm border-t-[1px] border-gray-300 rounded-t-md shadow-gray-600">
            {characterName.length > 30
              ? characterName.substring(0, 30) + "..."
              : characterName}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-[1rem] p-[1rem] justify-between h-full">
          <div className="gap-[1rem] flex flex-col">
            <div>
              <h3 className="text-[2rem] break-words">Имя: {characterName}</h3>
              <p className="text-[1.35rem] break-words">
                Имя(Незнакомец) : {characterUnknownName}
              </p>
              <p className="text-[1.3rem] break-words">НеймТаг {nameTag}</p>
            </div>
            <p className="text-[1.1rem] text-gray-600 break-words">
              Описание: {characterDescription}
            </p>
          </div>

          <div className="flex gap-[1rem] flex-wrap">
            <Link
              className="ml-auto"
              to={`/stories/${storyId}/wardrobes/characters/${characterId}`}
            >
              <button className=" bg-white shadow-md p-[.5rem] rounded-md active:scale-[0.99] hover:scale-[1.01] ">
                <img src={wardrobe} alt="Wardrobe" className="w-[3rem]" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

type CharacterItemEmptyTypes = {
  characterName: string;
  isFrontSide: boolean;
  characterId: string;
  img?: string;
};

function CharacterItemEmpty({
  isFrontSide,
  characterId,
  img,
  characterName,
}: CharacterItemEmptyTypes) {
  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(
    null
  );

  const uploadImgMutation = useUpdateImg({
    id: characterId,
    path: "/characters",
    preview: imagePreview,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted && imagePreview) {
      uploadImgMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isFrontSide ? (
        <>
          {img ? (
            <div className="w-full h-full rounded-t-md relative shadow-sm">
              <img
                src={img}
                alt="StoryBackground"
                className="object-cover w-full h-full cursor-pointer rounded-t-md border-[3px] border-b-0 border-white"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-neutral-alabaster">
              <PreviewImage
                imgClasses="object-cover rounded-md border-[2px] border-b-0 rounded-b-none border-white"
                divClasses="top-1/2 relative"
                imagePreview={imagePreview}
                setPreview={setPreview}
              />
            </div>
          )}
          <div className="w-full rounded-b-md bg-neutral-alabaster p-[1rem] text-[1.5rem] shadow-sm border-t-[1px] border-gray-300 rounded-t-md shadow-gray-600">
            {characterName.length > 30
              ? characterName.substring(0, 30) + "..."
              : characterName}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-[1rem] p-[1rem] h-full">
          <h3 className="text-[2rem] break-words">{characterName}</h3>
        </div>
      )}
    </>
  );
}
