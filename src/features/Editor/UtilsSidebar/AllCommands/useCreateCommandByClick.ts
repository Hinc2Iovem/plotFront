import { AllPossiblePlotFieldCommands, AllPossibleSayPlotFieldCommandsBlank } from "@/const/PLOTFIELD_COMMANDS";
import { AllPossiblePlotFieldComamndsSaySubVariationsTypes } from "@/types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "@/types/StoryEditor/PlotField/Say/SayTypes";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useNavigation from "../../Context/Navigation/NavigationContext";
import { makeTopologyBlockName } from "../../Flowchart/utils/makeTopologyBlockName";
import useCreateCommandAchievement from "../../PlotField/hooks/Achievement/CommandAchievement/useCreateCommandAchievement";
import useCreateAmbient from "../../PlotField/hooks/Ambient/useCreateAmbient";
import useCreateBackground from "../../PlotField/hooks/Background/useCreateBackground";
import useCreateCall from "../../PlotField/hooks/Call/useCreateCall";
import useCreateChoice from "../../PlotField/hooks/Choice/useCreateChoice";
import useCreateComment from "../../PlotField/hooks/Comment/useCreateComment";
import useCreateCondition from "../../PlotField/hooks/Condition/useCreateCondition";
import useCreateCutScene from "../../PlotField/hooks/CutScene/useCreateCutScene";
import useCreateEffect from "../../PlotField/hooks/Effect/useCreateEffect";
import useCreateGetItem from "../../PlotField/hooks/GetItem/useCreateGetItem";
import useCreateCommandIf from "../../PlotField/hooks/If/useCreateCommandIf";
import useCreateCommandKey from "../../PlotField/hooks/Key/useCreateCommandKey";
import useCreateMove from "../../PlotField/hooks/Move/useCreateMove";
import useCreateCommandMusic from "../../PlotField/hooks/Music/Command/useCreateCommandMusic";
import useCreateName from "../../PlotField/hooks/Name/useCreateName";
import useCreateSayCommandBlank from "../../PlotField/hooks/Say/useCreateSayCommandBlank";
import useCreateCommandSound from "../../PlotField/hooks/Sound/Command/useCreateCommandSound";
import useCreateSuit from "../../PlotField/hooks/Suit/useCreateSuit";
import useUpdateTopologyBlockAmountOfCommands from "../../PlotField/hooks/TopologyBlock/useUpdateTopologyBlockAmountOfCommands";
import useUpdateCommandName from "../../PlotField/hooks/useUpdateCommandName";
import useCreateWait from "../../PlotField/hooks/Wait/useCreateWait";
import useCreateWardrobe from "../../PlotField/hooks/Wardrobe/useCreateWardrobe";
import usePlotfieldCommands from "../../PlotField/Context/PlotFieldContext";
import useConditionBlocks from "../../PlotField/PlotFieldMain/Commands/Condition/Context/ConditionContext";

type CreateCommandByClickTypes = {
  topologyBlockId: string;
  create: boolean;
  plotfieldCommandId: string;
  setCreate: React.Dispatch<React.SetStateAction<boolean>>;
  commandName: AllPossiblePlotFieldComamndsSaySubVariationsTypes;
};

export default function useCreateCommandByClick({
  commandName,
  plotfieldCommandId,
  create,
  setCreate,
  topologyBlockId,
}: CreateCommandByClickTypes) {
  const { storyId, episodeId } = useParams();
  const addConditionBlock = useConditionBlocks((state) => state.addConditionBlock);
  const getCurrentAmountOfCommands = usePlotfieldCommands((state) => state.getCurrentAmountOfCommands);
  const currentTopologyBlock = useNavigation((state) => state.currentTopologyBlock);
  const currentlyFocusedCommandId = useNavigation((state) => state.currentlyFocusedCommandId);

  const updateCommandName = useUpdateCommandName({
    plotFieldCommandId: plotfieldCommandId || "",
    topologyBlockId: topologyBlockId || "",
  });

  const createSayCommand = useCreateSayCommandBlank({
    plotFieldCommandId: plotfieldCommandId || "",
    topologyBlockId,
  });

  const createCommandAchievement = useCreateCommandAchievement({
    language: "russian",
    storyId: storyId || "",
  });

  const createCommandAmbient = useCreateAmbient({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createBackground = useCreateBackground({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createCall = useCreateCall({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createChoice = useCreateChoice({
    plotFieldCommandId: plotfieldCommandId || "",
    topologyBlockId,
  });
  const createCommandIf = useCreateCommandIf({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createCondition = useCreateCondition({
    plotFieldCommandId: plotfieldCommandId || "",
    episodeId: episodeId || "",
  });
  const createCutScene = useCreateCutScene({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createEffect = useCreateEffect({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createGetItem = useCreateGetItem({
    plotFieldCommandId: plotfieldCommandId || "",
    topologyBlockId,
  });
  const createKey = useCreateCommandKey({
    plotFieldCommandId: plotfieldCommandId || "",
    storyId: storyId ?? "",
  });
  const createMove = useCreateMove({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createMusic = useCreateCommandMusic({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createName = useCreateName({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createSound = useCreateCommandSound({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createSuit = useCreateSuit({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createWait = useCreateWait({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createComment = useCreateComment({
    plotFieldCommandId: plotfieldCommandId || "",
  });
  const createWardrobe = useCreateWardrobe({
    plotFieldCommandId: plotfieldCommandId || "",
    topologyBlockId,
  });

  const updateTopologyBlockAmountOfCommands = useUpdateTopologyBlockAmountOfCommands({
    topologyBlockId,
    addOrMinusAmountOfCommand: "add",
  });

  const handleSubmit = ({
    submittedByCharacter,
    type,
  }: {
    submittedByCharacter: boolean;
    type?: CommandSayVariationTypes;
  }) => {
    if (submittedByCharacter && type) {
      createSayCommand.mutate({ type });
      updateCommandName.mutate({ valueForSay: true, value: "say" });
    } else if (!submittedByCharacter) {
      if (commandName === "achievement") {
        createCommandAchievement.mutate({
          plotfieldCommandId: plotfieldCommandId || "",
        });
      } else if (commandName === "ambient") {
        createCommandAmbient.mutate({});
      } else if (commandName === "background") {
        createBackground.mutate({});
      } else if (commandName === "call") {
        createCall.mutate({});
      } else if (commandName === "choice") {
        createChoice.mutate({});
      } else if (commandName === "condition") {
        const conditionBlockId = generateMongoObjectId();
        const targetBlockId = generateMongoObjectId();

        addConditionBlock({
          plotfieldCommandId,
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
          conditionBlockId,
          coordinatesX: currentTopologyBlock?.coordinatesX || 0,
          coordinatesY: (currentTopologyBlock?.coordinatesY || 0) + 50,
          sourceBlockName: makeTopologyBlockName({
            name: currentTopologyBlock?.name || "",
            amountOfOptions: currentTopologyBlock?.topologyBlockInfo?.amountOfChildBlocks,
          }),
          targetBlockId,
          topologyBlockId,
        });
      } else if (commandName === "cutscene") {
        createCutScene.mutate({});
      } else if (commandName === "effect") {
        createEffect.mutate({});
      } else if (commandName === "getitem") {
        createGetItem.mutate({});
      } else if (commandName === "if") {
        const plotFieldCommandIfElseEndId = generateMongoObjectId();
        const plotFieldCommandElseId = generateMongoObjectId();

        const commandOrder =
          typeof currentlyFocusedCommandId.commandOrder === "number"
            ? currentlyFocusedCommandId?.commandOrder + 1
            : getCurrentAmountOfCommands({ topologyBlockId });

        createCommandIf.mutate({
          plotFieldCommandElseId,
          plotFieldCommandIfElseEndId,
          plotfieldCommandId,
          commandOrder,
          topologyBlockId,
        });
      } else if (commandName === "key") {
        createKey.mutate({});
      } else if (commandName === "move") {
        createMove.mutate({});
      } else if (commandName === "music") {
        createMusic.mutate({});
      } else if (commandName === "name") {
        createName.mutate({});
      } else if (commandName === "sound") {
        createSound.mutate({});
      } else if (commandName === "suit") {
        createSuit.mutate({});
      } else if (commandName === "wait") {
        createWait.mutate({});
      } else if (commandName === "wardrobe") {
        createWardrobe.mutate({});
      } else if (commandName === "comment") {
        createComment.mutate({});
      }
      updateCommandName.mutate({ valueForSay: false, value: commandName });
    }
    updateTopologyBlockAmountOfCommands.mutate();
    setCreate(false);
  };

  const handleFormSubmit = () => {
    let submittedByCharacter = false;
    // if it's say command whether it's hint, author, notify or some character name which already exists
    if (AllPossibleSayPlotFieldCommandsBlank.includes(commandName)) {
      handleSubmit({
        submittedByCharacter: true,
        type: commandName as CommandSayVariationTypes,
      });
    } else if (AllPossiblePlotFieldCommands.includes(commandName.toLowerCase())) {
      // if it's any another existing command beside say and it's variations
      submittedByCharacter = false;
      handleSubmit({ submittedByCharacter });
    } else {
      // create blank command
      setCreate(false);
      return;
    }
  };

  useEffect(() => {
    if (create) {
      handleFormSubmit();
    }
  }, [create]);
}
