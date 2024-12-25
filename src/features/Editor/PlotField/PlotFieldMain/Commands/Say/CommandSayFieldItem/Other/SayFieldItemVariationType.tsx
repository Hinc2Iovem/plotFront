import { useRef, useState } from "react";
import useCheckIsCurrentFieldFocused from "../../../../../../../../hooks/helpers/Plotfield/useInitializeCurrentlyFocusedCommandOnReload";
import { CommandSayVariationTypes } from "../../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import PlotfieldButton from "../../../../../../../../ui/Buttons/PlotfieldButton";
import useSearch from "../../../../../../Context/Search/SearchContext";
import useUpdateCommandSayType from "../../../../../hooks/Say/useUpdateCommandSayType";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";

const CommandSayPossibleUpdateVariations = ["author", "hint", "notify"];

type SayFieldItemVariationTypeTypes = {
  sayVariationType: string;
  plotFieldCommandId: string;
  episodeId: string;
  plotFieldCommandSayId: string;
  textValue: string;
  setSayVariationType: React.Dispatch<React.SetStateAction<string>>;
};

export default function SayFieldItemVariationType({
  sayVariationType,
  episodeId,
  plotFieldCommandSayId,
  plotFieldCommandId,
  setSayVariationType,
  textValue,
}: SayFieldItemVariationTypeTypes) {
  const [showUpdateNameModal, setShowUpdateNameModal] = useState(false);
  const updateNameModalRef = useRef<HTMLDivElement | null>(null);

  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });

  const { updateValue } = useSearch();

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

  const updateCommandSayNameValue = useUpdateCommandSayType({
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  useOutOfModal({
    modalRef: updateNameModalRef,
    setShowModal: setShowUpdateNameModal,
    showModal: showUpdateNameModal,
  });

  return (
    <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowUpdateNameModal((prev) => !prev);
          if (showUpdateNameModal) {
            e.currentTarget.blur();
          }
        }}
        className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"} capitalize text-start`}
      >
        {sayVariationType}
      </PlotfieldButton>
      <aside
        ref={updateNameModalRef}
        className={`${
          showUpdateNameModal ? "" : "hidden"
        } bg-secondary w-full translate-y-[.5rem] rounded-md shadow-md absolute z-10 flex flex-col gap-[.5rem] p-[.5rem]`}
      >
        {CommandSayPossibleUpdateVariations.map((pv) => {
          return (
            <PlotfieldButton
              key={pv}
              onClick={() => {
                handleOnUpdateNameValue(pv);
                updateCommandSayNameValue.mutate(pv as CommandSayVariationTypes);
                setShowUpdateNameModal(false);
              }}
              className={`${pv === sayVariationType ? "hidden" : ""} capitalize`}
            >
              {pv}
            </PlotfieldButton>
          );
        })}
      </aside>
    </div>
  );
}
