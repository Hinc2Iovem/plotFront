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

type PlotFieldItemTypes = {
  provided: DraggableProvided;
} & PlotfieldOptimisticCommandTypes;

export default function PlotfieldItem({
  _id,
  command,
  topologyBlockId,
  commandIfId,
  provided,
  characterId,
  characterName,
  sayType,
  isElse,
}: PlotFieldItemTypes) {
  return (
    <li
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className={`${
        commandIfId ? "" : ""
      } w-full flex gap-[1rem] outline-gray-300`}
    >
      {!command ? (
        <PlotfieldBlank
          plotFieldCommandId={_id}
          commandIfId={commandIfId ?? ""}
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
        />
      ) : command === "achievement" ? (
        <CommandAchievementField
          topologyBlockId={topologyBlockId}
          command={command}
          plotFieldCommandId={_id}
        />
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
        <CommandGetItemField
          topologyBlockId={topologyBlockId}
          command={command}
          plotFieldCommandId={_id}
        />
      ) : command === "if" ? (
        <CommandIfField
          topologyBlockId={topologyBlockId}
          command={command}
          plotFieldCommandId={_id}
        />
      ) : command === "wardrobe" ? (
        <CommandWardrobeField
          topologyBlockId={topologyBlockId}
          command={command}
          plotFieldCommandId={_id}
        />
      ) : command === "choice" ? (
        <CommandChoiceField
          command={command}
          topologyBlockId={topologyBlockId}
          plotFieldCommandId={_id}
        />
      ) : command === "call" ? (
        <CommandCallField
          command={command}
          topologyBlockId={topologyBlockId}
          plotFieldCommandId={_id}
        />
      ) : command === "condition" ? (
        <CommandConditionField
          command={command}
          topologyBlockId={topologyBlockId}
          plotFieldCommandId={_id}
        />
      ) : command === "comment" ? (
        <CommandCommentField command={command} plotFieldCommandId={_id} />
      ) : null}
    </li>
  );
}
