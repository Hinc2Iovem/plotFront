import { useEffect, useState } from "react";
import useGetCharacterById from "../../hooks/Fetching/Character/useGetCharacterById";
import useUpdateImg from "../../hooks/Patching/useUpdateImg";
import { TranslationCharacterTypes } from "../../types/Additional/TranslationTypes";
import PreviewImage from "../../ui/shared/PreviewImage";
import { StoryNewCharacterTypes } from "./CharacterListPage";
import { useQueryClient } from "@tanstack/react-query";
import SyncLoad from "@/ui/Loaders/SyncLoader";
import { toast } from "sonner";
import { toastErrorStyles, toastSuccessStyles } from "@/components/shared/toastStyles";

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
  const queryClient = useQueryClient();
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
  const { mutateAsync: uploadImgMutation, isPending } = useUpdateImg({
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
    const uploadAndInvalidate = async () => {
      if (isMounted && imagePreview) {
        try {
          await uploadImgMutation({ bodyId: characterId });
          queryClient.invalidateQueries({
            queryKey: ["character", characterId],
          });
          toast("Картинка была обновлена", toastSuccessStyles);
        } catch (error) {
          toast("Ой, ой, изображение не было загруженно", toastErrorStyles);
          console.error("Image upload failed:", error);
        }
      }
    };

    uploadAndInvalidate();
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
    <article className={`rounded-md h-[337px] w-full border-border border-[1px] relative`}>
      <div
        className={`${
          character?.type === "maincharacter"
            ? "bg-red"
            : character?.type === "minorcharacter"
            ? "bg-brand-gradient-left"
            : "bg-accent"
        } absolute top-0 right-0 rounded-b-full w-[30px] h-[30px]`}
      ></div>
      {currentCharacter.characterImg ? (
        <img
          src={currentCharacter.characterImg}
          alt="CharacterImg"
          className="object-contain w-[80%] h-[80%] cursor-pointer rounded-t-md mx-auto mt-[10px]"
        />
      ) : (
        <div className={`w-full h-full`}>
          <PreviewImage
            imgClasses="absolute object-cover rounded-md h-[200px] -translate-y-[137px] -translate-x-1/2 left-1/2"
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
      {isPending && (
        <SyncLoad conditionToLoading={!isPending} conditionToStart={isPending} className="top-[10px] right-[10px] " />
      )}
    </article>
  );
}
