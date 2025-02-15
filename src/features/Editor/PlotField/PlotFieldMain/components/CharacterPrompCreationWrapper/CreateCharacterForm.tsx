import { toastErrorStyles, toastSuccessStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import { Sheet, SheetClose, SheetContent, SheetFooter } from "@/components/ui/sheet";
import useGetMainCharacterByStoryId from "@/hooks/Fetching/Character/useGetMainCharacterByStoryId";
import useUpdateImg from "@/hooks/Patching/useUpdateImg";
import useCreateCharacter from "@/hooks/Posting/Character/useCreateCharacter";
import {
  CHARACTER_RUS_TYPES,
  CHARACTER_RUS_TYPES_WITHOUT_MC,
  CharacterRusTypes,
  CharacterTypes,
} from "@/types/StoryData/Character/CharacterTypes";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import PreviewImage from "@/ui/shared/PreviewImage";
import PlotfieldTextarea from "@/ui/Textareas/PlotfieldTextarea";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { CharacterValueTypes } from "../../Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";

type CreateCharacterFormTypes = {
  setStartCreatingCharacter: React.Dispatch<React.SetStateAction<boolean>>;
  onBlur: (value: CharacterValueTypes) => void;
  startCreatingCharacter: boolean;
  creatingCharacterName: string;
  creatingCharacterUnknownName?: string;
};

export default function CreateCharacterForm({
  setStartCreatingCharacter,
  onBlur,
  startCreatingCharacter,
  creatingCharacterName,
  creatingCharacterUnknownName,
}: CreateCharacterFormTypes) {
  const { storyId } = useParams();
  const [characterType, setCharacterType] = useState<CharacterTypes>("minorcharacter");
  const [characterName, setCharacterName] = useState(creatingCharacterName || "");
  const [characterUnknownName, setCharacterUnknownName] = useState(creatingCharacterUnknownName || "");
  const [characterDescription, setCharacterDescription] = useState("");
  const [nameTag, setNameTag] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(null);

  useEffect(() => {
    if (creatingCharacterName) {
      setCharacterName(creatingCharacterName);
    }
  }, [creatingCharacterName]);

  useEffect(() => {
    if (creatingCharacterUnknownName) {
      setCharacterUnknownName(creatingCharacterUnknownName);
    }
  }, [creatingCharacterUnknownName]);

  const uploadImgMutation = useUpdateImg({
    path: "/characters",
    preview: imagePreview,
  });

  const createCharacter = useCreateCharacter({
    characterType,
    debouncedValue: "",
    name: characterName,
    storyId: storyId || "",
    description: characterDescription,
    language: "russian",
    nameTag,
    unknownName: characterUnknownName,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (characterType === "emptycharacter" || characterType === "maincharacter") {
      if (!characterName.trim().length) {
        toast("Имя обязательно", toastErrorStyles);
        return;
      }
    } else if (characterType === "minorcharacter") {
      if (
        !characterName.trim().length ||
        !characterUnknownName.trim().length ||
        !characterDescription.trim().length ||
        !nameTag.trim().length
      ) {
        toast("Имя, описание, скрытое имя и тэг обязательны", toastErrorStyles);
        return;
      }
    }

    const characterId = generateMongoObjectId();
    setStartCreatingCharacter(false);
    toast("Персонаж создан", toastSuccessStyles);
    onBlur({ characterName, _id: characterId, imgUrl: typeof imagePreview === "string" ? imagePreview : "" });
    await createCharacter.mutateAsync({ characterId });
    if (imagePreview) {
      await uploadImgMutation.mutateAsync({ bodyId: characterId });
    }
  };

  return (
    <Sheet onOpenChange={setStartCreatingCharacter} open={startCreatingCharacter}>
      <SheetContent onSubmit={handleSubmit} side={"top"}>
        <div className="flex md:flex-row flex-col gap-[10px]">
          <div className="flex flex-col gap-[10px] flex-grow max-w-[200px]">
            <div className="w-full h-[150px] rounded-md bg-secondary relative">
              <PreviewImage
                imagePreview={imagePreview}
                imgClasses="absolute w-[150px] -translate-x-1/2 left-1/2 object-cover"
                setPreview={setImagePreview}
              />
            </div>
            <CharacterTypeDropDown setCharacterType={setCharacterType} />
          </div>

          <div className="flex flex-col gap-[5px] w-full">
            <div className="flex md:flex-row flex-col gap-[5px]">
              <PlotfieldInput
                placeholder="Имя"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="text-text opacity-90 flex-grow"
              />
              <PlotfieldInput
                placeholder="Тэг"
                value={nameTag}
                onChange={(e) => setNameTag(e.target.value)}
                className={`${
                  characterType === "minorcharacter" ? "" : "hidden"
                } text-text opacity-90 md:w-[100px] flex-grow`}
              />
            </div>
            <PlotfieldInput
              placeholder="Скрытое Имя"
              value={characterUnknownName}
              onChange={(e) => setCharacterUnknownName(e.target.value)}
              className={`${characterType === "minorcharacter" ? "" : "hidden"}  text-text opacity-90 w-full`}
            />
            <PlotfieldTextarea
              value={characterDescription}
              placeholder="Описание"
              onChange={(e) => setCharacterDescription(e.target.value)}
              className={`${
                characterType === "minorcharacter" ? "" : "hidden"
              }   text-text opacity-90 w-full flex-grow max-h-[115px]`}
            />
          </div>
        </div>
        <SheetFooter className="mt-[10px]">
          <SheetClose asChild>
            <Button
              onClick={handleSubmit}
              className="text-text bg-brand-gradient-left hover:opacity-90 active:scale-[.99] transition-all"
              type="submit"
            >
              Создать
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

type CharacterTypeDropDownTypes = {
  setCharacterType: React.Dispatch<React.SetStateAction<CharacterTypes>>;
};

function CharacterTypeDropDown({ setCharacterType }: CharacterTypeDropDownTypes) {
  const { storyId } = useParams();
  const [characterTypeRus, setCharacterTypeRus] = useState<CharacterRusTypes>("Второстепенный Персонаж");
  const { data } = useGetMainCharacterByStoryId({ storyId: storyId || "", language: "russian" });
  const [MCExist, setMCExist] = useState(false);

  useEffect(() => {
    if (data?.characterId) {
      setMCExist(true);
    }
  }, [data]);

  return (
    <SelectWithBlur
      onValueChange={(v: CharacterRusTypes) => {
        const characterEng: CharacterTypes =
          v === "Главный Персонаж"
            ? "maincharacter"
            : v === "Второстепенный Персонаж"
            ? "minorcharacter"
            : "emptycharacter";
        setCharacterTypeRus(v);
        setCharacterType(characterEng);
      }}
    >
      <SelectTrigger className={`capitalize w-full text-text`}>
        <SelectValue
          placeholder={characterTypeRus}
          onBlur={(v) => v.currentTarget.blur()}
          className={`capitalize text-text text-[25px] py-[20px]`}
        />
      </SelectTrigger>
      <SelectContent>
        {(MCExist ? CHARACTER_RUS_TYPES_WITHOUT_MC : CHARACTER_RUS_TYPES).map((pv) => {
          return (
            <SelectItem key={pv} value={pv} className={`${pv === characterTypeRus ? "hidden" : ""} capitalize w-full`}>
              {pv}
            </SelectItem>
          );
        })}
      </SelectContent>
    </SelectWithBlur>
  );
}
