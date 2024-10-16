import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import useUpdateConditionValue from "../../../hooks/Condition/ConditionValue/useUpdateConditionValue";
import useConditionBlocks from "../../Context/ConditionContext";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useGetTranslationAppearancePartsByStoryId from "../../../../../../../../hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearancePartsByStoryId";
import useCreateAppearancePartOptimistic from "../../../../../../../../hooks/Posting/AppearancePart/useCreateAppearancePartOptimistic";

type ConditionBlockVariationAppearanceTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  conditionName: string;
};

export default function ConditionBlockVariationAppearance({
  plotfieldCommandId,
  conditionBlockId,
  conditionName,
}: ConditionBlockVariationAppearanceTypes) {
  const { storyId } = useParams();
  const [showAppearancePromptModal, setShowAppearancePromptModal] =
    useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] =
    useState(false);
  const theme = localStorage.getItem("theme");
  const {
    getCurrentlyOpenConditionBlock,
    updateConditionBlockName,
    updateConditionBlockValueId,
  } = useConditionBlocks();
  const [currentConditionName, setCurrentConditionName] = useState(
    getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.conditionName || ""
  );

  const modalRef = useRef<HTMLDivElement>(null);

  const { data: appearances } = useGetTranslationAppearancePartsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  const memoizedAppearances = useMemo(() => {
    const allAppearances =
      appearances?.flatMap((k) =>
        k.translations.map((kt) => kt.text?.toLowerCase())
      ) || [];

    if (currentConditionName) {
      return allAppearances.filter((k) =>
        k?.includes(currentConditionName.toLowerCase())
      );
    }

    return allAppearances;
  }, [currentConditionName, appearances]);

  const debouncedValue = useDebounce({
    delay: 700,
    value:
      getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.conditionName ||
      "",
  });

  const handleUpdatingConditionContextValue = ({
    appearanceId,
  }: {
    appearanceId: string;
  }) => {
    updateConditionBlockValueId({
      blockValueId: appearanceId,
      conditionBlockId,
      conditionType: "appearance",
      plotfieldCommandId,
    });
  };

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  const handleCheckValueCorrectnessBeforeUpdating = ({
    onClick,
  }: {
    onClick: boolean;
  }) => {
    const existingAppearance = appearances?.find((mk) =>
      mk.translations.find(
        (mkt) =>
          mkt.text?.trim()?.toLowerCase() ===
          currentConditionName?.trim().toLowerCase()
      )
    );

    if (existingAppearance) {
      setShowAppearancePromptModal(false);
      setHighlightRedOnValueOnExisting(false);
      handleUpdatingConditionContextValue({
        appearanceId: existingAppearance._id,
      });
      updateConditionBlock.mutate({
        name: currentConditionName,
        blockValueId: existingAppearance._id,
      });
    } else {
      if (onClick) {
        setShowCreateNewValueModal(true);
        console.log("Show Modal to create appearance");
        return;
      } else {
        setHighlightRedOnValueOnExisting(true);
        console.log("Value doesn't exist");
        return;
      }
    }
  };

  useEffect(() => {
    if (
      debouncedValue?.trim().length &&
      conditionName?.trim() !== debouncedValue.trim()
    ) {
      handleCheckValueCorrectnessBeforeUpdating({ onClick: false });
    }
  }, [debouncedValue]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowAppearancePromptModal,
    showModal: showAppearancePromptModal,
  });

  return (
    <div className="w-[calc(100%-2.5rem)] relative">
      <input
        type="text"
        placeholder="Одежда"
        onClick={(e) => {
          e.stopPropagation();
          setShowAppearancePromptModal((prev) => !prev);
        }}
        value={
          getCurrentlyOpenConditionBlock({
            plotfieldCommandId,
          })?.conditionName || ""
        }
        onChange={(e) => {
          if (!showAppearancePromptModal) {
            setShowAppearancePromptModal(true);
          }
          setHighlightRedOnValueOnExisting(false);
          setCurrentConditionName(e.target.value);
          updateConditionBlockName({
            conditionBlockId:
              getCurrentlyOpenConditionBlock({
                plotfieldCommandId,
              })?.conditionBlockId || "",
            conditionName: e.target.value,
            plotfieldCommandId,
          });
        }}
        className={`${
          highlightRedOnValueNonExisting ? " border-red-300 border-[2px]" : ""
        } text-[1.5rem] ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-text-light bg-secondary focus-within:bg-primary-darker rounded-md shadow-sm px-[1rem] py-[.5rem] focus-within:shadow-inner transition-shadow`}
      />
      <aside
        ref={modalRef}
        className={`${
          showAppearancePromptModal ? "" : "hidden"
        } absolute rounded-md shadow-sm p-[1rem] bg-secondary flex flex-col gap-[.5rem] w-full max-h-[20rem] z-[2] overflow-y-auto | containerScroll`}
      >
        {memoizedAppearances.map((mk, i) => (
          <button
            key={mk + "-" + i}
            onClick={() => {
              setShowAppearancePromptModal(false);
              setCurrentConditionName(mk);
              handleCheckValueCorrectnessBeforeUpdating({ onClick: true });
              updateConditionBlockName({
                conditionBlockId:
                  getCurrentlyOpenConditionBlock({
                    plotfieldCommandId,
                  })?.conditionBlockId || "",
                conditionName: mk,
                plotfieldCommandId,
              });
            }}
            className={`capitalize text-[1.5rem] ${
              theme === "light" ? "outline-gray-300" : "outline-gray-600"
            } text-text-dark hover:text-text-light focus-within:text-text-light focus-within:bg-primary-darker bg-secondary px-[1rem] py-[.5rem] rounded-md hover:bg-primary transition-all focus-within:border-[2px] focus-within:border-white`}
          >
            {mk}
          </button>
        ))}
      </aside>

      <CreateNewValueModal
        conditionName={currentConditionName}
        conditionBlockId={conditionBlockId}
        setHighlightRedOnValueOnExisting={setHighlightRedOnValueOnExisting}
        setShowCreateNewValueModal={setShowCreateNewValueModal}
        showCreateNewValueModal={showCreateNewValueModal}
      />
    </div>
  );
}

type CreateNewValueModalTypes = {
  showCreateNewValueModal: boolean;
  conditionName: string;
  conditionBlockId: string;
  setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueOnExisting: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

function CreateNewValueModal({
  setHighlightRedOnValueOnExisting,
  setShowCreateNewValueModal,
  showCreateNewValueModal,
  conditionName,
  conditionBlockId,
}: CreateNewValueModalTypes) {
  const { storyId } = useParams();
  const focusOnBtnRef = useRef<HTMLButtonElement>(null);
  const createNewAppearanceModalRef = useRef<HTMLDivElement>(null);
  const theme = localStorage.getItem("theme");
  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  useEffect(() => {
    if (focusOnBtnRef) {
      focusOnBtnRef.current?.focus();
    }
  }, []);

  const createNewAppearance = useCreateAppearancePartOptimistic({
    storyId: storyId || "",
    appearancePartName: conditionName,
  });

  const handleCreatingNewAppearance = () => {
    setShowCreateNewValueModal(false);
    setHighlightRedOnValueOnExisting(false);
    const appearanceId = generateMongoObjectId();
    createNewAppearance.mutate({ appearancePartId: appearanceId });
    updateConditionBlock.mutate({
      name: conditionName,
      blockValueId: appearanceId,
    });
  };

  useOutOfModal({
    modalRef: createNewAppearanceModalRef,
    setShowModal: setShowCreateNewValueModal,
    showModal: showCreateNewValueModal,
  });

  return (
    <aside
      ref={createNewAppearanceModalRef}
      className={`${
        showCreateNewValueModal ? "" : "hidden"
      } absolute rounded-md shadow-sm p-[1rem] bg-secondary flex flex-col gap-[.5rem] w-full`}
    >
      <p className="text-[1.5rem] text-text-light">
        Такого ключа не существует, хотите создать?
      </p>
      <button
        ref={focusOnBtnRef}
        onClick={handleCreatingNewAppearance}
        className={`self-end text-[1.6rem] w-fit rounded-md bg-secondary shadow-sm ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } focus-within:border-black focus-within:border-[2px] focus-within:text-black`}
      >
        Создать
      </button>
    </aside>
  );
}
