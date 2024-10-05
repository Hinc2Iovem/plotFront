import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import {
  ChoiceVariations,
  ChoiceVariationsTypes,
} from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useGetChoiceOptionById from "../hooks/Choice/ChoiceOption/useGetChoiceOptionById";
import useUpdateChoice from "../hooks/Choice/useUpdateChoice";
import useGetAllTopologyBlocksByEpisodeId from "../hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import useGetTopologyBlockById from "../hooks/TopologyBlock/useGetTopologyBlockById";

type ChoiceVariationTypeBlockTypes = {
  exitBlockId: string;
  choiceId: string;
  timeLimit: number;
  choiceVariationTypes: ChoiceVariationsTypes;
  setExitBlockId: React.Dispatch<React.SetStateAction<string>>;
  setTimeLimit: React.Dispatch<React.SetStateAction<number>>;
  setChoiceVariationTypes: React.Dispatch<
    React.SetStateAction<ChoiceVariationsTypes>
  >;
  timeLimitDefaultOptionId: string;
  amountOfOptions: number;
};

export default function ChoiceVariationTypeBlock({
  exitBlockId,
  choiceId,
  setExitBlockId,
  timeLimit,
  setTimeLimit,
  choiceVariationTypes,
  setChoiceVariationTypes,
  amountOfOptions,
  timeLimitDefaultOptionId,
}: ChoiceVariationTypeBlockTypes) {
  const choiceVariationRef = useRef<HTMLDivElement>(null);

  const [showChoiceVariationTypesModal, setShowChoiceVariationTypesModal] =
    useState(false);
  const [showChoiceMultipleModal, setShowChoiceMultipleModal] = useState(false);
  const [
    showChoiceDefaultTimeLimitBlockModal,
    setShowChoiceDefaultTimeLimitBlockModal,
  ] = useState(false);

  const updateChoice = useUpdateChoice({ choiceId });

  useOutOfModal({
    modalRef: choiceVariationRef,
    setShowModal: setShowChoiceVariationTypesModal,
    showModal: showChoiceVariationTypesModal,
  });

  return (
    <>
      <div className="relative flex-grow z-[21]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowChoiceMultipleModal(false);
            setShowChoiceVariationTypesModal((prev) => !prev);
          }}
          className="w-full text-start outline-gray-300 whitespace-nowrap text-[1.3rem] bg-white rounded-md text-gray-700 shadow-md px-[1rem] py-[.5rem]"
        >
          {choiceVariationTypes ? choiceVariationTypes : "Тип Выбора"}
        </button>

        <aside
          ref={choiceVariationRef}
          className={`${
            showChoiceVariationTypesModal ? "" : "hidden"
          } translate-y-[.5rem] absolute flex flex-col gap-[1rem] bg-primary-light-blue rounded-md shadow-md z-[10] min-w-fit w-full p-[.5rem]`}
        >
          {ChoiceVariations.map((cv) => (
            <button
              key={cv}
              className={`${
                cv === choiceVariationTypes ? "hidden" : ""
              } w-full text-start outline-gray-300 text-[1.3rem] rounded-md shadow-md bg-white text-gray-700 px-[1rem] py-[.5rem]`}
              onClick={() => {
                setChoiceVariationTypes(cv);
                setShowChoiceVariationTypesModal(false);
                if (cv === "common") {
                  updateChoice.mutate({ choiceType: "common" });
                }
              }}
            >
              {cv}
            </button>
          ))}
        </aside>
      </div>

      <form
        className={`${
          choiceVariationTypes === "common" ||
          !choiceVariationTypes?.trim().length
            ? "hidden"
            : ""
        } flex-grow shadow-md bg-white rounded-md relative`}
        onSubmit={(e) => e.preventDefault()}
      >
        <ChoiceTimeLimitBlock
          choiceId={choiceId}
          choiceVariationTypes={choiceVariationTypes}
          setShowChoiceDefaultTimeLimitBlockModal={
            setShowChoiceDefaultTimeLimitBlockModal
          }
          setShowChoiceVariationTypesModal={setShowChoiceVariationTypesModal}
          showChoiceDefaultTimeLimitBlockModal={
            showChoiceDefaultTimeLimitBlockModal
          }
          setTimeLimit={setTimeLimit}
          timeLimit={timeLimit}
          amountOfOptions={amountOfOptions}
          timeLimitDefaultOptionId={timeLimitDefaultOptionId}
        />
        <ChoiceMultipleBlock
          choiceId={choiceId}
          choiceVariationTypes={choiceVariationTypes}
          exitBlockId={exitBlockId}
          setExitBlockId={setExitBlockId}
          setShowChoiceMultipleModal={setShowChoiceMultipleModal}
          setShowChoiceVariationTypesModal={setShowChoiceVariationTypesModal}
          showChoiceMultipleModal={showChoiceMultipleModal}
        />
      </form>
    </>
  );
}

type ChoiceTimeLimitBlockTypes = {
  choiceId: string;
  setShowChoiceDefaultTimeLimitBlockModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  showChoiceDefaultTimeLimitBlockModal: boolean;
  setShowChoiceVariationTypesModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  choiceVariationTypes: ChoiceVariationsTypes;
  timeLimit: number;
  setTimeLimit: React.Dispatch<React.SetStateAction<number>>;
  amountOfOptions: number;
  timeLimitDefaultOptionId: string;
};

function ChoiceTimeLimitBlock({
  choiceId,
  choiceVariationTypes,
  setShowChoiceDefaultTimeLimitBlockModal,
  setShowChoiceVariationTypesModal,
  showChoiceDefaultTimeLimitBlockModal,
  setTimeLimit,
  timeLimit,
  amountOfOptions,
  timeLimitDefaultOptionId,
}: ChoiceTimeLimitBlockTypes) {
  const modalRef = useRef<HTMLDivElement>(null);

  const updateChoice = useUpdateChoice({ choiceId });

  const { data: currentChoiceOption } = useGetChoiceOptionById({
    choiceOptionId: timeLimitDefaultOptionId,
  });

  const [currentChoiceOptionOrder, setCurrentChoiceOptionOrder] = useState<
    number | undefined
  >();

  useEffect(() => {
    if (currentChoiceOption) {
      setCurrentChoiceOptionOrder(currentChoiceOption.optionOrder);
    }
  }, [currentChoiceOption]);

  useEffect(() => {
    if (timeLimit) {
      updateChoice.mutate({
        choiceType: choiceVariationTypes || "timelimit",
        timeLimit,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLimit]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowChoiceDefaultTimeLimitBlockModal,
    showModal: showChoiceDefaultTimeLimitBlockModal,
  });
  return (
    <div
      className={`flex ${
        choiceVariationTypes === "timelimit" ? "" : "hidden"
      } px-[.2rem] py-[.2rem] gap-[.5rem] w-full flex-wrap`}
    >
      <input
        type="text"
        className={`w-[5rem] text-[1.4rem] border-[2px] border-gray-400 text-gray-700 border-dashed px-[1rem] py-[.5rem] rounded-md outline-gray-300`}
        value={timeLimit || ""}
        onChange={(e) => setTimeLimit(+e.target.value)}
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowChoiceVariationTypesModal(false);
          setShowChoiceDefaultTimeLimitBlockModal((prev) => !prev);
        }}
        className={`flex-grow text-[1.4rem] border-[2px] border-gray-400 text-gray-700 border-dashed px-[1rem] py-[.5rem] rounded-md outline-gray-300`}
      >
        {typeof currentChoiceOptionOrder === "number"
          ? currentChoiceOptionOrder
          : "Дефолтный Выбор"}
      </button>
      <aside
        ref={modalRef}
        className={`${
          showChoiceDefaultTimeLimitBlockModal ? "" : "hidden"
        } translate-y-[3.8rem] absolute z-10 flex flex-col gap-[1rem] bg-primary-light-blue rounded-md shadow-md w-full min-w-fit p-[.5rem]`}
      >
        {(currentChoiceOptionOrder && amountOfOptions > 1) ||
        (!currentChoiceOptionOrder && amountOfOptions > 0) ? (
          [...Array.from({ length: amountOfOptions })]?.map((_, i) => (
            <button
              key={i}
              className={`${
                i === currentChoiceOptionOrder ? "hidden" : ""
              } text-start outline-gray-300 whitespace-nowrap text-[1.3rem] rounded-md shadow-md bg-white text-gray-700 px-[1rem] py-[.5rem]`}
              onClick={() => {
                setShowChoiceVariationTypesModal(false);
                setShowChoiceDefaultTimeLimitBlockModal(false);
                setCurrentChoiceOptionOrder(i);
                updateChoice.mutate({
                  choiceType: choiceVariationTypes || "timelimit",
                  optionOrder: i,
                });
              }}
            >
              {i}
            </button>
          ))
        ) : (
          <button
            className={`text-start outline-gray-300 text-[1.3rem] rounded-md shadow-md bg-white text-gray-700 px-[1rem] py-[.5rem]`}
            onClick={() => {
              setShowChoiceVariationTypesModal(false);
              setShowChoiceDefaultTimeLimitBlockModal(false);
            }}
          >
            Пусто
          </button>
        )}
      </aside>
    </div>
  );
}

type ChoiceMultipleBlockTypes = {
  choiceId: string;
  exitBlockId: string;
  setShowChoiceMultipleModal: React.Dispatch<React.SetStateAction<boolean>>;
  showChoiceMultipleModal: boolean;
  setShowChoiceVariationTypesModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  choiceVariationTypes: ChoiceVariationsTypes;
  setExitBlockId: React.Dispatch<React.SetStateAction<string>>;
};

function ChoiceMultipleBlock({
  choiceId,
  exitBlockId,
  setShowChoiceMultipleModal,
  showChoiceMultipleModal,
  setShowChoiceVariationTypesModal,
  choiceVariationTypes,
  setExitBlockId,
}: ChoiceMultipleBlockTypes) {
  const { episodeId } = useParams();
  const choiceVariationMultipleRef = useRef<HTMLDivElement>(null);
  const { data: allTopologyBlocks } = useGetAllTopologyBlocksByEpisodeId({
    episodeId: episodeId ?? "",
  });
  const { data: currentTopologyBlock } = useGetTopologyBlockById({
    topologyBlockId: exitBlockId,
  });
  const [currentTopologyBlockName, setCurrentTopologyBlockName] = useState("");

  useEffect(() => {
    if (currentTopologyBlock) {
      setCurrentTopologyBlockName(currentTopologyBlock.name || "");
    }
  }, [currentTopologyBlock]);

  const updateChoice = useUpdateChoice({ choiceId });

  useOutOfModal({
    modalRef: choiceVariationMultipleRef,
    setShowModal: setShowChoiceMultipleModal,
    showModal: showChoiceMultipleModal,
  });

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowChoiceVariationTypesModal(false);
          setShowChoiceMultipleModal((prev) => !prev);
        }}
        className={`${
          choiceVariationTypes === "multiple" ? "" : "hidden"
        } text-start w-full text-[1.3rem] px-[1rem] py-[.5rem] rounded-md outline-gray-300`}
      >
        {currentTopologyBlockName?.trim().length
          ? currentTopologyBlockName
          : "Повторная Ветка"}
      </button>
      <aside
        ref={choiceVariationMultipleRef}
        className={`${
          showChoiceMultipleModal ? "" : "hidden"
        } translate-y-[.5rem] absolute z-10 flex flex-col gap-[1rem] bg-primary-light-blue rounded-md shadow-md w-full min-w-fit p-[.5rem]`}
      >
        {(exitBlockId && (allTopologyBlocks?.length || 0) > 1) ||
        (!exitBlockId && allTopologyBlocks?.length) ? (
          allTopologyBlocks?.map((atb) => (
            <button
              key={atb._id}
              className={`${
                atb._id === exitBlockId ? "hidden" : ""
              } text-start outline-gray-300 whitespace-nowrap text-[1.3rem] rounded-md shadow-md bg-white text-gray-700 px-[1rem] py-[.5rem]`}
              onClick={() => {
                setExitBlockId(atb._id);
                setShowChoiceVariationTypesModal(false);
                setShowChoiceMultipleModal(false);
                updateChoice.mutate({
                  choiceType: choiceVariationTypes || "multiple",
                  exitBlockId: atb._id,
                });
              }}
            >
              {atb.name}
            </button>
          ))
        ) : (
          <button
            className={`text-start outline-gray-300 text-[1.3rem] rounded-md shadow-md bg-white text-gray-700 px-[1rem] py-[.5rem]`}
            onClick={() => {
              setShowChoiceVariationTypesModal(false);
              setShowChoiceMultipleModal(false);
            }}
          >
            Пусто
          </button>
        )}
      </aside>
    </>
  );
}
