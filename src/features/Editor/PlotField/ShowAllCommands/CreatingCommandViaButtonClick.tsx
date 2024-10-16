import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AllPossiblePlotFieldCommands,
  AllPossibleSayPlotFieldCommandsBlank,
} from "../../../../const/PLOTFIELD_COMMANDS";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import usePlotfieldCommands from "../Context/PlotFieldContext";
import useCreateAchievement from "../PlotFieldMain/Commands/hooks/Achievement/useCreateAchievement";
import useCreateAmbient from "../PlotFieldMain/Commands/hooks/Ambient/useCreateAmbient";
import useCreateBackground from "../PlotFieldMain/Commands/hooks/Background/useCreateBackground";
import useCreateCall from "../PlotFieldMain/Commands/hooks/Call/useCreateCall";
import useCreateChoice from "../PlotFieldMain/Commands/hooks/Choice/useCreateChoice";
import useCreateComment from "../PlotFieldMain/Commands/hooks/Comment/useCommentWait";
import useCreateCondition from "../PlotFieldMain/Commands/hooks/Condition/useCreateCondition";
import useCreateCutScene from "../PlotFieldMain/Commands/hooks/CutScene/useCreateCutScene";
import useCreateEffect from "../PlotFieldMain/Commands/hooks/Effect/useCreateEffect";
import useCreateGetItem from "../PlotFieldMain/Commands/hooks/GetItem/useCreateGetItem";
import useCreateCommandIf from "../PlotFieldMain/Commands/hooks/If/useCreateCommandIf";
import useCreateKey from "../PlotFieldMain/Commands/hooks/Key/useCreateKey";
import useCreateMove from "../PlotFieldMain/Commands/hooks/Move/useCreateMove";
import useCreateMusic from "../PlotFieldMain/Commands/hooks/Music/useCreateMusic";
import useCreateName from "../PlotFieldMain/Commands/hooks/Name/useCreateName";
import useCreateSayCommandBlank from "../PlotFieldMain/Commands/hooks/Say/useCreateSayCommandBlank";
import useCreateSound from "../PlotFieldMain/Commands/hooks/Sound/useCreateSound";
import useCreateSuit from "../PlotFieldMain/Commands/hooks/Suit/useCreateSuit";
import useUpdateTopologyBlockAmountOfCommands from "../PlotFieldMain/Commands/hooks/TopologyBlock/useUpdateTopologyBlockAmountOfCommands";
import useCreateBlankCommand from "../PlotFieldMain/Commands/hooks/useCreateBlankCommand";
import useUpdateCommandName from "../PlotFieldMain/Commands/hooks/useUpdateCommandName";
import useCreateWait from "../PlotFieldMain/Commands/hooks/Wait/useCreateWait";
import useCreateWardrobe from "../PlotFieldMain/Commands/hooks/Wardrobe/useCreateWardrobe";
import useTopologyBlocks from "../../Flowchart/Context/TopologyBlockContext";
import { makeTopologyBlockName } from "../../Flowchart/utils/makeTopologyBlockName";
import useConditionBlocks from "../PlotFieldMain/Commands/Condition/Context/ConditionContext";

type CreatingCommandViaButtonClickTypes = {
  pc: string;
  topologyBlockId: string;
  setShowAllCommands: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreatingCommandViaButtonClick({
  pc,
  topologyBlockId,
  setShowAllCommands,
}: CreatingCommandViaButtonClickTypes) {
  const { storyId } = useParams();
  const { episodeId } = useParams();
  const { getCurrentAmountOfCommands, updateCommandInfo } =
    usePlotfieldCommands();
  const { addConditionBlock } = useConditionBlocks();
  const { getTopologyBlock } = useTopologyBlocks();
  // const { data: translatedCharacters } = useGetTranslationCharacters({
  //   language: "russian",
  //   storyId: storyId || "",
  // });

  const [value, setValue] = useState("");

  // const [showCreateCharacterModal, setShowCreateCharacterModal] =
  // useState(false);

  // const [characterName, setCharacterName] = useState("");

  // const allCharacterNames = useMemo(() => {
  //   const res: string[] = [];
  //   if (translatedCharacters) {
  //     translatedCharacters.map((tc) => {
  //       const characterName = tc.translations?.find(
  //         (t) => t.textFieldName === "characterName"
  //       )?.text;
  //       if (characterName) {
  //         res.push(characterName.toLowerCase());
  //       }
  //     });
  //   }
  //   return res;
  // }, [translatedCharacters]);

  // const filteredPromptValues = useMemo(() => {
  //   if (characterName?.trim().length) {
  //     return allCharacterNames.filter((pv) =>
  //       pv.toLowerCase().includes(characterName.toLowerCase())
  //     );
  //   } else {
  //     return allCharacterNames;
  //   }
  // }, [allCharacterNames, characterName]);

  const newPlotFieldCommand = useCreateBlankCommand({ topologyBlockId });

  const updateCommandName = useUpdateCommandName({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
    value,
  });

  const createSayCommand = useCreateSayCommandBlank({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
    topologyBlockId,
  });

  const createCommandAchievement = useCreateAchievement({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
    storyId: storyId ?? "",
    topologyBlockId,
  });

  const createCommandAmbient = useCreateAmbient({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createBackground = useCreateBackground({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createCall = useCreateCall({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createChoice = useCreateChoice({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
    topologyBlockId,
  });
  const createCommandIf = useCreateCommandIf({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createCondition = useCreateCondition({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
    episodeId: episodeId || "",
  });
  const createCutScene = useCreateCutScene({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createEffect = useCreateEffect({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createGetItem = useCreateGetItem({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
    topologyBlockId,
  });
  const createKey = useCreateKey({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
    storyId: storyId ?? "",
  });
  const createMove = useCreateMove({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createMusic = useCreateMusic({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createName = useCreateName({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createSound = useCreateSound({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createSuit = useCreateSuit({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createWait = useCreateWait({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createComment = useCreateComment({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createWardrobe = useCreateWardrobe({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
    topologyBlockId,
  });

  const updateTopologyBlockAmountOfCommands =
    useUpdateTopologyBlockAmountOfCommands({
      topologyBlockId,
      addOrMinusAmountOfCommand: "add",
    });

  const handleSubmit = ({
    submittedByCharacter,
    type,
    plotfieldCommandId,
  }: {
    submittedByCharacter: boolean;
    plotfieldCommandId: string;
    type?: CommandSayVariationTypes;
  }) => {
    if (submittedByCharacter && type) {
      createSayCommand.mutate({ type });
      updateCommandName.mutate({ valueForSay: true });
    } else if (!submittedByCharacter) {
      const allCommands: AllPossiblePlotFieldComamndsTypes =
        value.toLowerCase() as AllPossiblePlotFieldComamndsTypes;
      if (allCommands === "achievement") {
        createCommandAchievement.mutate();
      } else if (allCommands === "ambient") {
        createCommandAmbient.mutate();
      } else if (allCommands === "background") {
        createBackground.mutate();
      } else if (allCommands === "call") {
        createCall.mutate();
      } else if (allCommands === "choice") {
        createChoice.mutate();
      } else if (allCommands === "condition") {
        const conditionBlockId = generateMongoObjectId();
        const targetBlockId = generateMongoObjectId();

        addConditionBlock({
          plotfieldCommandId,
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
          conditionBlockId,
          coordinatesX: getTopologyBlock()?.coordinatesX || 0,
          coordinatesY: (getTopologyBlock()?.coordinatesY || 0) + 50,
          sourceBlockName: makeTopologyBlockName({
            name: getTopologyBlock()?.name || "",
            amountOfOptions:
              getTopologyBlock()?.topologyBlockInfo?.amountOfChildBlocks,
          }),
          targetBlockId,
          topologyBlockId,
        });
      } else if (allCommands === "cutscene") {
        createCutScene.mutate();
      } else if (allCommands === "effect") {
        createEffect.mutate();
      } else if (allCommands === "getitem") {
        createGetItem.mutate();
      } else if (allCommands === "if") {
        createCommandIf.mutate();
      } else if (allCommands === "key") {
        createKey.mutate();
      } else if (allCommands === "move") {
        createMove.mutate();
      } else if (allCommands === "music") {
        createMusic.mutate();
      } else if (allCommands === "name") {
        createName.mutate();
      } else if (allCommands === "sound") {
        createSound.mutate();
      } else if (allCommands === "suit") {
        createSuit.mutate();
      } else if (allCommands === "wait") {
        createWait.mutate();
      } else if (allCommands === "wardrobe") {
        createWardrobe.mutate();
      } else if (allCommands === "comment") {
        createComment.mutate();
      }
      updateCommandName.mutate({ valueForSay: false });
    }
    updateTopologyBlockAmountOfCommands.mutate();
    setShowAllCommands(false);
  };

  const handleFormSubmit = ({
    pc,
    plotfieldCommandId,
  }: {
    pc: string;
    plotfieldCommandId: string;
  }) => {
    if (!pc.trim().length) {
      console.log("Заполните поле");
      return;
    }

    console.log("plotfieldCommandId: working? ", plotfieldCommandId);

    let submittedByCharacter = false;
    // if it's say command whether it's hint, author, notify or some character name which already exists
    if (AllPossibleSayPlotFieldCommandsBlank.includes(pc.toLowerCase())) {
      handleSubmit({
        submittedByCharacter: true,
        type: pc as CommandSayVariationTypes,
        plotfieldCommandId,
      });
    } else if (AllPossiblePlotFieldCommands.includes(pc.toLowerCase())) {
      // if it's any another existing command beside say and it's variations
      submittedByCharacter = false;
      handleSubmit({ submittedByCharacter, plotfieldCommandId });
    } else {
      // if it's not any command and if there's no such character, it suggests to create a new one
      // setShowCreateCharacterModal(true);
      return;
    }
  };

  useEffect(() => {
    if (newPlotFieldCommand.isSuccess) {
      handleFormSubmit({
        pc,
        plotfieldCommandId: newPlotFieldCommand.data._id,
      });
    }
  }, [pc, newPlotFieldCommand.isSuccess]);

  return (
    <button
      onClick={() => {
        setValue(pc);
        const _id = generateMongoObjectId();
        newPlotFieldCommand.mutate({
          _id,
          commandOrder: getCurrentAmountOfCommands({ topologyBlockId }),
          topologyBlockId,
        });
        updateCommandInfo({ topologyBlockId, addOrMinus: "add" });
      }}
      className="text-[1.6rem] outline-black pr-[1rem] focus-within:px-[1rem] capitalize text-text-light hover:text-black transition-all border-b-[.1rem] border-gray-700 hover:border-black"
    >
      {pc}
    </button>
  );
}
