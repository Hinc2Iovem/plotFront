import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AllPossiblePlotFieldCommands,
  AllPossibleSayPlotFieldCommandsBlank,
} from "../../../../const/PLOTFIELD_COMMANDS";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "../../../../hooks/helpers/shared/SessionStorage/useTypedSessionStorage";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import useNavigation from "../../Context/Navigation/NavigationContext";
import { makeTopologyBlockName } from "../../Flowchart/utils/makeTopologyBlockName";
import usePlotfieldCommands from "../Context/PlotFieldContext";
import useCreateCommandAchievement from "../hooks/Achievement/CommandAchievement/useCreateCommandAchievement";
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
import useCreateCommandKey from "../hooks/Key/useCreateCommandKey";
import useCreateMove from "../hooks/Move/useCreateMove";
import useCreateCommandMusic from "../hooks/Music/Command/useCreateCommandMusic";
import useCreateName from "../hooks/Name/useCreateName";
import useCreateSayCommandBlank from "../hooks/Say/useCreateSayCommandBlank";
import useCreateCommandSound from "../hooks/Sound/Command/useCreateCommandSound";
import useCreateSuit from "../hooks/Suit/useCreateSuit";
import useUpdateTopologyBlockAmountOfCommands from "../hooks/TopologyBlock/useUpdateTopologyBlockAmountOfCommands";
import useCreateBlankCommand from "../hooks/useCreateBlankCommand";
import useUpdateCommandName from "../hooks/useUpdateCommandName";
import useCreateWait from "../hooks/Wait/useCreateWait";
import useCreateWardrobe from "../hooks/Wardrobe/useCreateWardrobe";
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
  const { storyId, episodeId } = useParams();
  const { getItem } = useTypedSessionStorage<SessionStorageKeys>();
  const currentlyFocusedTopologyBlock = getItem("focusedTopologyBlock");
  const { updateCommandInfo } = usePlotfieldCommands();
  const { addConditionBlock } = useConditionBlocks();
  const { currentTopologyBlock } = useNavigation();
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

  const newPlotFieldCommand = useCreateBlankCommand({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  const updateCommandName = useUpdateCommandName({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
    topologyBlockId: currentlyFocusedTopologyBlock || "",
  });

  const createSayCommand = useCreateSayCommandBlank({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
    topologyBlockId,
  });

  const createCommandAchievement = useCreateCommandAchievement({
    language: "russian",
    storyId: storyId ?? "",
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
  const createKey = useCreateCommandKey({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
    storyId: storyId ?? "",
  });
  const createMove = useCreateMove({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createMusic = useCreateCommandMusic({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createName = useCreateName({
    plotFieldCommandId: newPlotFieldCommand.data?._id || "",
  });
  const createSound = useCreateCommandSound({
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

  const updateTopologyBlockAmountOfCommands = useUpdateTopologyBlockAmountOfCommands({
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
      updateCommandName.mutate({ valueForSay: true, value: "say" });
    } else if (!submittedByCharacter) {
      const allCommands: AllPossiblePlotFieldComamndsTypes = value.toLowerCase() as AllPossiblePlotFieldComamndsTypes;
      if (allCommands === "achievement") {
        createCommandAchievement.mutate({
          plotfieldCommandId: newPlotFieldCommand.data?._id || "",
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
      } else if (allCommands === "cutscene") {
        createCutScene.mutate({});
      } else if (allCommands === "effect") {
        createEffect.mutate({});
      } else if (allCommands === "getitem") {
        createGetItem.mutate({});
      } else if (allCommands === "if") {
        // TODO this shit will cause problems, but because I hid this feature completely from the site I can do it this way(for a better time)
        createCommandIf.mutate({
          plotFieldCommandElseId: "",
          plotFieldCommandIfElseEndId: "",
          plotfieldCommandId: "",
          commandOrder: 0,
          topologyBlockId: "",
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
      updateCommandName.mutate({ valueForSay: false, value: allCommands });
    }
    updateTopologyBlockAmountOfCommands.mutate();
    setShowAllCommands(false);
  };

  const handleFormSubmit = ({ pc, plotfieldCommandId }: { pc: string; plotfieldCommandId: string }) => {
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
