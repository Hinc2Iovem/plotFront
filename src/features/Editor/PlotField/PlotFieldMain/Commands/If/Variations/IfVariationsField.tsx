import {
  ConditionSignTypes,
  ConditionValueVariationType,
} from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import AsideScrollableButton from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import useUpdateIfCharacter from "../../../../hooks/If/BlockVariations/patch/useUpdateIfCharacter";
import useUpdateIfCharacteristic from "../../../../hooks/If/BlockVariations/patch/useUpdateIfCharacteristic";
import useUpdateIfRetry from "../../../../hooks/If/BlockVariations/patch/useUpdateIfRetry";
import useIfVariations from "../Context/IfContext";
import { IfVariationInputField } from "./IfVariationInputField";
import useRefineAndAssignVariations from "./useRefineAndAssignVariations";

type IfVariationsFieldTypes = {
  plotfieldCommandId: string;
  topologyBlockId: string;
  ifId: string;
  logicalOperators: string;
};

export default function IfVariationsField({
  plotfieldCommandId,
  ifId,
  topologyBlockId,
  logicalOperators,
}: IfVariationsFieldTypes) {
  const { getAllIfVariationsByPlotfieldCommandId } = useIfVariations();
  useRefineAndAssignVariations({ ifId, plotfieldCommandId });
  return (
    <div className={`flex gap-[.5rem] w-full flex-wrap`}>
      {getAllIfVariationsByPlotfieldCommandId({ plotfieldCommandId }).map((cbv, i) => (
        <IfVariationInputField
          key={cbv.ifVariationId}
          {...cbv}
          topologyBlockId={topologyBlockId}
          plotfieldCommandId={plotfieldCommandId}
          ifId={ifId}
          logicalOperators={logicalOperators}
          insidePlotfield={false}
          index={i}
        />
      ))}
    </div>
  );
}

type PlotfieldSingsPromptTypes = {
  setShowSignModal: React.Dispatch<React.SetStateAction<boolean>>;
  signName: ConditionSignTypes;
  plotfieldCommandId: string;
  type: ConditionValueVariationType;
  ifVariationId: string;
};

export function PlotfieldIfSingsPrompt({
  setShowSignModal,
  signName,
  plotfieldCommandId,
  ifVariationId,
  type,
}: PlotfieldSingsPromptTypes) {
  const { updateIfVariationSign } = useIfVariations();
  const updateValueCharacter = useUpdateIfCharacter({ ifCharacterId: ifVariationId });
  const updateValueCharacteristic = useUpdateIfCharacteristic({
    ifCharacteristicId: ifVariationId,
  });
  const updateValueRetry = useUpdateIfRetry({ ifRetryId: ifVariationId });

  return (
    <AsideScrollableButton
      type="button"
      onClick={() => {
        if (type === "character") {
          updateValueCharacter.mutate({ sign: signName });
        } else if (type === "characteristic") {
          updateValueCharacteristic.mutate({ sign: signName });
        } else if (type === "retry") {
          updateValueRetry.mutate({ sign: signName });
        }

        updateIfVariationSign({
          sign: signName,
          ifVariationId,
          plotFieldCommandId: plotfieldCommandId,
        });
        setShowSignModal(false);
      }}
    >
      {signName}
    </AsideScrollableButton>
  );
}
