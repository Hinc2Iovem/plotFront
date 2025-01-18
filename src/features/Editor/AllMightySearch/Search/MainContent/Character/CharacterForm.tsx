import { Button } from "@/components/ui/button";
import SelectCharacterType from "@/features/Character/shared/SelectCharacterType";
import { CharacterTypes } from "@/types/StoryData/Character/CharacterTypes";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import PreviewImage from "@/ui/shared/PreviewImage";
import PlotfieldTextarea from "@/ui/Textareas/PlotfieldTextarea";
import React from "react";

type CharacterFormTypes = {
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterName: React.Dispatch<React.SetStateAction<string | undefined>>;
  setCharacterUnknownName: React.Dispatch<React.SetStateAction<string | undefined>>;
  setCharacterDescription: React.Dispatch<React.SetStateAction<string | undefined>>;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null | ArrayBuffer>>;
  setCharacterType: React.Dispatch<React.SetStateAction<CharacterTypes>>;
  suggestReassigningMainCharacter?: boolean;
  characterUnknownName?: string;
  characterDescription?: string;
  characterName?: string;
  imagePreview: string | null | ArrayBuffer;
  characterType: CharacterTypes;
  type: "create" | "edit";
  handleSubmit?: ({
    e,
    reassignMainCharacter,
  }: {
    e?: React.FormEvent;
    reassignMainCharacter?: boolean;
  }) => Promise<void>;
  onSubmit?: (e: React.FormEvent) => void;
};

export default function CharacterForm({
  characterDescription,
  characterName,
  characterType,
  characterUnknownName,
  imagePreview,
  handleSubmit,
  setCharacterDescription,
  setCharacterName,
  setCharacterType,
  setCharacterUnknownName,
  setImagePreview,
  setStarted,
  onSubmit,
  type,
  suggestReassigningMainCharacter,
}: CharacterFormTypes) {
  return (
    <form
      onSubmit={(e) => {
        if (type === "create" && onSubmit) {
          onSubmit(e);
        } else if (type === "edit" && handleSubmit) {
          handleSubmit({ e });
        }
      }}
      className={`${suggestReassigningMainCharacter ? "hidden" : ""} w-full flex flex-col gap-[5pxpx] p-[10px]`}
    >
      {/* add nametag */}
      <div className="w-full flex gap-[5px] flex-wrap">
        <div className="flex-grow relative min-w-[250px]">
          <PlotfieldInput
            placeholder="Имя"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="border-[1px] border-border"
          />
          <div className="absolute px-[10px] py-[5px] top-[-10px] right-[10px] bg-secondary">
            <p className="text-text text-[13px]">Имя</p>
          </div>
        </div>
        {characterType === "minorcharacter" ? (
          <>
            <div className="flex-grow relative min-w-[250px]">
              <PlotfieldInput
                placeholder="Скрытое Имя"
                value={characterUnknownName}
                onChange={(e) => setCharacterUnknownName(e.target.value)}
                className="border-[1px] border-border"
              />
              <div className="absolute px-[10px] py-[5px] top-[-10px] right-[10px] bg-secondary">
                <p className="text-text text-[13px]">Скрытое Имя</p>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {characterType === "minorcharacter" ? (
        <div className="relative w-full mt-[5px]">
          <PlotfieldTextarea
            placeholder="Описание"
            value={characterDescription}
            onChange={(e) => setCharacterDescription(e.target.value)}
            className="border-[1px] border-border min-h-[7rem]"
          />
          <div className="absolute px-[10px] py-[5px] top-[-10px] right-[10px] bg-secondary">
            <p className="text-text text-[13px]">Описание</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-[5px] py-[5px] items-center justify-center">
        <SelectCharacterType<CharacterTypes>
          onValueChange={(value) => {
            setCharacterType(value);
          }}
          triggerClasses="text-text border-border"
          valueClasses=""
          withAll={false}
          characterType={characterType}
        />

        <div className="w-[200px] h-[150px] relative bg-primary rounded-md">
          <PreviewImage
            imagePreview={imagePreview}
            imgClasses="absolute w-[150px] -translate-x-1/2 left-1/2 object-cover"
            setPreview={setImagePreview}
          />
        </div>
      </div>

      <div className="flex gap-[10px] w-full">
        <Button
          onClick={() => setStarted(false)}
          type="button"
          className="bg-accent flex-grow justify-center text-text hover:bg-orange active:scale-[.99] transition-all"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          className="flex-grow justify-center bg-brand-gradient text-white hover:shadow-sm hover:shadow-brand-gradient-left acitve:scale-[.99] transition-all"
        >
          Сохранить
        </Button>
      </div>
    </form>
  );
}
