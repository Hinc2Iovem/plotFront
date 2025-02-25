import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandStat from "../../../hooks/Stat/useGetCommandStat";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useGetAllCharacteristicsByStoryId from "@/hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import { StatTypes } from "@/types/StoryEditor/PlotField/Stat/StatTypes";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import useUpdateStat from "../../../hooks/Stat/useUpdateStat";
import useGetTranslationCharacteristic from "@/hooks/Fetching/Translation/useGetTranslationCharacteristic";

type CommandStatFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandStatField({ topologyBlockId, plotFieldCommandId }: CommandStatFieldTypes) {
  const { episodeId } = useParams();
  const { data: commandStat } = useGetCommandStat({ plotFieldCommandId });

  const [statState, setStatState] = useState<StatTypes>({
    _id: "",
    plotFieldCommandId: plotFieldCommandId,
    characteristicId: "",
    statValue: 0,
  });

  const [characteristic, setCharacteristic] = useState("");

  const { data: translationCharacteristic } = useGetTranslationCharacteristic({
    characteristicId: statState.characteristicId || "",
    language: "russian",
  });

  useEffect(() => {
    if (commandStat) {
      setStatState({
        ...commandStat,
      });
    }
  }, [commandStat]);

  useEffect(() => {
    if (translationCharacteristic) {
      setCharacteristic((translationCharacteristic.translations || [])[0].text || "");
    }
  }, [translationCharacteristic]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "stat",
    id: plotFieldCommandId,
    text: `${characteristic} ${statState.statValue}`,
    topologyBlockId,
    type: "command",
  });

  const updateStat = useUpdateStat({ statId: statState._id || "" });

  const onBlur = (value: string | number, type: "name" | "value") => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "stat",
        id: plotFieldCommandId,
        value: `${type === "name" ? value : characteristic} ${type === "value" ? value : statState.statValue}`,
        type: "command",
      });
    }
  };

  return (
    <div className="w-full border-border border-[1px] rounded-md p-[5px] flex flex-col gap-[5px]">
      <div className="flex flex-wrap gap-[5px] w-full sm:flex-row flex-col">
        <FocusedPlotfieldCommandNameField
          topologyBlockId={topologyBlockId}
          nameValue={"stat"}
          plotFieldCommandId={plotFieldCommandId}
        />

        <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow flex sm:flex-row flex-col gap-[5px]">
          <StatCharacteristicModal
            characteristic={characteristic}
            onUpdate={({ characteristic, characteristicId }) => {
              setStatState((prev) => ({
                ...prev,
                characteristicId,
              }));
              setCharacteristic(characteristic);
              onBlur(characteristic, "name");
              updateStat.mutate({ characteristicId });
            }}
          />
          <StatValueField
            initValue={statState.statValue || 0}
            onBlur={(value) => {
              onBlur(value, "value");
              setStatState((prev) => ({
                ...prev,
                statValue: value,
              }));
              updateStat.mutate({ statValue: value });
            }}
          />
        </form>
      </div>
    </div>
  );
}

type StatValueFieldTypes = {
  initValue: number;
  onBlur: (value: number) => void;
};

function StatValueField({ initValue, onBlur }: StatValueFieldTypes) {
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
      onBlur={() => onBlur(value)}
      value={value || ""}
      className="w-[100px]"
      type="number"
      placeholder="Значение"
      onChange={(e) => setValue(+e.target.value)}
    />
  );
}

type StatCharacteristicModalTypes = {
  inputClasses?: string;
  characteristic: string;
  onUpdate: ({ characteristic, characteristicId }: { characteristic: string; characteristicId: string }) => void;
};

function StatCharacteristicModal({ characteristic, inputClasses, onUpdate }: StatCharacteristicModalTypes) {
  const { storyId } = useParams();
  const [showCharacteristicModal, setShowCharacteristicModal] = useState(false);
  const [localCharacteristic, setLocalCharacteristic] = useState(characteristic || "");
  const currentInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (characteristic.trim().length && !localCharacteristic.trim().length) {
      setLocalCharacteristic(characteristic);
    }
  }, [characteristic]);

  const { data: characteristics } = useGetAllCharacteristicsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  const memoizedCharacteristics = useMemo(() => {
    if (!characteristics) return [];

    if (localCharacteristic?.trim().length) {
      return characteristics.filter((c) =>
        c.translations.filter(
          (ct) =>
            ct.textFieldName === "characterCharacteristic" &&
            ct.text?.toLowerCase().includes(localCharacteristic?.toLowerCase())
        )
      );
    } else {
      return characteristics;
    }
  }, [localCharacteristic, characteristics]);

  const updateCharacteristicOnBlur = () => {
    if (characteristic === localCharacteristic || !localCharacteristic.trim().length) {
      return;
    }

    const existingCharacteristic = memoizedCharacteristics.find((mc) =>
      mc.translations.find((mct) => mct.text?.toLowerCase() === localCharacteristic?.toLowerCase())
    );
    if (existingCharacteristic) {
      handleSubmit({
        characteristicId: existingCharacteristic.characteristicId,
        providedCharacteristic:
          (existingCharacteristic.translations || []).find((t) => t.textFieldName === "characterCharacteristic")
            ?.text || "",
      });
    }
  };

  const handleSubmit = ({
    characteristicId,
    providedCharacteristic,
  }: {
    providedCharacteristic: string;
    characteristicId: string;
  }) => {
    if (characteristic === providedCharacteristic) {
      return;
    }

    setLocalCharacteristic(providedCharacteristic);
    onUpdate({
      characteristic: providedCharacteristic,
      characteristicId,
    });
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: memoizedCharacteristics.length });

  return (
    <Popover open={showCharacteristicModal} onOpenChange={setShowCharacteristicModal}>
      <PopoverTrigger asChild>
        <div className="flex-grow">
          <PlotfieldInput
            ref={currentInput}
            value={localCharacteristic}
            onChange={(e) => {
              setLocalCharacteristic(e.target.value);
            }}
            onBlur={updateCharacteristicOnBlur}
            className={`${inputClasses ? inputClasses : " w-full text-text md:text-[17px] border-border border-[3px]"}`}
            placeholder="Характеристика"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
        {memoizedCharacteristics?.length ? (
          memoizedCharacteristics?.map((c, i) => (
            <Button
              key={`${c.characteristicId}-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={() => {
                handleSubmit({
                  providedCharacteristic: c.translations[0]?.text,
                  characteristicId: c.characteristicId,
                });
                setShowCharacteristicModal(false);
              }}
              className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            >
              {c.translations[0]?.text.length > 20
                ? c.translations[0]?.text.substring(0, 20) + "..."
                : c.translations[0]?.text}
            </Button>
          ))
        ) : !memoizedCharacteristics?.length ? (
          <Button
            type="button"
            onClick={() => setShowCharacteristicModal(false)}
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            Пусто
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
