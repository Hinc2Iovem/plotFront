import { useRef, useState } from "react";
import { AllPossibleStatuses } from "../../../../../../../../../const/STATUSES";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldButton from "../../../../../../../../../ui/Buttons/PlotfieldButton";
import { StatusTypes } from "../../../../../../../../../types/StoryData/Status/StatusTypes";
import useIfVariations from "../../../Context/IfContext";
import useUpdateIfStatus from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfStatus";

type IfVariationStatusModalTypes = {
  ifVariationId: string;
  plotfieldCommandId: string;
  status: StatusTypes;
  setStatus: React.Dispatch<React.SetStateAction<StatusTypes>>;
};

export default function IfVariationStatusModal({
  ifVariationId,
  plotfieldCommandId,
  setStatus,
  status,
}: IfVariationStatusModalTypes) {
  const { updateIfVariationValue } = useIfVariations();

  const [showAllStatuses, setShowAllStatuses] = useState(false);
  const statusModalRef = useRef<HTMLDivElement>(null);

  const updateIfStatus = useUpdateIfStatus({ ifStatusId: ifVariationId });

  useOutOfModal({
    modalRef: statusModalRef,
    setShowModal: setShowAllStatuses,
    showModal: showAllStatuses,
  });

  return (
    <div className="relative w-fit">
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowAllStatuses((prev) => !prev);
        }}
        type="button"
        className={`bg-secondary h-full hover:bg-primary transition-colors text-text-light w-full`}
      >
        {status?.trim().length ? status : "Статус"}
      </PlotfieldButton>

      <AsideScrollable
        ref={statusModalRef}
        className={`${showAllStatuses ? "" : "hidden"} w-fit right-0 translate-y-[.5rem]`}
      >
        {AllPossibleStatuses.map((l) => (
          <AsideScrollableButton
            key={l}
            onClick={() => {
              setStatus(l);
              setShowAllStatuses(false);
              updateIfVariationValue({
                ifVariationId,
                plotfieldCommandId,
                status: l,
              });

              updateIfStatus.mutate({ status: l });
            }}
            type="button"
          >
            {l}
          </AsideScrollableButton>
        ))}
      </AsideScrollable>
    </div>
  );
}
