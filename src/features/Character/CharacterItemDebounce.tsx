import { useEffect, useState } from "react";
import useGetCharacterById from "../../hooks/Fetching/Character/useGetCharacterById";
import useUpdateImg from "../../hooks/Patching/useUpdateImg";
import { TranslationCharacterTypes } from "../../types/Additional/TranslationTypes";
import PreviewImage from "../../ui/shared/PreviewImage";
import { StoryNewCharacterTypes } from "./CharacterListPage";

type CharacterItemDebounceTypes = {
  setCharacterValue: React.Dispatch<React.SetStateAction<StoryNewCharacterTypes>>;
  setInitCharacterValue: React.Dispatch<React.SetStateAction<StoryNewCharacterTypes>>;
  characterValue: StoryNewCharacterTypes;
  created: boolean | null;
} & TranslationCharacterTypes;

export default function CharacterItemDebounce({
  characterId,
  translations,
  characterValue,
  characterType,
  created,
  setCharacterValue,
  setInitCharacterValue,
}: CharacterItemDebounceTypes) {
  const { data: character } = useGetCharacterById({ characterId });

  const [currentCharacter, setCurrentCharacter] = useState<StoryNewCharacterTypes>({
    characterDescription: characterValue.characterDescription,
    characterId: characterId,
    characterName: characterValue.characterName,
    characterType: characterType,
    characterImg: characterValue.characterImg,
    characterTag: characterValue.characterTag,
    characterUnknownName: characterValue.characterUnknownName,
  });

  useEffect(() => {
    if (typeof created === "boolean" && characterValue.characterId === characterId) {
      setCurrentCharacter(characterValue);
    }
  }, [created]);

  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const uploadImgMutation = useUpdateImg({
    id: characterId,
    path: "/characters",
    preview: imagePreview,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setCurrentCharacter((prev) => ({
      ...prev,
      characterImg: character?.img || "",
      characterTag: character?.nameTag || "",
    }));
  }, [character]);

  useEffect(() => {
    if (isMounted && imagePreview) {
      uploadImgMutation.mutate({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (translations) {
      translations.map((tc) => {
        setCurrentCharacter((prev) => ({
          ...prev,
          characterName: tc.textFieldName === "characterName" ? tc.text : prev.characterName,
          characterDescription: tc.textFieldName === "characterDescription" ? tc.text : prev.characterDescription,
          characterUnknownName: tc.textFieldName === "characterUnknownName" ? tc.text : prev.characterUnknownName,
        }));
      });
    }
  }, [translations]);

  return (
    <article className={`rounded-md max-h-[337px] w-full h-full border-border border-[1px] relative`}>
      <div
        className={`${
          character?.type === "maincharacter"
            ? "bg-red"
            : character?.type === "minorcharacter"
            ? "bg-brand-gradient-left"
            : "bg-accent"
        } absolute top-0 right-0 rounded-b-full  w-[30px] h-[30px]`}
      ></div>
      {currentCharacter.characterImg ? (
        <img
          src={currentCharacter.characterImg}
          alt="StoryBackground"
          className="object-cover w-full h-full cursor-pointer rounded-t-md"
        />
      ) : (
        <div className={`w-full h-full`}>
          <PreviewImage
            imgClasses="object-cover rounded-md"
            divClasses="top-1/2 relative"
            imagePreview={imagePreview}
            setPreview={setPreview}
          />
        </div>
      )}
      <button
        onClick={() => {
          setCharacterValue(currentCharacter);
          setInitCharacterValue(currentCharacter);
        }}
        className="absolute text-[30px] text-start bottom-0 w-full rounded-b-md text-text bg-background px-[10px] py-[5px]"
      >
        {`${currentCharacter.characterName}`.trim().length > 22
          ? `${currentCharacter.characterName}...`.substring(0, 22)
          : `${currentCharacter.characterName}`}
      </button>
    </article>
  );
}
