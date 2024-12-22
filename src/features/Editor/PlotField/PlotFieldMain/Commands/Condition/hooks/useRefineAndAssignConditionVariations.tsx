import { useEffect } from "react";
import useGetAllConditionBlockVariationsByConditionBlockId, {
  ConditionVariationResponseTypes,
} from "../../../../hooks/Condition/ConditionBlock/BlockVariations/useGetAllConditionBlockVariationsByConditionBlockId";
import useConditionBlocks, { ConditionBlockVariationTypes } from "../Context/ConditionContext";
import { StatusTypes } from "../../../../../../../types/StoryData/Status/StatusTypes";

type RefineAndAssignConditionVariationsTyps = {
  conditionBlockId: string;
  plotfieldCommandId: string;
};

export default function useRefineAndAssignConditionVariations({
  conditionBlockId,
  plotfieldCommandId,
}: RefineAndAssignConditionVariationsTyps) {
  const { setConditionBlockVariations } = useConditionBlocks();

  const { data: variations } = useGetAllConditionBlockVariationsByConditionBlockId({ conditionBlockId });

  useEffect(() => {
    if (variations) {
      const mapToConditionBlockVariations = (
        variations: ConditionVariationResponseTypes
      ): ConditionBlockVariationTypes[] => {
        const newVariations: ConditionBlockVariationTypes[] = [];

        variations.key.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "key",
            commandKeyId: item.commandKeyId,
          });
        });

        variations.appearance.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "appearance",
            appearancePartId: item.appearancePartId,
            currentlyDressed: item.currentlyDressed,
          });
        });

        variations.retry.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "retry",
            amountOfRetries: item.amountOfRetries,
            sign: item.sign,
          });
        });

        variations.character.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "character",
            characterId: item.characterId,
            value: item.value,
            sign: item.sign,
          });
        });

        variations.characteristic.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "characteristic",
            characteristicId: item.characteristicId,
            secondCharacteristicId: item.secondCharacteristicId,
            value: item.value,
            sign: item.sign,
          });
        });

        variations.language.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "language",
            currentLanguage: item.currentLanguage,
          });
        });

        variations.status.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "status",
            characterId: item.characterId,
            status: item.status as StatusTypes,
          });
        });

        variations.random.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "random",
            isRandom: item.isRandom,
          });
        });
        return newVariations.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      };

      setConditionBlockVariations({
        conditionBlockId,
        conditionBlockVariations: mapToConditionBlockVariations(variations),
        plotfieldCommandId,
      });
    }
  }, [variations]);
}
