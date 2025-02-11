import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AllPossiblePlotFieldCommands,
  AllPossibleSayPlotFieldCommands,
} from "../../../../../../const/PLOTFIELD_COMMANDS";
import useGetTranslationCharacters from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import useNavigation from "../../../../Context/Navigation/NavigationContext";
import useSearch from "../../../../Context/Search/SearchContext";
import { makeTopologyBlockName } from "../../../../Flowchart/utils/makeTopologyBlockName";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";
import useCreateCommandAchievement from "../../../hooks/Achievement/CommandAchievement/useCreateCommandAchievement";
import useCreateAmbient from "../../../hooks/Ambient/useCreateAmbient";
import useCreateBackground from "../../../hooks/Background/useCreateBackground";
import useCreateCall from "../../../hooks/Call/useCreateCall";
import useCreateChoice from "../../../hooks/Choice/useCreateChoice";
import useCreateComment from "../../../hooks/Comment/useCreateComment";
import useCreateCondition from "../../../hooks/Condition/useCreateCondition";
import useCreateCutScene from "../../../hooks/CutScene/useCreateCutScene";
import useCreateEffect from "../../../hooks/Effect/useCreateEffect";
import useCreateGetItem from "../../../hooks/GetItem/useCreateGetItem";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useCreateCommandIf from "../../../hooks/If/useCreateCommandIf";
import useCreateCommandKey from "../../../hooks/Key/useCreateCommandKey";
import useCreateMove from "../../../hooks/Move/useCreateMove";
import useCreateCommandMusic from "../../../hooks/Music/Command/useCreateCommandMusic";
import useCreateName from "../../../hooks/Name/useCreateName";
import useCreateSayCommand from "../../../hooks/Say/post/useCreateSayCommand";
import useCreateCommandSound from "../../../hooks/Sound/Command/useCreateCommandSound";
import useCreateSuit from "../../../hooks/Suit/useCreateSuit";
import useUpdateCommandName from "../../../hooks/useUpdateCommandName";
import useCreateWait from "../../../hooks/Wait/useCreateWait";
import useCreateWardrobe from "../../../hooks/Wardrobe/useCreateWardrobe";
import useConditionBlocks from "../Condition/Context/ConditionContext";
import PlotFieldBlankCreateCharacter from "./PlotFieldBlankCreateCharacter";
import DeleteCommandContextMenuWrapper from "../../components/DeleteCommandContextMenuWrapper";

type PlotFieldBlankTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
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

export default function PlotfieldBlank({ plotFieldCommandId, topologyBlockId }: PlotFieldBlankTypes) {
  const { storyId, episodeId } = useParams();
  const addItem = useSearch((state) => state.addItem);

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const currentInput = useRef<HTMLInputElement | null>(null);

  const currentTopologyBlock = useNavigation((state) => state.currentTopologyBlock);
  const addConditionBlock = useConditionBlocks((state) => state.addConditionBlock);

  const [showCreateCharacterModal, setShowCreateCharacterModal] = useState(false);

  const { data: translatedCharacters } = useGetTranslationCharacters({
    storyId: storyId || "",
    language: "russian",
  });

  const getCommandOnlyByPlotfieldCommandId = usePlotfieldCommands((state) => state.getCommandOnlyByPlotfieldCommandId);
  const currentCommand = getCommandOnlyByPlotfieldCommandId({ plotfieldCommandId: plotFieldCommandId });
  const promptRef = useRef<HTMLDivElement>(null);
  const [showPromptValues, setShowPromptValues] = useState(false);
  const [value, setValue] = useState("");

  const allPromptValues = useMemo(() => {
    const res = [...AllCommands];
    if (translatedCharacters) {
      translatedCharacters.map((tc) => {
        const characterName = tc.translations?.find((t) => t.textFieldName === "characterName")?.text;
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
        const characterName = tc.translations?.find((t) => t.textFieldName === "characterName")?.text;
        if (characterName) {
          res.push(characterName.toLowerCase());
        }
      });
    }
    return res;
  }, [translatedCharacters]);

  const filteredPromptValues = useMemo(() => {
    if (value?.trim().length) {
      return allPromptValues.filter((pv) => pv.toLowerCase().includes(value.toLowerCase()));
    } else {
      return allPromptValues;
    }
  }, [allPromptValues, value]);

  const updateCommandName = useUpdateCommandName({
    plotFieldCommandId,
    topologyBlockId: topologyBlockId || currentTopologyBlock._id,
  });

  const createSayCommand = useCreateSayCommand({
    plotFieldCommandId,
    topologyBlockId,
  });

  const createCommandAchievement = useCreateCommandAchievement({
    storyId: storyId ?? "",
    language: "russian",
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
  const createKey = useCreateCommandKey({
    plotFieldCommandId,
    storyId: storyId ?? "",
  });
  const createMove = useCreateMove({ plotFieldCommandId });
  const createMusic = useCreateCommandMusic({ plotFieldCommandId });
  const createName = useCreateName({ plotFieldCommandId });
  const createSound = useCreateCommandSound({ plotFieldCommandId });
  const createSuit = useCreateSuit({ plotFieldCommandId });
  const createWait = useCreateWait({ plotFieldCommandId });
  const createComment = useCreateComment({ plotFieldCommandId });
  const createWardrobe = useCreateWardrobe({
    plotFieldCommandId,
    topologyBlockId,
  });

  const updateCommandNameOptimistic = usePlotfieldCommands((state) => state.updateCommandName);

  const handleCreatingOptimisticCommand = ({
    commandName,
    valueForSay,
    characterId,
    sayType,
    characterName,

    plotfieldCommandIfId,
    plotfieldCommandElseId,
    plotfieldCommandIfElseEndId,
  }: {
    valueForSay: boolean;
    commandName: AllPossiblePlotFieldComamndsTypes;
    sayType?: CommandSayVariationTypes;
    characterId?: string;
    characterName?: string;

    plotfieldCommandIfId?: string;
    plotfieldCommandElseId?: string;
    plotfieldCommandIfElseEndId?: string;
  }) => {
    if (valueForSay) {
      if (characterId?.trim().length) {
        updateCommandNameOptimistic({
          id: plotFieldCommandId,
          newCommand: "say",
          characterId,
          characterName,
          sayType: "character",
          topologyBlockId,
          plotfieldCommandElseId,
          plotfieldCommandIfElseEndId,
          plotfieldCommandIfId,
        });
        if (episodeId) {
          addItem({
            episodeId,
            item: {
              commandName: "character",
              type: "command",
              id: plotFieldCommandId,
              text: "",
              topologyBlockId,
            },
          });
        }
      } else {
        updateCommandNameOptimistic({
          id: plotFieldCommandId,
          newCommand: "say",
          sayType,
          topologyBlockId,
          plotfieldCommandElseId,
          plotfieldCommandIfElseEndId,
          plotfieldCommandIfId,
        });
        if (episodeId) {
          addItem({
            episodeId,
            item: {
              commandName: sayType || "say",
              type: "command",
              id: plotFieldCommandId,
              text: `${sayType || "author"}`,
              topologyBlockId,
            },
          });
        }
      }
    } else {
      updateCommandNameOptimistic({
        id: plotFieldCommandId,
        newCommand: commandName,
        topologyBlockId,
        plotfieldCommandElseId,
        plotfieldCommandIfElseEndId,
        plotfieldCommandIfId,
      });
      if (episodeId) {
        addItem({
          episodeId,
          item: {
            commandName: commandName,
            type: "command",
            id: plotFieldCommandId,
            text: "",
            topologyBlockId,
          },
        });
      }
    }
  };

  const handleSubmit = ({
    submittedByCharacter,
    type,
    value,
  }: {
    submittedByCharacter: boolean;
    type?: CommandSayVariationTypes;
    value: string;
  }) => {
    if (submittedByCharacter && type) {
      if (type === "character") {
        translatedCharacters?.map((tc) => {
          tc.translations?.map((tct) => {
            if (tct.textFieldName === "characterName" && tct.text.toLowerCase() === value.toLowerCase()) {
              handleCreatingOptimisticCommand({
                valueForSay: true,
                commandName: "say",
                characterId: tc.characterId,
                characterName: value,
                sayType: "character",
              });

              createSayCommand.mutate({ type, characterId: tc.characterId });
            }
          });
        });
      } else {
        handleCreatingOptimisticCommand({
          valueForSay: true,
          commandName: "say",
          sayType: type,
        });
        createSayCommand.mutate({ type });
      }
      updateCommandName.mutate({ valueForSay: true, value });
    } else if (!submittedByCharacter) {
      const plotFieldCommandElseId = generateMongoObjectId();
      const plotFieldCommandIfElseEndId = generateMongoObjectId();

      const allCommands: AllPossiblePlotFieldComamndsTypes = value.toLowerCase() as AllPossiblePlotFieldComamndsTypes;
      if (allCommands === "achievement") {
        createCommandAchievement.mutate({
          plotfieldCommandId: plotFieldCommandId,
        });
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
            isElse: true,
            orderOfExecution: null,
            conditionBlockVariations: [],
            logicalOperators: "",
            targetBlockId,
            topologyBlockName: makeTopologyBlockName({
              name: currentTopologyBlock?.name || "",
              amountOfOptions: currentTopologyBlock?.topologyBlockInfo?.amountOfChildBlocks || 1,
            }),
          },
        });

        createCondition.mutate({
          coordinatesX: currentTopologyBlock?.coordinatesX,
          coordinatesY: currentTopologyBlock?.coordinatesY,
          sourceBlockName: makeTopologyBlockName({
            name: currentTopologyBlock?.name || "",
            amountOfOptions: currentTopologyBlock?.topologyBlockInfo?.amountOfChildBlocks || 1,
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
        createCommandIf.mutate({
          plotFieldCommandElseId,
          plotFieldCommandIfElseEndId,
          topologyBlockId,
          commandOrder: currentCommand?.commandOrder || 0,
          plotfieldCommandId: plotFieldCommandId,
        });
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

      handleCreatingOptimisticCommand({
        valueForSay: false,
        commandName: allCommands,
        plotfieldCommandIfId: plotFieldCommandId,
        plotfieldCommandElseId: plotFieldCommandElseId,
        plotfieldCommandIfElseEndId: plotFieldCommandIfElseEndId,
      });

      updateCommandName.mutate({ valueForSay: false, value: allCommands });
    }
  };

  const handleFormSubmit = (pv: string) => {
    if (!pv.trim().length) {
      console.log("Заполните поле");
      return;
    }
    let submittedByCharacter = false;
    // if it's say command whether it's hint, author, notify or some character name which already exists
    const refinedValue = pv.trim()?.toLowerCase();

    if (
      allCharacterNames.includes(pv.trim().toLowerCase()) ||
      AllPossibleSayPlotFieldCommands.includes(pv.trim().toLowerCase())
    ) {
      let type: CommandSayVariationTypes = "" as CommandSayVariationTypes;
      if (refinedValue !== "hint" && refinedValue !== "author" && refinedValue !== "notify") {
        type = "character";
      } else {
        type = refinedValue as CommandSayVariationTypes;
      }

      submittedByCharacter = true;
      handleSubmit({ submittedByCharacter, type, value: refinedValue });
    } else if (AllPossiblePlotFieldCommands.includes(refinedValue)) {
      // if it's any another existing command beside say and it's variations

      submittedByCharacter = false;
      handleSubmit({ submittedByCharacter, value: refinedValue });
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
    <DeleteCommandContextMenuWrapper
      className="w-full"
      plotfieldCommandId={plotFieldCommandId}
      topologyBlockId={topologyBlockId}
    >
      <Command
        className={`${
          isCommandFocused ? "bg-brand-gradient" : "border-border border-[1px]"
        } rounded-md relative w-full`}
      >
        <CommandInput
          ref={currentInput}
          value={value}
          onClick={(e) => {
            e.stopPropagation();
            setShowPromptValues((prev) => !prev);
            setShowCreateCharacterModal(false);
          }}
          placeholder="ПУСТОТА"
          onValueChange={(value) => {
            setValue(value);
            if (!showPromptValues) {
              setShowPromptValues(true);
            }
          }}
          className={`${isCommandFocused ? "border-0 shadow-none" : ""} md:text-[17px] text-text w-full`}
        />
        <CommandList
          ref={promptRef}
          className={`${
            showPromptValues && !showCreateCharacterModal ? "" : "hidden"
          }  w-full absolute z-[10] translate-y-[40px] bg-secondary left-0 | containerScroll`}
        >
          <CommandEmpty>Пусто</CommandEmpty>
          <CommandGroup>
            {filteredPromptValues.length > 0 ? (
              filteredPromptValues.map((pv) => (
                <CommandItem
                  key={pv}
                  onSelect={() => {
                    setValue(pv);
                    setShowPromptValues(false);
                    handleFormSubmit(pv);
                  }}
                  className="text-text opacity-80 hover:opacity-100 focus-within:opacity-100 w-full text-[14px] px-[10px] py-[5px] transition-all"
                >
                  {pv}
                </CommandItem>
              ))
            ) : (
              <CommandItem
                onSelect={() => {
                  setShowPromptValues(false);
                }}
                className="text-text opacity-80 hover:opacity-100 focus-within:opacity-100 w-full text-[14px] px-[10px] py-[5px] transition-all"
              >
                Такой команды или персонажа не существует
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
        <PlotFieldBlankCreateCharacter
          setShowModal={setShowCreateCharacterModal}
          characterName={value}
          plotFieldCommandId={plotFieldCommandId}
          topologyBlockId={topologyBlockId}
          showModal={showCreateCharacterModal}
        />
      </Command>
    </DeleteCommandContextMenuWrapper>
  );
}
