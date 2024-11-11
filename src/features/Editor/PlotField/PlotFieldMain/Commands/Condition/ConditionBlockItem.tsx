import plus from "../../../../../../assets/images/shared/plus.png";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { StatusTypes } from "../../../../../../types/StoryData/Status/StatusTypes";
import AsideScrollable from "../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import ButtonHoverPromptModal from "../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import PlotfieldButton from "../../../../../shared/Buttons/PlotfieldButton";
import useGetAllConditionBlockVariationsByConditionBlockId, {
  ConditionVariationResponseTypes,
} from "../../../hooks/Condition/ConditionBlock/BlockVariations/useGetAllConditionBlockVariationsByConditionBlockId";
import useUpdateConditionBlockTopologyBlockId from "../../../hooks/Condition/ConditionBlock/useUpdateConditionBlockTopologyBlockId";
import useGetAllTopologyBlocksByEpisodeId from "../../../hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import useGetTopologyBlockById from "../../../hooks/TopologyBlock/useGetTopologyBlockById";
import ConditionBlockShowPlot from "./ConditionBlockShowPlot";
import ConditionValueItem from "./ConditionValueItem";
import useConditionBlocks, { ConditionBlockItemTypes, ConditionBlockVariationTypes } from "./Context/ConditionContext";
import DisplayOrderOfIfsModal from "./DisplayOrderOfIfsModal";
import { AllPossibleConditionBlockVariations } from "../../../../../../const/CONDITION_BLOCK_VARIATIONS";
import useAddNewConditionBlockVariation from "../../../hooks/Condition/ConditionBlock/BlockVariations/useAddNewConditionBlockVariation";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";

type ConditionBlockItemProps = {
  currentTopologyBlockId: string;
  conditionId: string;
  plotfieldCommandId: string;
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
} & ConditionBlockItemTypes;

export default function ConditionBlockItem({
  setShowConditionBlockPlot,
  conditionBlockId,
  targetBlockId,
  isElse,
  orderOfExecution,
  currentTopologyBlockId,
  conditionId,
  topologyBlockName,
  plotfieldCommandId,
  conditionBlockVariations,
  logicalOperators,
}: ConditionBlockItemProps) {
  const { episodeId } = useParams();
  const { updateConditionBlockTargetBlockId, setConditionBlockVariations, addConditionBlockVariation } =
    useConditionBlocks();
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: topologyBlock } = useGetTopologyBlockById({
    topologyBlockId: targetBlockId,
  });

  const [showCreateCondition, setShowCreateCondition] = useState(false);
  const conditionModalRef = useRef<HTMLDivElement>(null);

  const [showAllTopologyBlocks, setShowAllTopologyBlocks] = useState(false);

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
            type: "key",
            commandKeyId: item.commandKeyId,
          });
        });

        variations.appearance.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            type: "appearance",
            appearancePartId: item.appearancePartId,
          });
        });

        variations.retry.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            type: "retry",
            amountOfRetries: item.amountOfRetries,
            sign: item.sign,
          });
        });

        variations.character.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            type: "character",
            characterId: item.characterId,
            value: item.value,
            sign: item.sign,
          });
        });

        variations.characteristic.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
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
            type: "language",
            currentLanguage: item.currentLanguage,
          });
        });

        variations.status.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            type: "status",
            characterId: item.characterId,
            status: item.status as StatusTypes,
          });
        });

        variations.random.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            type: "random",
            isRandom: item.isRandom,
          });
        });

        return newVariations;
      };

      setConditionBlockVariations({
        conditionBlockId,
        conditionBlockVariations: mapToConditionBlockVariations(variations),
        plotfieldCommandId,
      });
    }
  }, [variations]);

  useEffect(() => {
    if (topologyBlock) {
      updateConditionBlockTargetBlockId({
        conditionBlockId,
        plotfieldCommandId,
        targetBlockId,
        topologyBlockName: topologyBlock?.name || "",
      });
    }
  }, [topologyBlock]);

  const { data: allTopologyBlocks } = useGetAllTopologyBlocksByEpisodeId({
    episodeId: episodeId ?? "",
  });

  const updateTopologyBlock = useUpdateConditionBlockTopologyBlockId({
    conditionBlockId: conditionBlockId,
    sourceBlockId: targetBlockId,
    episodeId: episodeId || "",
  });

  const useCreateConditionVariation = useAddNewConditionBlockVariation({ conditionBlockId });

  useOutOfModal({
    setShowModal: setShowAllTopologyBlocks,
    showModal: showAllTopologyBlocks,
    modalRef,
  });

  useOutOfModal({
    setShowModal: setShowCreateCondition,
    showModal: showCreateCondition,
    modalRef: conditionModalRef,
  });

  return (
    <>
      {!isElse ? (
        <div className={`p-[1rem] flex flex-col gap-[1rem]  w-full bg-secondary rounded-md shadow-md relative`}>
          <div className="relative ">
            <ButtonHoverPromptModal
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateCondition((prev) => !prev);
              }}
              className="w-[3rem] bg-primary hover:bg-primary-darker transition-colors"
              contentName="Создать Условие"
              positionByAbscissa="left"
              asideClasses="text-text-light text-[1.3rem] translate-y-[-1rem]"
              variant="rectangle"
            >
              <img src={plus} alt="+" className="w-full" />
            </ButtonHoverPromptModal>

            <AsideScrollable
              ref={conditionModalRef}
              className={`${showCreateCondition ? "" : "hidden"} left-0 translate-y-[.5rem]`}
            >
              {AllPossibleConditionBlockVariations.map((cbv) => (
                <AsideScrollableButton
                  key={cbv}
                  onClick={() => {
                    setShowCreateCondition(false);
                    const _id = generateMongoObjectId();
                    useCreateConditionVariation.mutate({
                      _id,
                      type: cbv,
                    });
                    addConditionBlockVariation({
                      conditionBlockId,
                      plotfieldCommandId,
                      conditionBlockVariation: {
                        conditionBlockVariationId: _id,
                        type: cbv,
                      },
                    });
                  }}
                >
                  {cbv}
                </AsideScrollableButton>
              ))}
            </AsideScrollable>
          </div>

          <div className="flex flex-col gap-[1rem] ">
            <ConditionValueItem
              key={conditionBlockId}
              conditionBlockId={conditionBlockId}
              plotfieldCommandId={plotfieldCommandId}
              conditionBlockVariations={conditionBlockVariations}
              isElse={isElse}
              logicalOperators={logicalOperators}
              orderOfExecution={orderOfExecution}
              targetBlockId={targetBlockId}
              topologyBlockName={topologyBlockName}
            />
          </div>
          <div className="flex flex-col gap-[1rem]">
            <ConditionBlockShowPlot
              conditionBlockId={conditionBlockId}
              plotfieldCommandId={plotfieldCommandId}
              setShowConditionBlockPlot={setShowConditionBlockPlot}
              targetBlockId={targetBlockId}
            />
            <DisplayOrderOfIfsModal
              conditionBlockId={conditionBlockId}
              commandConditionId={conditionId}
              currentOrder={orderOfExecution}
              plotfieldCommandId={plotfieldCommandId}
            />
            <div className="relative w-full flex justify-between flex-wrap gap-[1rem]">
              <PlotfieldButton
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllTopologyBlocks((prev) => !prev);
                }}
                type="button"
              >
                {topologyBlockName ? `Ветка - ${topologyBlockName}` : "Текущая Ветка"}
              </PlotfieldButton>
              <AsideScrollable className={`${showAllTopologyBlocks ? "" : "hidden"} translate-y-[3.5rem]`}>
                {(allTopologyBlocks?.length || 0) > 1 ? (
                  allTopologyBlocks?.map((tb) => (
                    <AsideScrollableButton
                      key={tb._id}
                      type="button"
                      onClick={() => {
                        setShowAllTopologyBlocks(false);
                        updateConditionBlockTargetBlockId({
                          conditionBlockId,
                          plotfieldCommandId,
                          targetBlockId: tb._id,
                          topologyBlockName: tb?.name || "",
                        });
                        updateTopologyBlock.mutate({ targetBlockId: tb._id });
                      }}
                      className={`${currentTopologyBlockId === tb._id ? "hidden" : ""} ${
                        tb._id === targetBlockId ? "hidden" : ""
                      }`}
                    >
                      {tb.name}
                    </AsideScrollableButton>
                  ))
                ) : (
                  <AsideScrollableButton
                    type="button"
                    onClick={() => {
                      setShowAllTopologyBlocks(false);
                    }}
                  >
                    Пусто
                  </AsideScrollableButton>
                )}
              </AsideScrollable>
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex flex-wrap gap-[.5rem] flex-grow bg-secondary rounded-md shadow-md px-[.5rem] py-[.5rem]`}>
          <ConditionBlockShowPlot
            conditionBlockId={conditionBlockId}
            plotfieldCommandId={plotfieldCommandId}
            setShowConditionBlockPlot={setShowConditionBlockPlot}
            targetBlockId={targetBlockId}
          />
          <div className="relative self-end flex-grow">
            <PlotfieldButton
              onClick={(e) => {
                e.stopPropagation();
                setShowAllTopologyBlocks((prev) => !prev);
              }}
              type="button"
            >
              {topologyBlockName ? `Ветка - ${topologyBlockName}` : "Текущая Ветка"}
            </PlotfieldButton>
            <AsideScrollable ref={modalRef} className={`${showAllTopologyBlocks ? "" : "hidden"} translate-y-[3.5rem]`}>
              {(allTopologyBlocks?.length || 0) > 1 ? (
                allTopologyBlocks?.map((tb) => (
                  <AsideScrollableButton
                    key={tb._id}
                    type="button"
                    onClick={() => {
                      setShowAllTopologyBlocks(false);
                      updateConditionBlockTargetBlockId({
                        conditionBlockId,
                        plotfieldCommandId,
                        targetBlockId: tb._id,
                        topologyBlockName: tb?.name || "",
                      });
                      updateTopologyBlock.mutate({ targetBlockId: tb._id });
                    }}
                    className={`${currentTopologyBlockId === tb._id ? "hidden" : ""} ${
                      tb._id === targetBlockId ? "hidden" : ""
                    }`}
                  >
                    {tb.name}
                  </AsideScrollableButton>
                ))
              ) : (
                <AsideScrollableButton
                  type="button"
                  onClick={() => {
                    setShowAllTopologyBlocks(false);
                  }}
                >
                  Пусто
                </AsideScrollableButton>
              )}
            </AsideScrollable>
          </div>
        </div>
      )}
    </>
  );
}
