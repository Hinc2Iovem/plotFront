import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import { useEffect, useState } from "react";
import { CommandSayVariationTypes } from "../../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import useSearch from "../../../../../../Context/Search/SearchContext";
import useGetCurrentFocusedElement from "../../../../../hooks/helpers/useGetCurrentFocusedElement";
import useUpdateCommandSayType from "../../../../../hooks/Say/patch/useUpdateCommandSayType";
import DeleteCommandContextMenuWrapper from "../../../../components/DeleteCommandContextMenuWrapper";

const CommandSayPossibleUpdateVariations = ["author", "hint", "notify"];

type SayFieldItemVariationTypeTypes = {
  sayVariationType: string;
  plotFieldCommandId: string;
  episodeId: string;
  plotFieldCommandSayId: string;
  textValue: string;
  topologyBlockId: string;
  setSayVariationType: React.Dispatch<React.SetStateAction<string>>;
};

export default function SayFieldItemVariationType({
  sayVariationType,
  episodeId,
  plotFieldCommandSayId,
  plotFieldCommandId,
  setSayVariationType,
  textValue,
  topologyBlockId,
}: SayFieldItemVariationTypeTypes) {
  const [, setRerender] = useState(false);
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;
  const updateValue = useSearch((state) => state.updateValue);

  const handleOnUpdateNameValue = (pv: string) => {
    if (pv) {
      setSayVariationType(pv);
      if (episodeId) {
        updateValue({
          episodeId,
          id: plotFieldCommandId,
          type: "command",
          value: `${pv} ${textValue}`,
          commandName: pv,
        });
      }
    }
  };

  useEffect(() => {
    if (sayVariationType) {
      setRerender((prev) => !prev);
    }
  }, [sayVariationType]);

  const updateCommandSayNameValue = useUpdateCommandSayType({
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  return (
    <DeleteCommandContextMenuWrapper plotfieldCommandId={plotFieldCommandId} topologyBlockId={topologyBlockId}>
      <SelectWithBlur
        onValueChange={(v) => {
          handleOnUpdateNameValue(v);
          updateCommandSayNameValue.mutate(v as CommandSayVariationTypes);
        }}
      >
        <SelectTrigger
          className={`
        ${isCommandFocused ? "bg-brand-gradient" : "bg-secondary hover:bg-accent"} 
        sm:w-[20%] min-w-[150px] sm:max-w-[200px] capitalize w-full text-text`}
        >
          <SelectValue
            placeholder={sayVariationType}
            onBlur={(v) => v.currentTarget.blur()}
            className={`capitalize text-text text-[25px] py-[20px]`}
          />
        </SelectTrigger>
        <SelectContent>
          {CommandSayPossibleUpdateVariations.map((pv) => {
            return (
              <SelectItem
                key={pv}
                value={pv}
                className={`${pv === sayVariationType ? "hidden" : ""} capitalize w-full`}
              >
                {pv}
              </SelectItem>
            );
          })}
        </SelectContent>
      </SelectWithBlur>
    </DeleteCommandContextMenuWrapper>
  );
}
