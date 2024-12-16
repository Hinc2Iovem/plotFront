import { DraggableProvided } from "@hello-pangea/dnd";
import CommandAchievementField from "./Achievement/CommandAchievementField";
import CommandAmbientField from "./Ambient/CommandAmbientField";
import CommandBackgroundField from "./Background/CommandBackgroundField";
import PlotfieldBlank from "./Blank/PlotfieldBlank";
import CommandCallField from "./Call/CommandCallField";
import CommandChoiceField from "./Choice/CommandChoiceField";
import CommandCommentField from "./Comment/CommandCommentField";
import CommandConditionField from "./Condition/CommandConditionField";
import CommandCutSceneField from "./CutScene/CommandCutSceneField";
import CommandEffectField from "./Effect/CommandEffectField";
import CommandGetItemField from "./GetItem/CommandGetItemField";
import CommandIfField from "./If/CommandIfField";
import CommandKeyField from "./Key/CommandKeyField";
import CommandMoveField from "./Move/CommandMoveField";
import CommandMusicField from "./Music/CommandMusicField";
import CommandNameField from "./Name/CommandNameField";
import CommandSayField from "./Say/CommandSayField";
import CommandSoundField from "./Sound/CommandSoundField";
import CommandSuitField from "./Suit/CommandSuitField";
import CommandWaitField from "./Wait/CommandWaitField";
import CommandWardrobeField from "./Wardrobe/CommandWardrobeField";
import { PlotfieldOptimisticCommandTypes } from "../../Context/PlotfieldCommandSlice";
import { useEffect } from "react";
import usePlotfieldCommands from "../../Context/PlotFieldContext";
import PlotfieldButton from "../../../../../ui/Buttons/PlotfieldButton";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({
  error,
  commandName,
  resetErrorBoundary,
}: {
  commandName: string;
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div>
      <h2 className="text-[1.5rem] text-red-400">
        Ошибка в комманде {commandName}: {error.message}
      </h2>
      <PlotfieldButton onClick={() => resetErrorBoundary()}>Обоновить</PlotfieldButton>
    </div>
  );
}

type PlotFieldItemTypes = {
  provided: DraggableProvided;
} & PlotfieldOptimisticCommandTypes;

export default function PlotfieldItem({
  _id,
  command,
  topologyBlockId,
  provided,
  characterId,
  characterName,
  sayType,
  characterImg,
  commandSide,
  emotionId,
  emotionImg,
  emotionName,
  commandOrder,
}: PlotFieldItemTypes) {
  const { getCommandOnlyByPlotfieldCommandId } = usePlotfieldCommands();

  useEffect(() => {
    const handleUpdatingChoiceSession = () => {
      const currentCommandChoice = sessionStorage.getItem("focusedCommandChoice")?.split("?").filter(Boolean);

      const deepLevelChoice = currentCommandChoice?.includes("none")
        ? null
        : (currentCommandChoice?.length || 0) > 0
        ? (currentCommandChoice?.length || 0) - 1
        : null;

      if (typeof deepLevelChoice !== "number") {
        console.error("Extremely wierd staff");
        return;
      }

      if (deepLevelChoice === 0) {
        console.log("Went only inside the first level");
        return;
      }

      const lastCommandChoice = (currentCommandChoice || [])[deepLevelChoice]?.split("-");
      const secondToLastCommandChoice = (currentCommandChoice || [])[deepLevelChoice - 1]?.split("-");

      const lastChoicePlotfieldId = lastCommandChoice[0];
      const secondToLastChoicePlotfieldId = secondToLastCommandChoice[0];

      const lastChoicePlotfieldCommand = getCommandOnlyByPlotfieldCommandId({
        plotfieldCommandId: lastChoicePlotfieldId,
      });
      const secondToLastChoicePlotfieldCommand = getCommandOnlyByPlotfieldCommandId({
        plotfieldCommandId: secondToLastChoicePlotfieldId,
      });

      if (lastChoicePlotfieldCommand?.topologyBlockId !== secondToLastChoicePlotfieldCommand?.topologyBlockId) {
        // basically if last command choice is not inside the secondToLast
      }
    };

    window.addEventListener("storage", handleUpdatingChoiceSession);
    return () => {
      window.removeEventListener("storage", handleUpdatingChoiceSession);
    };
  }, [getCommandOnlyByPlotfieldCommandId]);

  return (
    <li
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className={`w-full flex gap-[1rem] ${command?.trim().length ? "outline-gray-300" : `outline-gray-600`}`}
    >
      <ErrorBoundary FallbackComponent={(error) => <ErrorFallback commandName={command} {...error} />}>
        {!command ? (
          <PlotfieldBlank plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "say" ? (
          <CommandSayField
            topologyBlockId={topologyBlockId}
            plotFieldCommandId={_id}
            characterId={characterId}
            characterName={characterName}
            sayType={sayType}
            characterImg={characterImg}
            emotionId={emotionId}
            emotionImg={emotionImg}
            emotionName={emotionName}
            commandSide={commandSide}
          />
        ) : command === "achievement" ? (
          <CommandAchievementField topologyBlockId={topologyBlockId} command={command} plotFieldCommandId={_id} />
        ) : command === "ambient" ? (
          <CommandAmbientField command={command} plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "cutscene" ? (
          <CommandCutSceneField command={command} plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "effect" ? (
          <CommandEffectField command={command} plotFieldCommandId={_id} topologyBlockId={topologyBlockId} /> //here
        ) : command === "key" ? (
          <CommandKeyField command={command} plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "move" ? (
          <CommandMoveField command={command} plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "music" ? (
          <CommandMusicField command={command} plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "sound" ? (
          <CommandSoundField command={command} plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "suit" ? (
          <CommandSuitField command={command} plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "wait" ? (
          <CommandWaitField command={command} plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "name" ? (
          <CommandNameField command={command} plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "background" ? (
          <CommandBackgroundField command={command} plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "getitem" ? (
          <CommandGetItemField topologyBlockId={topologyBlockId} command={command} plotFieldCommandId={_id} />
        ) : command === "if" ? (
          <CommandIfField topologyBlockId={topologyBlockId} command={command} plotFieldCommandId={_id} />
        ) : command === "wardrobe" ? (
          <CommandWardrobeField topologyBlockId={topologyBlockId} command={command} plotFieldCommandId={_id} />
        ) : command === "choice" ? (
          <CommandChoiceField command={command} topologyBlockId={topologyBlockId} plotFieldCommandId={_id} />
        ) : command === "call" ? (
          <CommandCallField command={command} topologyBlockId={topologyBlockId} plotFieldCommandId={_id} />
        ) : command === "condition" ? (
          <CommandConditionField command={command} topologyBlockId={topologyBlockId} plotFieldCommandId={_id} />
        ) : command === "comment" ? (
          <CommandCommentField command={command} plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : null}
        <span className="w-[3rem] bg-red-500 text-center text-text-light rounded-md text-[1.5rem]">{commandOrder}</span>
      </ErrorBoundary>
    </li>
  );
}
