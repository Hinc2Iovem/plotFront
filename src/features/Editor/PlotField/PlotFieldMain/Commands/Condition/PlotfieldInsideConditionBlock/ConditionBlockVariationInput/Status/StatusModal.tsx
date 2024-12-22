import { useRef, useState } from "react";
import { AllPossibleStatuses } from "../../../../../../../../../const/STATUSES";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldButton from "../../../../../../../../../ui/Buttons/PlotfieldButton";
import { StatusTypes } from "../../../../../../../../../types/StoryData/Status/StatusTypes";
import useUpdateConditionStatus from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionStatus";
import useConditionBlocks from "../../../Context/ConditionContext";

type StatusModalTypes = {
  status: StatusTypes;
  conditionBlockVariationId: string;
  conditionBlockId: string;
  plotfieldCommandId: string;
  setStatus: React.Dispatch<React.SetStateAction<StatusTypes>>;
};

export default function StatusModal({
  status,
  conditionBlockVariationId,
  conditionBlockId,
  plotfieldCommandId,
  setStatus,
}: StatusModalTypes) {
  const { updateConditionBlockVariationValue } = useConditionBlocks();
  const [showAllLangauges, setShowAllStatuses] = useState(false);
  const statusModalRef = useRef<HTMLDivElement>(null);

  const updateConditionStatus = useUpdateConditionStatus({ conditionBlockStatusId: conditionBlockVariationId });

  useOutOfModal({
    modalRef: statusModalRef,
    setShowModal: setShowAllStatuses,
    showModal: showAllLangauges,
  });
  return (
    <div className="relative w-fit">
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowAllStatuses((prev) => !prev);
        }}
        type="button"
        className={`bg-primary-darker h-full hover:bg-primary transition-colors text-text-light w-full`}
      >
        {status?.trim().length ? status : "Статус"}
      </PlotfieldButton>

      <AsideScrollable
        ref={statusModalRef}
        className={`${showAllLangauges ? "" : "hidden"} w-fit right-0 translate-y-[.5rem]`}
      >
        {AllPossibleStatuses.map((l) => (
          <AsideScrollableButton
            key={l}
            onClick={() => {
              setStatus(l);
              setShowAllStatuses(false);
              updateConditionBlockVariationValue({
                conditionBlockId,
                conditionBlockVariationId,
                plotfieldCommandId,
                status: l,
              });

              updateConditionStatus.mutate({ status: l });
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
