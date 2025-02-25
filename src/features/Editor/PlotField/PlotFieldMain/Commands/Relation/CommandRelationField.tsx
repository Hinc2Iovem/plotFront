import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";

import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import { RelationCommandTypes } from "@/types/StoryEditor/PlotField/Relation/RelationTypes";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import useGetCharacterWithTranslation from "../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import useGetCommandRelation from "../../../hooks/Relation/Command/useGetCommandRelation";
import useUpdateCommandRelation from "../../../hooks/Relation/Command/useUpdateCommandRelation";
import CharacterPromptCreationWrapper from "../../components/CharacterPrompCreationWrapper/CharacterPromptCreationWrapper";

type CommandRelationFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandRelationField({ topologyBlockId, plotFieldCommandId }: CommandRelationFieldTypes) {
  const { episodeId } = useParams();
  const { data: commandRelation } = useGetCommandRelation({ plotFieldCommandId });

  const [relationState, setRelationState] = useState<RelationCommandTypes>({
    _id: "",
    plotFieldCommandId: plotFieldCommandId,
    characterId: "",
    relationValue: 0,
    sign: "" as "+",
  });

  const { characterValue, setCharacterValue } = useGetCharacterWithTranslation({
    currentCharacterId: commandRelation?.characterId,
  });

  useEffect(() => {
    if (commandRelation) {
      setRelationState({
        ...commandRelation,
      });
      setCharacterValue((prev) => ({
        ...prev,
        _id: commandRelation.characterId || "",
      }));
    }
  }, [commandRelation]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "stat",
    id: plotFieldCommandId,
    text: `${characterValue.characterName} ${relationState.sign} ${relationState.relationValue}`,
    topologyBlockId,
    type: "command",
  });

  const updateRelation = useUpdateCommandRelation({ relationId: relationState._id || "" });

  const onBlur = (value: string | number, type: "name" | "value" | "sign") => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "relation",
        id: plotFieldCommandId,
        value: `${type === "name" ? value : characterValue.characterName} ${
          type === "sign" ? value : relationState.sign
        } ${type === "value" ? value : relationState.relationValue}`,
        type: "command",
      });
    }
  };

  return (
    <div className="w-full border-border border-[1px] rounded-md p-[5px] flex flex-col gap-[5px]">
      <div className="flex flex-wrap gap-[5px] w-full sm:flex-row flex-col">
        <FocusedPlotfieldCommandNameField
          topologyBlockId={topologyBlockId}
          nameValue={"relation"}
          plotFieldCommandId={plotFieldCommandId}
        />

        <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow flex sm:flex-row flex-col gap-[5px]">
          <CharacterPromptCreationWrapper
            initCharacterValue={characterValue}
            onBlur={(value) => {
              setCharacterValue(value);
              onBlur(value.characterName || "", "name");
              setRelationState((prev) => ({
                ...prev,
                characterId: value._id || "",
              }));
              updateRelation.mutate({ characterId: value._id || "" });
            }}
            inputClasses="w-full pr-[35px] text-text md:text-[17px]"
            imgClasses="w-[30px] object-cover rounded-md right-0 absolute"
          />

          <PlusMinusModal
            onUpdate={(value) => {
              onBlur(value, "sign");
              setRelationState((prev) => ({
                ...prev,
                sign: value,
              }));
              updateRelation.mutate({ sign: value });
            }}
            defaultValue={relationState.sign || ""}
          />

          <RelationValueField
            initValue={relationState.relationValue || 0}
            onBlur={(value) => {
              onBlur(value, "value");
              setRelationState((prev) => ({
                ...prev,
                relationValue: value,
              }));
              updateRelation.mutate({ relationValue: value });
            }}
          />
        </form>
      </div>
    </div>
  );
}

type PlusMinusTypes = "+" | "-";
const plusMinus: PlusMinusTypes[] = ["+", "-"];

type PlusMinusModalTypes = {
  onUpdate: (sign: PlusMinusTypes) => void;
  defaultValue: PlusMinusTypes | string;
};

function PlusMinusModal({ defaultValue, onUpdate }: PlusMinusModalTypes) {
  return (
    <SelectWithBlur onValueChange={(v: PlusMinusTypes) => onUpdate(v)}>
      <SelectTrigger className={`min-w-[150px] sm:max-w-[200px] text-text`}>
        <SelectValue
          placeholder={!defaultValue.trim().length ? "+/-" : defaultValue}
          onBlur={(v) => v.currentTarget.blur()}
          className={`capitalize text-text text-[25px] py-[20px]`}
        />
      </SelectTrigger>
      <SelectContent>
        {plusMinus.map((pv) => {
          return (
            <SelectItem key={pv} value={pv} className={`${pv === defaultValue ? "hidden" : ""} capitalize w-full`}>
              {pv}
            </SelectItem>
          );
        })}
      </SelectContent>
    </SelectWithBlur>
  );
}

type RelationValueFieldTypes = {
  initValue: number;
  onBlur: (value: number) => void;
};

function RelationValueField({ initValue, onBlur }: RelationValueFieldTypes) {
  const [value, setValue] = useState(initValue || 0);
  const currentInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof initValue === "number" && value === 0) {
      setValue(initValue);
    }
  }, [initValue]);

  return (
    <PlotfieldInput
      ref={currentInput}
      className="w-[100px]"
      onBlur={() => onBlur(value)}
      value={value || ""}
      type="number"
      placeholder="Значение"
      onChange={(e) => setValue(+e.target.value)}
    />
  );
}
