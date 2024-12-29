import useNavigation from "../../../../../features/Editor/Context/Navigation/NavigationContext";
import usePlotfieldCommands from "../../../../../features/Editor/PlotField/Context/PlotFieldContext";
import useCreateCommandIf, {
  CreateCommandIfBodyTypes,
} from "../../../../../features/Editor/PlotField/hooks/If/useCreateCommandIf";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import useTypedSessionStorage, { SessionStorageKeys } from "../../../shared/SessionStorage/useTypedSessionStorage";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateIfViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateIfViaKeyCombination({ topologyBlockId }: CreateIfViaKeyCombinationTypes) {
  const { getItem } = useTypedSessionStorage<SessionStorageKeys>();
  const { getCurrentAmountOfCommands } = usePlotfieldCommands();
  const { currentlyFocusedCommandId } = useNavigation();

  const createIf = useCreateCommandIf({});

  const focusedTopologyBlockId = getItem("focusedTopologyBlock");

  const currentTopologyBlockId = focusedTopologyBlockId?.trim().length ? focusedTopologyBlockId : topologyBlockId;

  const plotFieldCommandIfElseEndId = generateMongoObjectId();
  const plotFieldCommandElseId = generateMongoObjectId();

  const commandOrder =
    typeof currentlyFocusedCommandId.commandOrder === "number"
      ? currentlyFocusedCommandId?.commandOrder + 1
      : getCurrentAmountOfCommands({ topologyBlockId: currentTopologyBlockId });

  useHandleCreatingViaKeyCombinationProcess<CreateCommandIfBodyTypes>({
    createCommand: createIf,
    firstEngLetter: "f",
    secondEngLetter: "i",
    firstRusLetter: "а",
    secondRusLetter: "ш",
    topologyBlockId,
    createCommandData: {
      plotFieldCommandIfElseEndId,
      plotFieldCommandElseId,
      topologyBlockId: currentTopologyBlockId,
      commandOrder,
    },
    commandName: "if",
  });
}
