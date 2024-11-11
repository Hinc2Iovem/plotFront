import { DraggableProvided } from "@hello-pangea/dnd";
import { PlotfieldOptimisticCommandInsideIfTypes } from "../../Context/PlotfieldCommandIfSlice";
import CommandAchievementField from "./Achievement/CommandAchievementField";
import CommandAmbientField from "./Ambient/CommandAmbientField";
import CommandBackgroundField from "./Background/CommandBackgroundField";
import PlotfieldBlank from "./Blank/PlotfieldBlank";
import CommandCallField from "./Call/CommandCallField";
import CommandChoiceField from "./Choice/CommandChoiceField";
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
import CommandCommentField from "./Comment/CommandCommentField";

type PlotFieldItemTypes = {
  provided: DraggableProvided;
} & PlotfieldOptimisticCommandInsideIfTypes;

export default function PlotfieldItemInsideIf({
  _id,
  command,
  topologyBlockId,
  commandIfId,
  provided,
  isElse,
  characterId,
  characterName,
  sayType,
  commandSide,
  characterImg,
  emotionId,
  emotionImg,
  emotionName,
}: PlotFieldItemTypes) {
  return (
    <li
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      onDrag={(e) => {
        e.stopPropagation();
      }}
      className={`${commandIfId ? "px-[.5rem]" : ""} w-full flex gap-[1rem] `}
    >
      {!command ? (
        <PlotfieldBlank
          plotFieldCommandId={_id}
          commandIfId={commandIfId || ""}
          topologyBlockId={topologyBlockId}
          isElse={isElse}
        />
      ) : command === "say" ? (
        <CommandSayField
          topologyBlockId={topologyBlockId}
          plotFieldCommandId={_id}
          characterId={characterId}
          characterName={characterName}
          sayType={sayType}
          commandIfId={commandIfId}
          characterImg={characterImg}
          emotionId={emotionId}
          emotionImg={emotionImg}
          emotionName={emotionName}
          isElse={isElse}
          commandSide={commandSide}
        />
      ) : command === "achievement" ? (
        <CommandAchievementField topologyBlockId={topologyBlockId} command={command} plotFieldCommandId={_id} />
      ) : command === "ambient" ? (
        <CommandAmbientField command={command} plotFieldCommandId={_id} />
      ) : command === "cutscene" ? (
        <CommandCutSceneField command={command} plotFieldCommandId={_id} />
      ) : command === "effect" ? (
        <CommandEffectField command={command} plotFieldCommandId={_id} />
      ) : command === "key" ? (
        <CommandKeyField command={command} plotFieldCommandId={_id} />
      ) : command === "move" ? (
        <CommandMoveField command={command} plotFieldCommandId={_id} />
      ) : command === "music" ? (
        <CommandMusicField command={command} plotFieldCommandId={_id} />
      ) : command === "sound" ? (
        <CommandSoundField command={command} plotFieldCommandId={_id} />
      ) : command === "suit" ? (
        <CommandSuitField command={command} plotFieldCommandId={_id} />
      ) : command === "wait" ? (
        <CommandWaitField command={command} plotFieldCommandId={_id} />
      ) : command === "name" ? (
        <CommandNameField command={command} plotFieldCommandId={_id} />
      ) : command === "background" ? (
        <CommandBackgroundField command={command} plotFieldCommandId={_id} />
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
        <CommandCommentField command={command} plotFieldCommandId={_id} />
      ) : null}
      {/* <span className="w-[3rem] bg-green-400 text-center text-text-light rounded-md text-[1.5rem]">
        {commandOrder}
      </span> */}
    </li>
  );
}
