import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import useAddNewLogicalOperator from "../../../hooks/If/BlockVariations/logicalOperator/useAddNewLogicalOperator";
import useAddNewIfVariation from "../../../hooks/If/BlockVariations/useAddNewIfVariation";
import useCommandIf from "./Context/IfContext";
import CreateVariationButton from "../../components/CreateVariationButton";
import { ConditionValueVariationType } from "@/types/StoryEditor/PlotField/Condition/ConditionTypes";

type CreateIfVariationButtonTypes = {
  ifId: string;
  plotfieldCommandId: string;
};

export default function CreateIfVariationButton({ ifId, plotfieldCommandId }: CreateIfVariationButtonTypes) {
  const { addIfVariation, getAmountOfIfVariations, addNewLogicalOperator } = useCommandIf();

  const createifVariation = useAddNewIfVariation({ ifId });
  const addLogicalOperator = useAddNewLogicalOperator({ ifId });

  const handleCreatingIfVariation = ({ value }: { value: ConditionValueVariationType }) => {
    const _id = generateMongoObjectId();
    createifVariation.mutate({
      _id,
      type: value,
    });

    const amount = getAmountOfIfVariations({ plotfieldCommandId });

    if (amount > 0) {
      addNewLogicalOperator({ logicalOperator: "&&", plotfieldCommandId });
      addLogicalOperator.mutate({ logicalOperator: "&&" });
    }

    addIfVariation({
      plotfieldCommandId,
      ifVariation: {
        ifVariationId: _id,
        type: value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  };

  return <CreateVariationButton buttonClasses="" handleCreatingVariation={handleCreatingIfVariation} />;
}
