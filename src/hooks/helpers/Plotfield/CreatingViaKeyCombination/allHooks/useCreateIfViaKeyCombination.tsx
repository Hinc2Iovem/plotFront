import useCreateCommandIf, {
  CreateCommandIfBodyTypes,
} from "../../../../../features/Editor/PlotField/hooks/If/useCreateCommandIf";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateIfViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateIfViaKeyCombination({ topologyBlockId }: CreateIfViaKeyCombinationTypes) {
  // TODO need to update on backend this route
  const createIf = useCreateCommandIf({});

  const plotFieldCommandIfElseEndId = generateMongoObjectId();
  const plotFieldCommandElseId = generateMongoObjectId();
  useHandleCreatingViaKeyCombinationProcess<CreateCommandIfBodyTypes>({
    createCommand: createIf,
    firstEngLetter: "f",
    secondEngLetter: "i",
    firstRusLetter: "а",
    secondRusLetter: "ш",
    topologyBlockId,
    createCommandData: { plotFieldCommandIfElseEndId, plotFieldCommandElseId },
  });
}
