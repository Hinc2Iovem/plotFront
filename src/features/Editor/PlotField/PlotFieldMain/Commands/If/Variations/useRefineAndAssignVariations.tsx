import { useEffect } from "react";
import useGetAllIfVariationsByIfId, {
  IfVariationResponseTypes,
} from "../../../../hooks/If/BlockVariations/useGetAllIfVariationsByIfId";
import { StatusTypes } from "../../../../../../../types/StoryData/Status/StatusTypes";
import useCommandIf from "../Context/IfContext";
import { IfVariationTypes } from "../Context/IfVariationSlice";

type RefineAndAssignVariationsTypes = {
  plotfieldCommandId: string;
  ifId: string;
};

export default function useRefineAndAssignVariations({ ifId, plotfieldCommandId }: RefineAndAssignVariationsTypes) {
  const { setIfVariations } = useCommandIf();

  const { data: variations } = useGetAllIfVariationsByIfId({ ifId });

  useEffect(() => {
    if (variations) {
      const mapToIfVariations = (variations: IfVariationResponseTypes): IfVariationTypes[] => {
        const newVariations: IfVariationTypes[] = [];

        variations.key.forEach((item) => {
          newVariations.push({
            ifVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "key",
            commandKeyId: item.commandKeyId,
          });
        });

        variations.appearance.forEach((item) => {
          newVariations.push({
            ifVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "appearance",
            appearancePartId: item.appearancePartId,
            currentlyDressed: item.currentlyDressed,
          });
        });

        variations.retry.forEach((item) => {
          newVariations.push({
            ifVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "retry",
            amountOfRetries: item.amountOfRetries,
            sign: item.sign,
          });
        });

        variations.character.forEach((item) => {
          newVariations.push({
            ifVariationId: item._id,
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
            ifVariationId: item._id,
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
            ifVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "language",
            currentLanguage: item.currentLanguage,
          });
        });

        variations.status.forEach((item) => {
          newVariations.push({
            ifVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "status",
            characterId: item.characterId,
            status: item.status as StatusTypes,
          });
        });

        variations.random.forEach((item) => {
          newVariations.push({
            ifVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "random",
            isRandom: item.isRandom,
          });
        });
        return newVariations.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      };

      setIfVariations({
        ifVariations: mapToIfVariations(variations),
        plotfieldCommandId,
      });
    }
  }, [variations]);
}
