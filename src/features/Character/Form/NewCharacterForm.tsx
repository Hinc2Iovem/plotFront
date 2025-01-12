import { toastErrorStyles, toastNotificationStyles, toastSuccessStyles } from "@/components/shared/toastStyles";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StoryAttributesClearButton from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesClearButton";
import StoryAttributesCreateButton from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesCreateButton";
import StoryAttributesImgBlock from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesImgBlock";
import useGetMainCharacterByStoryId from "@/hooks/Fetching/Character/useGetMainCharacterByStoryId";
import useUpdateFullCharacterTranslation from "@/hooks/Patching/Translation/useUpdateFullCharacterTranslation";
import useCreateCharacter from "@/hooks/Posting/Character/useCreateCharacter";
import { checkObjectsIdenticalShallow } from "@/utils/checkObjectsIdenticalShallow";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { SearchCharacterVariationTypes, StoryNewCharacterTypes } from "../CharacterListPage";
import SelectCharacterType from "../shared/SelectCharacterType";
import useUpdateImg from "@/hooks/Patching/useUpdateImg";

type NewCharacterFormTypes = {
  searchValue: string;
  searchCharacterType: SearchCharacterVariationTypes;
  initCharacterValue: StoryNewCharacterTypes;
  characterValue: StoryNewCharacterTypes;
  setCharacterValue: React.Dispatch<React.SetStateAction<StoryNewCharacterTypes>>;
  setInitCharacterValue: React.Dispatch<React.SetStateAction<StoryNewCharacterTypes>>;
  setCreated: React.Dispatch<React.SetStateAction<boolean | null>>;
};

export default function NewCharacterForm({
  characterValue,
  initCharacterValue,
  setCharacterValue,
  setInitCharacterValue,
  searchValue,
  searchCharacterType,
  setCreated,
}: NewCharacterFormTypes) {
  const { storyId } = useParams();
  const { data: character } = useGetMainCharacterByStoryId({ storyId: storyId || "", language: "russian" });
  const [mainCharacterAlreadyExists, setMainCharacterAlreadyExists] = useState(false);
  const createOrSave = !characterValue.characterId.trim().length ? "create" : "save";

  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(characterValue.characterImg || "");

  useEffect(() => {
    setPreview(characterValue.characterImg || "");
  }, [characterValue.characterImg]);

  const uploadImgMutation = useUpdateImg({
    path: "/characters",
    preview: imagePreview,
  });

  useEffect(() => {
    if (character) {
      setMainCharacterAlreadyExists(true);
    }
  }, [character]);

  const { mutateAsync: createCharacter, isPaused: creating } = useCreateCharacter({
    characterType: characterValue.characterType,
    name: characterValue.characterName,
    searchCharacterType: searchCharacterType === "all" ? ("" as SearchCharacterVariationTypes) : searchCharacterType,
    storyId: storyId || "",
    description: characterValue.characterDescription,
    nameTag: characterValue.characterTag,
    unknownName: characterValue.characterUnknownName,
    debouncedValue: searchValue,
    language: "russian",
  });

  const { mutateAsync: updateCharacter, isPaused: updating } = useUpdateFullCharacterTranslation({
    characterId: characterValue.characterId,
    language: "russian",
    storyId: storyId || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (characterValue.characterType === "emptycharacter" || characterValue.characterType === "maincharacter") {
      if (!characterValue.characterName.trim().length) {
        toast("Имя Обязательно", toastErrorStyles);
        return;
      }
    } else if (characterValue.characterType === "minorcharacter") {
      if (
        !characterValue?.characterUnknownName?.trim().length ||
        !characterValue.characterDescription.trim().length ||
        !characterValue?.characterTag?.trim().length
      ) {
        toast("Скрытое Имя, Описание и Тэг Обязательны", toastErrorStyles);
        return;
      }
    }

    if (
      characterValue.characterType === "maincharacter" &&
      mainCharacterAlreadyExists &&
      character?.characterId !== characterValue.characterId
    ) {
      toast(`Главный Герой уже существует`, toastErrorStyles);
      return;
    }

    if (createOrSave === "create") {
      const characterId = generateMongoObjectId();
      await createCharacter({ characterId });
      if (imagePreview) {
        await uploadImgMutation.mutateAsync({ bodyId: characterId });
      }
    } else {
      if (checkObjectsIdenticalShallow(characterValue, initCharacterValue)) {
        toast("Значения не были обновлены!", toastNotificationStyles);
        return;
      }
      if (imagePreview !== characterValue.characterImg) {
        await uploadImgMutation.mutateAsync({ bodyId: characterValue.characterId });
      }
      await updateCharacter({ searchCharacterType, debouncedValue: searchValue, ...characterValue });
    }

    toast(`Персонаж был ${createOrSave === "create" ? "создан" : "обновлён"}`, toastSuccessStyles);
    setInitCharacterValue(characterValue);
    setCreated((prev) => (typeof prev === "boolean" ? !prev : true));
  };

  return (
    <form onSubmit={handleSubmit} className="md:max-w-[355px] w-full flex h-fit flex-col gap-[5px]">
      <StoryAttributesImgBlock imagePreview={imagePreview} setPreview={setPreview} />
      <TypeTagSection characterValue={characterValue} setCharacterValue={setCharacterValue} />
      <Input
        value={characterValue.characterName}
        onChange={(e) =>
          setCharacterValue((prev) => ({
            ...prev,
            characterName: e.target.value,
          }))
        }
        placeholder="Имя Персонажа"
        className="w-full border-border border-[1px] rounded-md px-[10px] py-[5px] text-text md:text-[20px]"
      />
      <Input
        value={characterValue.characterUnknownName}
        onChange={(e) =>
          setCharacterValue((prev) => ({
            ...prev,
            characterUnknownName: e.target.value,
          }))
        }
        placeholder="Скрытое Имя"
        className={`${
          characterValue.characterType === "minorcharacter" ? "" : "hidden"
        } w-full border-border border-[1px] rounded-md px-[10px] py-[5px] text-text md:text-[20px]`}
      />
      <Textarea
        value={characterValue.characterDescription}
        onChange={(e) =>
          setCharacterValue((prev) => ({
            ...prev,
            characterDescription: e.target.value,
          }))
        }
        placeholder="Описание Персонажа"
        className={`${
          characterValue.characterType === "minorcharacter" ? "" : "hidden"
        } w-full border-border border-[1px] h-full rounded-md px-[10px] py-[5px] max-h-[200px] min-h-[100px] text-text md:text-[20px]`}
      />
      <StoryAttributesCreateButton
        disabled={checkObjectsIdenticalShallow(characterValue, initCharacterValue) || creating || updating}
        createOrSave={createOrSave}
      />
      <StoryAttributesClearButton
        disabled={creating || updating}
        clear={() => {
          const defaultObj = {
            characterId: "",
            characterImg: "",
            characterType: "" as Exclude<SearchCharacterVariationTypes, "all">,
            characterName: "",
            characterUnknownName: "",
            characterDescription: "",
            characterTag: "",
          };
          setCharacterValue(defaultObj);
          setInitCharacterValue(defaultObj);
        }}
      />
    </form>
  );
}

type TypeTagSectionTypes = {
  characterValue: StoryNewCharacterTypes;
  setCharacterValue: React.Dispatch<React.SetStateAction<StoryNewCharacterTypes>>;
};

function TypeTagSection({ characterValue, setCharacterValue }: TypeTagSectionTypes) {
  return (
    <div className="w-full flex gap-[5px]">
      <SelectCharacterType<Exclude<SearchCharacterVariationTypes, "all">>
        onValueChange={(v) =>
          setCharacterValue((prev) => ({
            ...prev,
            characterType: v,
          }))
        }
        characterType={characterValue.characterType}
        triggerClasses={`text-text border-border border-[1px] rounded-md ${
          characterValue.characterType === "minorcharacter" ? "w-[calc(50%-2.5px)]" : "w-full"
        } text-[20px]`}
        valueClasses=""
        withAll={false}
      />

      <Input
        placeholder="Тэг"
        value={characterValue.characterTag}
        onChange={(e) =>
          setCharacterValue((prev) => ({
            ...prev,
            characterTag: e.target.value,
          }))
        }
        className={`${
          characterValue.characterType === "minorcharacter" ? "" : "hidden"
        } border-border text-text md:text-[20px] border-[1px] rounded-md px-[10px] py-[5px] w-[calc(50%-2.5px)]`}
      />
    </div>
  );
}
