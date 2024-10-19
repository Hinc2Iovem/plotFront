import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AllPossiblePlotFieldCommands,
  AllPossibleSayPlotFieldCommands,
} from "../../../../../../const/PLOTFIELD_COMMANDS";
import useGetTranslationCharacters from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";
import useCreateAchievement from "../hooks/Achievement/useCreateAchievement";
import useCreateAmbient from "../hooks/Ambient/useCreateAmbient";
import useCreateBackground from "../hooks/Background/useCreateBackground";
import useCreateCall from "../hooks/Call/useCreateCall";
import useCreateChoice from "../hooks/Choice/useCreateChoice";
import useCreateComment from "../hooks/Comment/useCreateComment";
import useCreateCondition from "../hooks/Condition/useCreateCondition";
import useCreateCutScene from "../hooks/CutScene/useCreateCutScene";
import useCreateEffect from "../hooks/Effect/useCreateEffect";
import useCreateGetItem from "../hooks/GetItem/useCreateGetItem";
import useCreateCommandIf from "../hooks/If/useCreateCommandIf";
import useCreateKey from "../hooks/Key/useCreateKey";
import useCreateMove from "../hooks/Move/useCreateMove";
import useCreateMusic from "../hooks/Music/useCreateMusic";
import useCreateName from "../hooks/Name/useCreateName";
import useCreateSayCommand from "../hooks/Say/useCreateSayCommand";
import useCreateSound from "../hooks/Sound/useCreateSound";
import useCreateSuit from "../hooks/Suit/useCreateSuit";
import useUpdateCommandName from "../hooks/useUpdateCommandName";
import useCreateWait from "../hooks/Wait/useCreateWait";
import useCreateWardrobe from "../hooks/Wardrobe/useCreateWardrobe";
import PlotFieldBlankCreateCharacter from "./PlotFieldBlankCreateCharacter";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import useTopologyBlocks from "../../../../Flowchart/Context/TopologyBlockContext";
import { makeTopologyBlockName } from "../../../../Flowchart/utils/makeTopologyBlockName";
import useConditionBlocks from "../Condition/Context/ConditionContext";
import AsideScrollable from "../../../../../shared/Aside/AsideScrollable/AsideScrollable";

type PlotFieldBlankTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  commandIfId: string;
  isElse?: boolean;
};

const AllCommands = [
  "achievement",
  "notify",
  "hint",
  "author",
  "ambient",
  "background",
  "call",
  "choice",
  "if",
  "condition",
  "cutscene",
  "effect",
  "getitem",
  "key",
  "move",
  "music",
  "name",
  "sound",
  "suit",
  "wait",
  "wardrobe",
  "comment",
];

export default function PlotfieldBlank({
  plotFieldCommandId,
  topologyBlockId,
  commandIfId,
  isElse,
}: PlotFieldBlankTypes) {
  const { storyId } = useParams();
  const { episodeId } = useParams();

  const { getTopologyBlock } = useTopologyBlocks();
  const { addConditionBlock } = useConditionBlocks();
  const [showCreateCharacterModal, setShowCreateCharacterModal] =
    useState(false);

  const { data: translatedCharacters } = useGetTranslationCharacters({
    storyId: storyId || "",
    language: "russian",
  });

  const promptRef = useRef<HTMLDivElement>(null);
  const [showPromptValues, setShowPromptValues] = useState(false);
  const [value, setValue] = useState("");

  const allPromptValues = useMemo(() => {
    const res = [...AllCommands];
    if (translatedCharacters) {
      translatedCharacters.map((tc) => {
        const characterName = tc.translations?.find(
          (t) => t.textFieldName === "characterName"
        )?.text;
        if (characterName) {
          res.push(characterName);
        }
      });
    }
    return res;
  }, [translatedCharacters]);

  const allCharacterNames = useMemo(() => {
    const res: string[] = [];
    if (translatedCharacters) {
      translatedCharacters.map((tc) => {
        const characterName = tc.translations?.find(
          (t) => t.textFieldName === "characterName"
        )?.text;
        if (characterName) {
          res.push(characterName.toLowerCase());
        }
      });
    }
    return res;
  }, [translatedCharacters]);

  const filteredPromptValues = useMemo(() => {
    if (value?.trim().length) {
      return allPromptValues.filter((pv) =>
        pv.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      return allPromptValues;
    }
  }, [allPromptValues, value]);

  const currentInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!showCreateCharacterModal && !commandIfId?.trim().length) {
      currentInput.current?.focus();
    }
  }, [showCreateCharacterModal]);

  const updateCommandName = useUpdateCommandName({
    plotFieldCommandId,
    value,
  });

  const createSayCommand = useCreateSayCommand({
    plotFieldCommandId,
    topologyBlockId,
  });

  const createCommandAchievement = useCreateAchievement({
    plotFieldCommandId,
    storyId: storyId ?? "",
    topologyBlockId,
  });

  const createCommandAmbient = useCreateAmbient({ plotFieldCommandId });
  const createBackground = useCreateBackground({ plotFieldCommandId });
  const createCall = useCreateCall({ plotFieldCommandId });
  const createChoice = useCreateChoice({ plotFieldCommandId, topologyBlockId });
  const createCommandIf = useCreateCommandIf({ plotFieldCommandId });
  const createCondition = useCreateCondition({
    plotFieldCommandId,
    episodeId: episodeId || "",
  });
  const createCutScene = useCreateCutScene({ plotFieldCommandId });
  const createEffect = useCreateEffect({ plotFieldCommandId });
  const createGetItem = useCreateGetItem({
    plotFieldCommandId,
    topologyBlockId,
  });
  const createKey = useCreateKey({
    plotFieldCommandId,
    storyId: storyId ?? "",
  });
  const createMove = useCreateMove({ plotFieldCommandId });
  const createMusic = useCreateMusic({ plotFieldCommandId });
  const createName = useCreateName({ plotFieldCommandId });
  const createSound = useCreateSound({ plotFieldCommandId });
  const createSuit = useCreateSuit({ plotFieldCommandId });
  const createWait = useCreateWait({ plotFieldCommandId });
  const createComment = useCreateComment({ plotFieldCommandId });
  const createWardrobe = useCreateWardrobe({
    plotFieldCommandId,
    topologyBlockId,
  });

  const {
    updateCommandName: updateCommandNameOptimistic,
    updateCommandIfName: updateCommandIfNameOptimistic,
  } = usePlotfieldCommands();

  const handleCreatingOptimisticCommand = ({
    commandName,
    valueForSay,
    characterId,
    sayType,
    characterName,
  }: {
    valueForSay: boolean;
    commandName: AllPossiblePlotFieldComamndsTypes;
    sayType?: CommandSayVariationTypes;
    characterId?: string;
    characterName?: string;
  }) => {
    if (valueForSay) {
      if (characterId?.trim().length) {
        updateCommandNameOptimistic({
          id: plotFieldCommandId,
          newCommand: "say",
          characterId,
          characterName,
          sayType: "character",
        });
      } else {
        updateCommandNameOptimistic({
          id: plotFieldCommandId,
          newCommand: "say",
          sayType,
        });
      }
    } else {
      updateCommandNameOptimistic({
        id: plotFieldCommandId,
        newCommand: commandName,
      });
    }
  };

  const handleCreatingOptimisticCommandIf = ({
    commandName,
    valueForSay,
    characterId,
    sayType,
    characterName,
    isElse,
  }: {
    valueForSay: boolean;
    commandName: AllPossiblePlotFieldComamndsTypes;
    sayType?: CommandSayVariationTypes;
    characterId?: string;
    characterName?: string;
    isElse: boolean;
  }) => {
    if (valueForSay) {
      if (characterId?.trim().length) {
        updateCommandIfNameOptimistic({
          id: plotFieldCommandId,
          newCommand: "say",
          characterId,
          characterName,
          sayType: "character",
          isElse,
        });
      } else {
        updateCommandIfNameOptimistic({
          id: plotFieldCommandId,
          newCommand: "say",
          sayType,
          isElse,
        });
      }
    } else {
      updateCommandIfNameOptimistic({
        id: plotFieldCommandId,
        newCommand: commandName,
        isElse,
      });
    }
  };

  const handleSubmit = ({
    submittedByCharacter,
    type,
  }: {
    submittedByCharacter: boolean;
    type?: CommandSayVariationTypes;
  }) => {
    if (submittedByCharacter && type) {
      if (type === "character") {
        translatedCharacters?.map((tc) => {
          tc.translations?.map((tct) => {
            if (
              tct.textFieldName === "characterName" &&
              tct.text.toLowerCase() === value.toLowerCase()
            ) {
              if (commandIfId?.trim().length) {
                handleCreatingOptimisticCommandIf({
                  valueForSay: true,
                  commandName: "say",
                  characterId: tc.characterId,
                  characterName: value,
                  sayType: "character",
                  isElse: isElse || false,
                });
              } else {
                handleCreatingOptimisticCommand({
                  valueForSay: true,
                  commandName: "say",
                  characterId: tc.characterId,
                  characterName: value,
                  sayType: "character",
                });
              }

              createSayCommand.mutate({ type, characterId: tc.characterId });
            }
          });
        });
      } else {
        if (commandIfId?.trim().length) {
          handleCreatingOptimisticCommandIf({
            valueForSay: true,
            commandName: "say",
            sayType: type,
            isElse: isElse || false,
          });
        } else {
          handleCreatingOptimisticCommand({
            valueForSay: true,
            commandName: "say",
            sayType: type,
          });
        }
        createSayCommand.mutate({ type });
      }
      updateCommandName.mutate({ valueForSay: true });
    } else if (!submittedByCharacter) {
      const allCommands: AllPossiblePlotFieldComamndsTypes =
        value.toLowerCase() as AllPossiblePlotFieldComamndsTypes;
      if (allCommands === "achievement") {
        createCommandAchievement.mutate({});
      } else if (allCommands === "ambient") {
        createCommandAmbient.mutate({});
      } else if (allCommands === "background") {
        createBackground.mutate({});
      } else if (allCommands === "call") {
        createCall.mutate({});
      } else if (allCommands === "choice") {
        createChoice.mutate({});
      } else if (allCommands === "condition") {
        const targetBlockId = generateMongoObjectId();
        const conditionBlockId = generateMongoObjectId();
        addConditionBlock({
          plotfieldCommandId: plotFieldCommandId,
          conditionBlock: {
            conditionBlockId,
            conditionType: "else",
            isElse: true,
            orderOfExecution: null,
            targetBlockId,
            topologyBlockName: makeTopologyBlockName({
              name: getTopologyBlock()?.name || "",
              amountOfOptions:
                getTopologyBlock()?.topologyBlockInfo?.amountOfChildBlocks || 1,
            }),
            conditionName: "",
            conditionValue: null,
          },
        });

        createCondition.mutate({
          coordinatesX: getTopologyBlock().coordinatesX,
          coordinatesY: getTopologyBlock().coordinatesY,
          sourceBlockName: makeTopologyBlockName({
            name: getTopologyBlock()?.name || "",
            amountOfOptions:
              getTopologyBlock()?.topologyBlockInfo?.amountOfChildBlocks || 1,
          }),
          targetBlockId,
          topologyBlockId,
          conditionBlockId,
        });
      } else if (allCommands === "cutscene") {
        createCutScene.mutate({});
      } else if (allCommands === "effect") {
        createEffect.mutate({});
      } else if (allCommands === "getitem") {
        createGetItem.mutate({});
      } else if (allCommands === "if") {
        createCommandIf.mutate({});
      } else if (allCommands === "key") {
        createKey.mutate({});
      } else if (allCommands === "move") {
        createMove.mutate({});
      } else if (allCommands === "music") {
        createMusic.mutate({});
      } else if (allCommands === "name") {
        createName.mutate({});
      } else if (allCommands === "sound") {
        createSound.mutate({});
      } else if (allCommands === "suit") {
        createSuit.mutate({});
      } else if (allCommands === "wait") {
        createWait.mutate({});
      } else if (allCommands === "wardrobe") {
        createWardrobe.mutate({});
      } else if (allCommands === "comment") {
        createComment.mutate({});
      }

      if (commandIfId?.trim().length) {
        handleCreatingOptimisticCommandIf({
          valueForSay: false,
          commandName: allCommands,
          isElse: isElse || false,
        });
      } else {
        handleCreatingOptimisticCommand({
          valueForSay: false,
          commandName: allCommands,
        });
      }
      updateCommandName.mutate({ valueForSay: false });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim().length) {
      console.log("Заполните поле");
      return;
    }
    let submittedByCharacter = false;
    // if it's say command whether it's hint, author, notify or some character name which already exists

    if (
      allCharacterNames.includes(value.toLowerCase()) ||
      AllPossibleSayPlotFieldCommands.includes(value.toLowerCase())
    ) {
      let type: CommandSayVariationTypes = "" as CommandSayVariationTypes;
      if (
        value.toLowerCase() !== "hint" &&
        value.toLowerCase() !== "author" &&
        value.toLowerCase() !== "notify"
      ) {
        type = "character";
      } else {
        type = value as CommandSayVariationTypes;
      }

      submittedByCharacter = true;
      handleSubmit({ submittedByCharacter, type });
    } else if (AllPossiblePlotFieldCommands.includes(value.toLowerCase())) {
      // if it's any another existing command beside say and it's variations
      submittedByCharacter = false;
      handleSubmit({ submittedByCharacter });
    } else {
      // if it's not any command and if there's no such character, it suggests to create a new one

      setShowCreateCharacterModal(true);
      return;
    }
  };

  useOutOfModal({
    modalRef: promptRef,
    setShowModal: setShowPromptValues,
    showModal: showPromptValues,
  });

  return (
    <div className="shadow-sm shadow-gray-300 bg-secondary rounded-md relative w-full">
      <form
        className="px-[1rem] py-[.5rem] w-full relative"
        onSubmit={handleFormSubmit}
      >
        <input
          ref={currentInput}
          type="text"
          value={value}
          onClick={(e) => {
            e.stopPropagation();
            setShowPromptValues((prev) => !prev);
            setShowCreateCharacterModal(false);
          }}
          placeholder="ПУСТОТА"
          onChange={(e) => {
            setValue(e.target.value);
            if (!showPromptValues) {
              setShowPromptValues(true);
            }
          }}
          className="outline-none text-[1.5rem] text-text-light w-full"
        />
        <AsideScrollable
          ref={promptRef}
          className={`${
            showPromptValues && !showCreateCharacterModal ? "" : "hidden"
          } translate-y-[1rem] left-0`}
        >
          {filteredPromptValues.length > 0 ? (
            filteredPromptValues.map((pv) => (
              <button
                key={pv}
                onClick={() => {
                  setValue(pv);
                  setShowPromptValues(false);
                }}
                className="text-text-dark hover:text-text-light hover:bg-primary focus-within:text-text-light focus-within:bg-primary text-start w-full text-[1.4rem] px-[1rem] py-[.5rem] rounded-md transition-all"
              >
                {pv}
              </button>
            ))
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowPromptValues(false);
              }}
              className="text-text-dark hover:text-text-light hover:bg-primary focus-within:text-text-light focus-within:bg-primary text-start w-full text-[1.4rem] px-[1rem] py-[.5rem] rounded-md transition-all"
            >
              Такой команды или персонажа не существует
            </button>
          )}
        </AsideScrollable>
      </form>
      <PlotFieldBlankCreateCharacter
        setShowModal={setShowCreateCharacterModal}
        characterName={value}
        plotFieldCommandId={plotFieldCommandId}
        topologyBlockId={topologyBlockId}
        showModal={showCreateCharacterModal}
        commandIfId={commandIfId}
        isElse={isElse}
      />
    </div>
  );
}
