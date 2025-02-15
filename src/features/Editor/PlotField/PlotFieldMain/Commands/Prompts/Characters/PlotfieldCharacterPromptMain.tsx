import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharactersByStoryId from "../../../../../../../hooks/Fetching/Character/useGetAllCharactersByStoryId";
import useGetTranslationCharacters from "../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import { CharacterValueTypes } from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";

type PlotfieldCharacterPromptMainTypes = {
  inputClasses?: string;
  imgClasses?: string;
  containerClasses?: string;
  initCharacterValue: CharacterValueTypes;
  onBlur: (value: CharacterValueTypes) => void;
  setCreateNewCharacter?: React.Dispatch<React.SetStateAction<boolean>>;
  setCreatingCharacterName?: React.Dispatch<React.SetStateAction<string>>;
};

const PlotfieldCharacterPromptMain = ({
  onBlur,
  initCharacterValue,
  inputClasses,
  imgClasses,
  containerClasses,
  setCreateNewCharacter,
  setCreatingCharacterName,
}: PlotfieldCharacterPromptMainTypes) => {
  const { storyId } = useParams();
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const currentInput = useRef<HTMLInputElement>(null);

  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>(
    initCharacterValue || {
      _id: "",
      characterName: "",
      imgUrl: "",
    }
  );

  useEffect(() => {
    if (initCharacterValue) {
      setCharacterValue(initCharacterValue);
    }
  }, [initCharacterValue, characterValue._id]);

  const { data: allTranslatedCharacters } = useGetTranslationCharacters({
    storyId: storyId || "",
    language: "russian",
  });

  const { data: allCharacters } = useGetAllCharactersByStoryId({
    storyId: storyId || "",
  });

  const combinedCharacters = useMemo(() => {
    if (allTranslatedCharacters && allCharacters) {
      return allCharacters.map((c) => {
        const currentTranslatedCharacter = allTranslatedCharacters.find((tc) => tc.characterId === c._id);
        return {
          characterImg: c?.img || "",
          characterId: c._id,
          characterName:
            currentTranslatedCharacter?.translations?.find((tc) => tc.textFieldName === "characterName")?.text || "",
        };
      });
    } else {
      return [];
    }
  }, [allTranslatedCharacters, allCharacters]);

  const filteredCharacters = useMemo(() => {
    if (combinedCharacters) {
      if (characterValue?.characterName?.trim().length) {
        return combinedCharacters.filter((cc) =>
          cc?.characterName?.toLowerCase().includes(characterValue?.characterName?.trim()?.toLowerCase() || "")
        );
      } else {
        return combinedCharacters;
      }
    } else {
      return [];
    }
  }, [combinedCharacters, characterValue]);

  const updateCharacterNameOnBlur = (value?: CharacterValueTypes) => {
    const localCharacterValue = value?._id ? value : characterValue;
    if (
      (localCharacterValue.characterName?.trim().length &&
        initCharacterValue.characterName === localCharacterValue.characterName) ||
      !localCharacterValue.characterName?.trim().length
    ) {
      return;
    }

    const tranlsatedCharacter = allTranslatedCharacters?.find((tc) =>
      tc.translations?.find(
        (tct) =>
          tct.textFieldName === "characterName" &&
          tct.text?.toLowerCase() === localCharacterValue?.characterName?.toLowerCase()
      )
    );

    if (!tranlsatedCharacter) {
      if (setCreateNewCharacter && setCreatingCharacterName) {
        setCreatingCharacterName(localCharacterValue.characterName || "");
        setCreateNewCharacter(true);
      }
      console.log("Non-existing character");
      return;
    }

    const character = allCharacters?.find((c) => c._id === tranlsatedCharacter?.characterId);

    const characterObj = {
      _id: character?._id || null,
      characterName: tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || null,
      imgUrl: character?.img || null,
    };

    onBlur(characterObj);
    setCharacterValue(characterObj);
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({
    length: filteredCharacters.length,
  });

  return (
    <Popover open={showCharacterModal} onOpenChange={setShowCharacterModal}>
      <PopoverTrigger asChild>
        <div
          className={`${containerClasses ? containerClasses : "flex-grow flex justify-between items-center"} relative`}
        >
          <PlotfieldInput
            ref={currentInput}
            value={characterValue?.characterName || ""}
            onChange={(e) => {
              setShowCharacterModal(true);
              setCharacterValue((prev) => ({
                ...prev,
                characterName: e.target.value,
              }));
            }}
            onBlur={() => updateCharacterNameOnBlur()}
            className={`${inputClasses ? inputClasses : "h-[50px] w-full pr-[50px] text-text md:text-[17px]"}`}
            placeholder="Имя Персонажа"
          />

          <img
            src={characterValue?.imgUrl || ""}
            alt="CharacterImg"
            className={`${characterValue?.imgUrl?.trim().length ? "" : "hidden"} ${
              imgClasses ? imgClasses : "w-[40px] object-cover top-[5px] right-[3px] rounded-md absolute"
            }`}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
        {filteredCharacters?.length ? (
          filteredCharacters?.map((c, i) => (
            <Button
              key={`${c.characterId}-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={(e) => {
                e.stopPropagation();

                const obj = {
                  _id: c?.characterId,
                  characterName: c?.characterName,
                  imgUrl: c?.characterImg,
                };
                updateCharacterNameOnBlur(obj);
                setShowCharacterModal(false);
              }}
              className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            >
              <p className="text-[16px] rounded-md">
                {c.characterName.length > 20 ? c.characterName.substring(0, 20) + "..." : c.characterName}
              </p>
              {c.characterImg ? (
                <img src={c.characterImg || ""} alt="CharacterImg" className="w-[30px] rounded-md" />
              ) : null}
            </Button>
          ))
        ) : (
          <Button
            type="button"
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            Пусто
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default PlotfieldCharacterPromptMain;
