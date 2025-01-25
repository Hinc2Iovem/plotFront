import { Button } from "@/components/ui/button";
import { DraggableProvided } from "@hello-pangea/dnd";
import { ErrorBoundary } from "react-error-boundary";
import { PlotfieldOptimisticCommandTypes } from "../../Context/PlotfieldCommandSlice";
import CommandAchievementField from "./Achievement/CommandAchievementField";
import CommandAmbientField from "./Ambient/CommandAmbientField";
import CommandBackgroundField from "./Background/CommandBackgroundField";
import PlotfieldBlank from "./Blank/PlotfieldBlank";
import CommandCallField from "./Call/CommandCallField";
import CommandCommentField from "./Comment/CommandCommentField";
import CommandConditionField from "./Condition/CommandConditionField";
import CommandCutSceneField from "./CutScene/CommandCutSceneField";
import CommandEffectField from "./Effect/CommandEffectField";
import CommandElseField from "./Else/CommandElseField";
import CommandEndField from "./End/CommandEndField";
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
import CommandChoiceField from "./Choice/CommandChoiceField";

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
    <div className="bg-background border-border border-[1px] rounded-md p-[5px] w-full">
      <h2 className="text-[15px] text-red">
        Ошибка в комманде {commandName}: {error.message}
      </h2>
      <Button variant={"ghost"} className="text-text" onClick={() => resetErrorBoundary()}>
        Обоновить
      </Button>
    </div>
  );
}

type PlotFieldItemTypes = {
  provided: DraggableProvided;
  currentTopologyBlockId: string;
} & PlotfieldOptimisticCommandTypes;

export default function PlotfieldItem({
  _id,
  command,
  provided,
  characterId,
  characterName,
  sayType,
  characterImg,
  commandSide,
  emotionId,
  emotionImg,
  emotionName,
  plotfieldCommandIfId,
  currentTopologyBlockId,
}: PlotFieldItemTypes) {
  const topologyBlockId = currentTopologyBlockId;

  return (
    <li
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className={`w-full flex gap-[10px] ${
        plotfieldCommandIfId?.trim().length && command !== "else" && command !== "end" ? "pl-[10px]" : ""
      }`}
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
          <CommandAchievementField topologyBlockId={topologyBlockId} plotFieldCommandId={_id} />
        ) : command === "ambient" ? (
          <CommandAmbientField plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "cutscene" ? (
          <CommandCutSceneField plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "effect" ? (
          <CommandEffectField plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "key" ? (
          <CommandKeyField plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "move" ? (
          <CommandMoveField plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "music" ? (
          <CommandMusicField plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "sound" ? (
          <CommandSoundField plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "suit" ? (
          <CommandSuitField plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "wait" ? (
          <CommandWaitField plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "name" ? (
          <CommandNameField plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "background" ? (
          <CommandBackgroundField plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : command === "getitem" ? (
          <CommandGetItemField topologyBlockId={topologyBlockId} plotFieldCommandId={_id} />
        ) : command === "if" ? (
          <CommandIfField topologyBlockId={topologyBlockId} plotFieldCommandId={_id} />
        ) : command === "else" ? (
          <CommandElseField
            topologyBlockId={topologyBlockId}
            plotfieldCommandIfId={plotfieldCommandIfId || ""}
            plotFieldCommandId={_id}
          />
        ) : command === "end" ? (
          <CommandEndField plotFieldCommandId={_id} />
        ) : command === "wardrobe" ? (
          <CommandWardrobeField topologyBlockId={topologyBlockId} plotFieldCommandId={_id} />
        ) : command === "choice" ? (
          <CommandChoiceField topologyBlockId={topologyBlockId} plotFieldCommandId={_id} />
        ) : command === "call" ? (
          <CommandCallField topologyBlockId={topologyBlockId} plotFieldCommandId={_id} />
        ) : command === "condition" ? (
          <CommandConditionField topologyBlockId={topologyBlockId} plotFieldCommandId={_id} />
        ) : command === "comment" ? (
          <CommandCommentField plotFieldCommandId={_id} topologyBlockId={topologyBlockId} />
        ) : null}
      </ErrorBoundary>
    </li>
  );
}
