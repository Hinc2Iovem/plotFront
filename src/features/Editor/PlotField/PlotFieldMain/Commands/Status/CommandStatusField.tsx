import { StatusTypes } from "@/types/StoryData/Status/StatusTypes";
import { CommandStatusTypes } from "@/types/StoryEditor/PlotField/Status/StatusTypes";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandStatus from "../../../hooks/Status/useGetCommandStatus";
import useUpdateCommandStatus from "../../../hooks/Status/useUpdateCommandStatus";
import CharacterPromptCreationWrapper from "../../components/CharacterPrompCreationWrapper/CharacterPromptCreationWrapper";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";

import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import { AllPossibleStatuses } from "@/const/STATUSES";
import useGetCharacterWithTranslation from "../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";

type CommandStatusFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandStatusField({ topologyBlockId, plotFieldCommandId }: CommandStatusFieldTypes) {
  const { episodeId } = useParams();
  const { data: commandStatus } = useGetCommandStatus({ plotFieldCommandId });

  const [statusState, setStatusState] = useState<CommandStatusTypes>({
    _id: "",
    plotFieldCommandId: plotFieldCommandId,
    characterId: "",
    status: "" as StatusTypes,
  });

  const { characterValue, setCharacterValue } = useGetCharacterWithTranslation({
    currentCharacterId: commandStatus?.characterId,
  });

  useEffect(() => {
    if (commandStatus) {
      setStatusState({
        ...commandStatus,
      });
      setCharacterValue((prev) => ({
        ...prev,
        _id: commandStatus.characterId || "",
      }));
    }
  }, [commandStatus]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "status",
    id: plotFieldCommandId,
    text: `${statusState.status}`,
    topologyBlockId,
    type: "command",
  });

  const updateStatus = useUpdateCommandStatus({ statusId: statusState._id || "" });

  const onBlur = (value: string, type: "character" | "status") => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "status",
        id: plotFieldCommandId,
        value: `${type === "character" ? value : characterValue.characterName} ${
          type === "status" ? value : statusState.status
        }`,
        type: "command",
      });
    }
  };

  return (
    <div className="w-full border-border border-[1px] rounded-md p-[5px] flex flex-col gap-[5px]">
      <div className="flex flex-wrap gap-[5px] w-full sm:flex-row flex-col">
        <FocusedPlotfieldCommandNameField
          topologyBlockId={topologyBlockId}
          nameValue={"status"}
          plotFieldCommandId={plotFieldCommandId}
        />

        <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow flex sm:flex-row flex-col gap-[5px]">
          <CharacterPromptCreationWrapper
            initCharacterValue={characterValue}
            onBlur={(value) => {
              setCharacterValue(value);
              onBlur(value.characterName || "", "character");
              updateStatus.mutate({ characterId: value._id || "" });
            }}
            inputClasses="w-full pr-[35px] text-text md:text-[17px]"
            imgClasses="w-[30px] object-cover rounded-md right-0 absolute"
          />
          <StatusModal
            onSelect={(value) => {
              setStatusState((prev) => ({
                ...prev,
                status: value,
              }));
              updateStatus.mutate({ status: value });
            }}
            status={statusState.status || ("" as StatusTypes)}
          />
        </form>
      </div>
    </div>
  );
}

type StatusModalTypes = {
  status: StatusTypes;
  onSelect: (status: StatusTypes) => void;
};

function StatusModal({ status, onSelect }: StatusModalTypes) {
  return (
    <SelectWithBlur
      onValueChange={(v: StatusTypes) => {
        onSelect(v);
      }}
    >
      <SelectTrigger className="w-fit h-full text-text capitalize border-border border-[3px] hover:bg-accent active:scale-[.99] transition-all">
        <SelectValue placeholder={status || "Статус"} onBlur={(v) => v.currentTarget.blur()} />
      </SelectTrigger>
      <SelectContent>
        {AllPossibleStatuses.map((pv) => {
          return (
            <SelectItem key={pv} value={pv} className={`${pv === status ? "hidden" : ""} capitalize w-full`}>
              {pv}
            </SelectItem>
          );
        })}
      </SelectContent>
    </SelectWithBlur>
  );
}
