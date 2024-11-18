import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import plus from "../../../../../../assets/images/shared/plus.png";
import { AllPossibleConditionBlockVariations } from "../../../../../../const/CONDITION_BLOCK_VARIATIONS";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { StatusTypes } from "../../../../../../types/StoryData/Status/StatusTypes";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import AsideScrollable from "../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import ButtonHoverPromptModal from "../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import PlotfieldButton from "../../../../../shared/Buttons/PlotfieldButton";
import useAddNewConditionBlockVariation from "../../../hooks/Condition/ConditionBlock/BlockVariations/useAddNewConditionBlockVariation";
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
import useAddNewLogicalOperator from "../../../hooks/Condition/ConditionBlock/BlockVariations/logicalOperator/useAddNewLogicalOperator";

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
  const {
    updateConditionBlockTargetBlockId,
    setConditionBlockVariations,
    addConditionBlockVariation,
    getAmountOfConditionBlockVariations,
    addNewLogicalOperator,
  } = useConditionBlocks();
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
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "key",
            commandKeyId: item.commandKeyId,
          });
        });

        variations.appearance.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "appearance",
            appearancePartId: item.appearancePartId,
            currentlyDressed: item.currentlyDressed,
          });
        });

        variations.retry.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "retry",
            amountOfRetries: item.amountOfRetries,
            sign: item.sign,
          });
        });

        variations.character.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
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
            conditionBlockVariationId: item._id,
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
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "language",
            currentLanguage: item.currentLanguage,
          });
        });

        variations.status.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "status",
            characterId: item.characterId,
            status: item.status as StatusTypes,
          });
        });

        variations.random.forEach((item) => {
          newVariations.push({
            conditionBlockVariationId: item._id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: "random",
            isRandom: item.isRandom,
          });
        });
        return newVariations.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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

  const createConditionVariation = useAddNewConditionBlockVariation({ conditionBlockId });
  const addLogicalOperator = useAddNewLogicalOperator({ conditionBlockId });

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
        <div className={`p-[1rem] flex flex-col gap-[1rem] w-full bg-secondary rounded-md shadow-md relative`}>
          <div className="relative flex gap-[1rem]">
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
              <img src={plus} alt="+" className="w-full mr-[1rem]" />
            </ButtonHoverPromptModal>

            <AsideScrollable
              ref={conditionModalRef}
              className={`${showCreateCondition ? "" : "hidden"} left-0 translate-y-[3.5rem]`}
            >
              {AllPossibleConditionBlockVariations.map((cbv) => (
                <AsideScrollableButton
                  key={cbv}
                  onClick={() => {
                    setShowCreateCondition(false);
                    const _id = generateMongoObjectId();
                    createConditionVariation.mutate({
                      _id,
                      type: cbv,
                    });

                    const amount = getAmountOfConditionBlockVariations({ conditionBlockId, plotfieldCommandId });

                    if (amount > 0) {
                      addNewLogicalOperator({ conditionBlockId, logicalOperator: "&&", plotfieldCommandId });
                      addLogicalOperator.mutate({ logicalOperator: "&&" });
                    }

                    addConditionBlockVariation({
                      conditionBlockId,
                      plotfieldCommandId,
                      conditionBlockVariation: {
                        conditionBlockVariationId: _id,
                        type: cbv,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
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
          <div className="flex flex-col gap-[.5rem] bg-primary-darker p-[.5rem] rounded-md">
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
              className="py-[1rem]"
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
