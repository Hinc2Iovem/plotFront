import useDuplicateFocusedCommandAchievement from "./allHooks/useDuplicateFocusedCommandAchievement";
import useDuplicateFocusedCommandAmbient from "./allHooks/useDuplicateFocusedCommandAmbient";
import useDuplicateFocusedCommandAuthor from "./allHooks/useDuplicateFocusedCommandAuthor";
import useDuplicateFocusedCommandBackground from "./allHooks/useDuplicateFocusedCommandBackground";
import useDuplicateFocusedCommandCall from "./allHooks/useDuplicateFocusedCommandCall";
import useDuplicateFocusedCommandCharacter from "./allHooks/useDuplicateFocusedCommandCharacter";
import useDuplicateFocusedCommandChoice from "./allHooks/useDuplicateFocusedCommandChoice";
import useDuplicateFocusedCommandComment from "./allHooks/useDuplicateFocusedCommandComment";
import useDuplicateFocusedCommandCondition from "./allHooks/useDuplicateFocusedCommandCondition";
import useDuplicateFocusedCommandCutScene from "./allHooks/useDuplicateFocusedCommandCutScene";
import useDuplicateFocusedCommandEffect from "./allHooks/useDuplicateFocusedCommandEffect";
import useDuplicateFocusedCommandGetItem from "./allHooks/useDuplicateFocusedCommandGetItem";
import useDuplicateFocusedCommandHint from "./allHooks/useDuplicateFocusedCommandHint";
import useDuplicateFocusedCommandIf from "./allHooks/useDuplicateFocusedCommandIf";
import useDuplicateFocusedCommandKey from "./allHooks/useDuplicateFocusedCommandKey";
import useDuplicateFocusedCommandMove from "./allHooks/useDuplicateFocusedCommandMove";
import useDuplicateFocusedCommandMusic from "./allHooks/useDuplicateFocusedCommandMusic";
import useDuplicateFocusedCommandNotify from "./allHooks/useDuplicateFocusedCommandNotify";
import useDuplicateFocusedCommandSound from "./allHooks/useDuplicateFocusedCommandSound";
import useDuplicateFocusedCommandSuit from "./allHooks/useDuplicateFocusedCommandSuit";
import useDuplicateFocusedCommandWait from "./allHooks/useDuplicateFocusedCommandWait";
import useDuplicateFocusedCommandWardrobe from "./allHooks/useDuplicateFocusedCommandWardrobe";
import useDuplicateFocusedCommandName from "./allHooks/useDuplicateFocusedCommandName";
import useTypedSessionStorage, { SessionStorageKeys } from "../../shared/SessionStorage/useTypedSessionStorage";

type HandleDuplicationOfAllCommandsTypes = {
  topologyBlockId: string;
};

export default function useHandleDuplicationOfAllCommands({ topologyBlockId }: HandleDuplicationOfAllCommandsTypes) {
  const { getItem } = useTypedSessionStorage<SessionStorageKeys>();

  const currentTopologyBlockId = getItem("focusedTopologyBlock");
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
