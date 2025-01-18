import { useEffect, useState } from "react";
import useGetCharacterById from "../../../../../../hooks/Fetching/Character/useGetCharacterById";
import { CharacterTypes, EmotionsTypes } from "../../../../../../types/StoryData/Character/CharacterTypes";
import { AllMightySearchCharacterResultTypes } from "../../../hooks/useGetPaginatedTranslationCharacter";
import { NewElementTypes } from "../AllMightySearchMainContent";
import { EditingCharacterTypes, FinedCharacteristicTypes } from "./AllMightySearchMainContentCharacter";
import useGetAllCharacteristicsByStoryId from "../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import useUpdateImg from "../../../../../../hooks/Patching/useUpdateImg";
import useEscapeOfModal from "../../../../../../hooks/UI/useEscapeOfModal";
import PreviewImage from "../../../../../../ui/shared/PreviewImage";
import { CharacterCardBackSide } from "./CharacterCardBackSide";
import { SuggestiveModal } from "./SuggestiveModal";

type ContentCharacterCardTypes = {
  characterId: string;
  characterText?: string;
  storyId: string;
  page: number;
  limit: number;
  characterDescription: string;
  characterUnknownName: string;
  characterType: CharacterTypes;
  newElement: NewElementTypes;
  updatedCharacter: EditingCharacterTypes | null;
  mainCharacterWasChanged: boolean;
  setMainCharacterWasChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingCharacter: React.Dispatch<React.SetStateAction<EditingCharacterTypes | null>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setNewElement: React.Dispatch<React.SetStateAction<NewElementTypes>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchCharacterResultTypes[]>>;
};

export function ContentCharacterCard({
  characterId,
  newElement,
  updatedCharacter,
  mainCharacterWasChanged,
  setMainCharacterWasChanged,
  setAllPaginatedResults,
  setNewElement,
  setEditingCharacter,
  setStartEditing,
  storyId,
  characterText,
  characterType,
  characterDescription,
  characterUnknownName,
}: ContentCharacterCardTypes) {
  const { data: character } = useGetCharacterById({ characterId });
  const { data: translatedCharacteristics } = useGetAllCharacteristicsByStoryId({ storyId, language: "russian" });
  const [currentCharacterType, setCurrentCharacterType] = useState(characterType);
  const [currentCharacterName, setCurrentCharacterName] = useState(characterText || "");
  const [currentCharacterDescription, setCurrentCharacterDescription] = useState(characterDescription || "");
  const [currentCharacterUnknownName, setCurrentCharacterUnknownName] = useState(characterUnknownName || "");
  const [currentCharacterNameTag, setCurrentCharacterNameTag] = useState("");
  const [currentCharacterImg, setCurrentCharacterImg] = useState("");

  useEffect(() => {
    if (character) {
      if (character.nameTag) {
        setCurrentCharacterNameTag(character.nameTag);
      }
      if (character.img) {
        setCurrentCharacterImg(character.img);
      }
    }
  }, [character]);

  useEffect(() => {
    if (mainCharacterWasChanged && characterType === "maincharacter" && characterId !== updatedCharacter?.characterId) {
      setAllPaginatedResults((pr) =>
        pr.map((prr) => ({
          ...prr,
          results: prr.results.map((pres) => ({
            ...pres,
            characterType: characterId === pres.characterId ? "minorcharacter" : pres.characterType,
          })),
        }))
      );

      setCurrentCharacterType("minorcharacter");
      setMainCharacterWasChanged(false);
    }
  }, [mainCharacterWasChanged, characterType]);

  useEffect(() => {
    if (updatedCharacter && updatedCharacter.characterId === characterId) {
      setCurrentCharacterName(updatedCharacter.name);
      setCurrentCharacterUnknownName(updatedCharacter.unknownName || "");
      setCurrentCharacterDescription(updatedCharacter.description || "");
      setCurrentCharacterNameTag(updatedCharacter.nameTag || "");
      setCurrentCharacterImg(updatedCharacter.img || "");

      setCurrentCharacterType(updatedCharacter.characterType);
    }
  }, [updatedCharacter, characterId]);

  const characterTypeToRus =
    characterType === "maincharacter" ? "ГГ" : characterType === "minorcharacter" ? "Второй План" : "Третий План";

  const [showSuggestiveModal, setShowSuggestiveModal] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [showBackSide, setShowBackSide] = useState(false);

  const [characteristics, setCharacteristics] = useState<FinedCharacteristicTypes[]>([]);
  const [emotions, setEmotions] = useState<EmotionsTypes[]>([]);

  const uploadImgMutation = useUpdateImg({
    id: characterId,
    path: "/characters",
    preview: imagePreview,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted && imagePreview) {
      uploadImgMutation.mutate({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    if (translatedCharacteristics) {
      const characteristicsArray = [] as FinedCharacteristicTypes[];
      translatedCharacteristics.map((t) =>
        characteristicsArray.push({
          _id: t._id,
          characteristicId: t.characteristicId,
          characteristicText: (t.translations || [])[0]?.text,
        })
      );
      setCharacteristics(characteristicsArray);
    }
  }, [translatedCharacteristics]);

  useEffect(() => {
    if (character) {
      setEmotions(character?.emotions);
    }
  }, [character]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEscapeOfModal({ setValue: setShowBackSide, value: showBackSide });

  return (
    <div
      className={`flex-grow overflow-hidden xl:max-w-[350px] rounded-md shadow-sm bg-accent ${
        !showBackSide ? "flex min-w-[250px]" : "p-[10px] pb-[0px] flex flex-col min-w-[350px] "
      } transition-colors h-[350px] min-h-fit relative`}
    >
      {!showBackSide ? (
        <>
          {currentCharacterImg ? (
            <img
              src={currentCharacterImg}
              alt={currentCharacterName}
              className="w-[80%] h-[250px] absolute object-contain left-1/2 -translate-x-1/2 translate-y-[40px]"
            />
          ) : (
            <PreviewImage
              imagePreview={imagePreview}
              setPreview={setImagePreview}
              imgClasses="w-[80%] h-[250px] object-contain translate-y-[40px]"
            />
          )}
          <p
            className={`absolute text-[13px] top-0 left-0 px-[10px] rounded-br-md ${
              characterType === "maincharacter"
                ? "bg-red  text-white"
                : characterType === "minorcharacter"
                ? "bg-blue-600 text-white"
                : "bg-gray-600 text-white"
            }`}
          >
            {characterTypeToRus}
          </p>

          <div
            className={`${
              character?.nameTag ? "" : "hidden"
            } absolute top-[0rem] right-[0rem] py-[5px] px-[10px] rounded-bl-full`}
          >
            <p className="text-[14px] text-paragraph translate-x-[5px] -translate-y-[2px]">{character?.nameTag}</p>
          </div>

          <p
            onContextMenu={(e) => {
              e.preventDefault();
              setShowSuggestiveModal((prev) => !prev);
            }}
            onClick={() => {
              setShowBackSide((prev) => !prev);
              setShowSuggestiveModal(false);
            }}
            className="mt-auto w-full text-heading cursor-pointer hover:opacity-80 transition-opacity text-[18px] px-[10px] py-[5px]"
          >
            {currentCharacterName}
          </p>
        </>
      ) : (
        <>
          <CharacterCardBackSide
            setShowBackSide={setShowBackSide}
            characterDescription={currentCharacterDescription}
            characterName={currentCharacterName}
            characterTag={currentCharacterNameTag}
            characterType={currentCharacterType}
            characterUnknownName={currentCharacterUnknownName}
            showBackSide={showBackSide}
            emotions={emotions}
            characteristics={characteristics}
            characterId={characterId}
          />
        </>
      )}

      <SuggestiveModal
        showBackSide={showBackSide}
        setEditingCharacter={setEditingCharacter}
        setStartEditing={setStartEditing}
        showSuggestiveModal={showSuggestiveModal}
        characterId={characterId}
        newElement={newElement}
        characterDescription={currentCharacterDescription}
        characterUnknownName={currentCharacterUnknownName}
        characterImg={currentCharacterImg}
        characterName={currentCharacterName}
        characterType={currentCharacterType}
        nameTag={currentCharacterNameTag}
        setShowSuggestiveModal={setShowSuggestiveModal}
        setAllPaginatedResults={setAllPaginatedResults}
        setNewElement={setNewElement}
      />
    </div>
  );
}
