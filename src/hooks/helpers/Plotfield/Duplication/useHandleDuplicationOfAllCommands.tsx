import useDuplicateFocusedCommandAchievement from "./AllHooks/useDuplicateFocusedCommandAchievement";
import useDuplicateFocusedCommandAmbient from "./AllHooks/useDuplicateFocusedCommandAmbient";
import useDuplicateFocusedCommandAuthor from "./AllHooks/useDuplicateFocusedCommandAuthor";
import useDuplicateFocusedCommandBackground from "./AllHooks/useDuplicateFocusedCommandBackground";
import useDuplicateFocusedCommandCall from "./AllHooks/useDuplicateFocusedCommandCall";
import useDuplicateFocusedCommandCharacter from "./AllHooks/useDuplicateFocusedCommandCharacter";
import useDuplicateFocusedCommandChoice from "./AllHooks/useDuplicateFocusedCommandChoice";
import useDuplicateFocusedCommandComment from "./AllHooks/useDuplicateFocusedCommandComment";
import useDuplicateFocusedCommandCondition from "./AllHooks/useDuplicateFocusedCommandCondition";
import useDuplicateFocusedCommandCutScene from "./AllHooks/useDuplicateFocusedCommandCutScene";
import useDuplicateFocusedCommandEffect from "./AllHooks/useDuplicateFocusedCommandEffect";
import useDuplicateFocusedCommandGetItem from "./AllHooks/useDuplicateFocusedCommandGetItem";
import useDuplicateFocusedCommandHint from "./AllHooks/useDuplicateFocusedCommandHint";
import useDuplicateFocusedCommandIf from "./AllHooks/useDuplicateFocusedCommandIf";
import useDuplicateFocusedCommandKey from "./AllHooks/useDuplicateFocusedCommandKey";
import useDuplicateFocusedCommandMove from "./AllHooks/useDuplicateFocusedCommandMove";
import useDuplicateFocusedCommandMusic from "./AllHooks/useDuplicateFocusedCommandMusic";
import useDuplicateFocusedCommandNotify from "./AllHooks/useDuplicateFocusedCommandNotify";
import useDuplicateFocusedCommandSound from "./AllHooks/useDuplicateFocusedCommandSound";
import useDuplicateFocusedCommandSuit from "./AllHooks/useDuplicateFocusedCommandSuit";
import useDuplicateFocusedCommandWait from "./AllHooks/useDuplicateFocusedCommandWait";
import useDuplicateFocusedCommandWardrobe from "./AllHooks/useDuplicateFocusedCommandWardrobe";
import useDuplicateFocusedCommandName from "./AllHooks/useDuplicateFocusedCommandName";

type HandleDuplicationOfAllCommandsTypes = {
  topologyBlockId: string;
};

export default function useHandleDuplicationOfAllCommands({
  topologyBlockId,
}: HandleDuplicationOfAllCommandsTypes) {
  const currentTopologyBlockId = sessionStorage.getItem("focusedTopologyBlock");
  useDuplicateFocusedCommandAchievement({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandAmbient({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandBackground({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandCall({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandChoice({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandComment({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandAuthor({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandCharacter({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandCondition({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandCutScene({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandEffect({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandGetItem({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandHint({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandIf({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandKey({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandMove({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandMusic({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandName({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandNotify({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandSound({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandSuit({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandWait({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
  useDuplicateFocusedCommandWardrobe({
    topologyBlockId: currentTopologyBlockId || topologyBlockId,
  });
}
