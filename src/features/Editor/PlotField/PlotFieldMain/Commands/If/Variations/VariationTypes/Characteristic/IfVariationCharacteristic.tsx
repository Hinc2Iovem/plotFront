import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationCharacteristic from "../../../../../../../../../hooks/Fetching/Translation/useGetTranslationCharacteristic";
import { ConditionSignTypes } from "../../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import { isNumeric } from "../../../../../../../../../utils/regExpIsNumeric";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateIfCharacteristic from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfCharacteristic";
import useCommandIf from "../../../Context/IfContext";
import IfSignField from "../../IfSignField";
import IfVariationCharacteristicModal from "./IfVariationCharacteristicModal";

type IfVariationCharacteristicTypes = {
  plotfieldCommandId: string;
  value: number | null;
  ifVariationId: string;
  firstCharacteristicId: string;
  topologyBlockId: string;
  secondCharacteristicId: string;
};

export default function IfVariationCharacteristic({
  plotfieldCommandId,
  value,
  ifVariationId,
  topologyBlockId,
  secondCharacteristicId,
  firstCharacteristicId,
}: IfVariationCharacteristicTypes) {
  const { getIfVariationById } = useCommandIf();
  const [currentSign, setCurrentSign] = useState<ConditionSignTypes>(
    getIfVariationById({
      plotfieldCommandId,
      ifVariationId: ifVariationId,
    })?.sign || ("" as ConditionSignTypes)
  );

  return (
    <div className="flex flex-col gap-[10px] w-full">
      <div className="w-full flex gap-[5px] flex-shrink flex-wrap">
        <CharacteristicInputField
          key={"characteristic-1"}
          plotfieldCommandId={plotfieldCommandId}
          fieldType="ifName"
          ifVariationId={ifVariationId}
          currentCharacteristicId={firstCharacteristicId}
          topologyBlockId={topologyBlockId}
        />
        <div className="w-fit">
          <IfSignField
            currentSign={currentSign}
            setCurrentSign={setCurrentSign}
            ifVariationId={ifVariationId}
            plotfieldCommandId={plotfieldCommandId}
            type="characteristic"
          />
        </div>
        <CharacteristicInputField
          key={"characteristic-2"}
          plotfieldCommandId={plotfieldCommandId}
          fieldType="ifValue"
          ifVariationId={ifVariationId}
          currentCharacteristicId={secondCharacteristicId}
          value={value}
          topologyBlockId={topologyBlockId}
        />
      </div>
    </div>
  );
}

type CharacteristicInputFieldTypes = {
  plotfieldCommandId: string;
  ifVariationId: string;
  currentCharacteristicId: string;
  topologyBlockId: string;
  value?: number | null;
  fieldType: "ifName" | "ifValue";
};

function CharacteristicInputField({
  plotfieldCommandId,
  fieldType,
  ifVariationId,
  currentCharacteristicId,
  value,
  topologyBlockId,
}: CharacteristicInputFieldTypes) {
  const { episodeId } = useParams();
  const [currentIfName, setCurrentIfName] = useState<string | number>(value ? value : "");
  const [initValue, setInitValue] = useState<string | number>(value ? value : "");

  const [characteristicId, setCharacteristicId] = useState(currentCharacteristicId);

  const { data: translatedCharacteristic } = useGetTranslationCharacteristic({
    characteristicId: characteristicId,
    language: "russian",
  });

  const { updateIfVariationValue } = useCommandIf();

  const updateIf = useUpdateIfCharacteristic({
    ifCharacteristicId: ifVariationId,
  });

  useEffect(() => {
    if (translatedCharacteristic) {
      setCurrentIfName((translatedCharacteristic.translations || [])[0]?.text);
      setInitValue((translatedCharacteristic.translations || [])[0]?.text);
    }
  }, [translatedCharacteristic, characteristicId]);

  useEffect(() => {
    // updates value for the second characteristic when it's a number
    if (isNumeric(currentIfName.toString()) && fieldType === "ifValue") {
      updateIfVariationValue({
        plotfieldCommandId,
        ifVariationId,
        ifValue: Number(currentIfName),
      });

      updateIf.mutate({
        value: Number(currentIfName),
      });
    }
  }, [currentIfName, fieldType]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "If - Characteristic",
    id: ifVariationId,
    text: typeof currentIfName === "string" ? currentIfName : currentIfName.toString(),
    topologyBlockId,
    type: "ifVariation",
  });

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Characteristic",
        id: ifVariationId,
        value: typeof currentIfName === "string" ? currentIfName : currentIfName.toString(),
        type: "ifVariation",
      });
    }
  }, [episodeId, currentIfName]);

  return (
    <div className="w-[40%] flex-grow min-w-[100px] relative">
      <IfVariationCharacteristicModal
        setCharacteristicId={setCharacteristicId}
        characteristicId={characteristicId}
        currentCharacteristic={currentIfName}
        ifVariationId={ifVariationId}
        setCurrentCharacteristic={setCurrentIfName}
        plotfieldCommandId={plotfieldCommandId}
        fieldType={fieldType}
        initValue={initValue}
        setInitValue={setInitValue}
      />
    </div>
  );
}
