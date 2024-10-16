import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import useUpdateConditionValue from "../../../hooks/Condition/ConditionValue/useUpdateConditionValue";
import useGetAllKeysByStoryId from "../../../hooks/Key/useGetAllKeysByStoryId";
import useConditionBlocks from "../../Context/ConditionContext";
import useCreateNewKeyAsValue from "../../../hooks/Key/useCreateNewKeyAsValue";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";

type ConditionBlockVariationKeyTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  conditionName: string;
};

export default function ConditionBlockVariationKey({
  plotfieldCommandId,
  conditionBlockId,
  conditionName,
}: ConditionBlockVariationKeyTypes) {
  const { storyId } = useParams();
  const [showKeyPromptModal, setShowKeyPromptModal] = useState(false);
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

  const { data: keys } = useGetAllKeysByStoryId({ storyId: storyId || "" });

  const memoizedKeys = useMemo(() => {
    const allKeys = keys?.map((k) => k.text?.toLowerCase()) || [];
    if (currentConditionName) {
      return allKeys?.filter((k) =>
        k?.includes(currentConditionName.toLowerCase())
      );
    }
    return allKeys;
  }, [currentConditionName, keys]);

  const debouncedValue = useDebounce({
    delay: 700,
    value:
      getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.conditionName ||
      "",
  });

  const handleUpdatingConditionContextValue = ({
    keyId,
  }: {
    keyId: string;
  }) => {
    updateConditionBlockValueId({
      blockValueId: keyId,
      conditionBlockId,
      conditionType: "key",
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
    const existingKey = keys?.find(
      (mk) =>
        mk.text?.trim()?.toLowerCase() ===
        currentConditionName?.trim().toLowerCase()
    );

    if (existingKey) {
      setShowKeyPromptModal(false);
      setHighlightRedOnValueOnExisting(false);
      handleUpdatingConditionContextValue({
        keyId: existingKey._id,
      });
      updateConditionBlock.mutate({
        name: currentConditionName,
        blockValueId: existingKey._id,
      });
    } else {
      if (onClick) {
        setShowCreateNewValueModal(true);
        console.log("Show Modal to create key");
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
    setShowModal: setShowKeyPromptModal,
    showModal: showKeyPromptModal,
  });

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Ключ"
        onClick={(e) => {
          e.stopPropagation();
          setShowKeyPromptModal((prev) => !prev);
        }}
        value={
          getCurrentlyOpenConditionBlock({
            plotfieldCommandId,
          })?.conditionName || ""
        }
        onChange={(e) => {
          if (!showKeyPromptModal) {
            setShowKeyPromptModal(true);
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
          highlightRedOnValueNonExisting ? "border-red-300 border-[2px]" : ""
        } w-full text-[1.5rem] ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-text-light bg-secondary rounded-md shadow-sm px-[1rem] py-[.5rem] focus-within:shadow-inner transition-shadow`}
      />
      <aside
        ref={modalRef}
        className={`${
          showKeyPromptModal ? "" : "hidden"
        } absolute rounded-md shadow-sm p-[1rem] bg-secondary flex flex-col gap-[.5rem] w-full max-h-[20rem] overflow-y-auto | containerScroll`}
      >
        {memoizedKeys.map((mk, i) => (
          <button
            key={mk + "-" + i}
            onClick={() => {
              setShowKeyPromptModal(false);
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
            } text-text-dark hover:text-text-light bg-secondary px-[1rem] py-[.5rem] rounded-md hover:bg-primary  focus-within:bg-primary focus-within:text-text-dark transition-all focus-within:border-[2px] focus-within:border-white`}
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
  const createNewKeyModalRef = useRef<HTMLDivElement>(null);

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  useEffect(() => {
    if (focusOnBtnRef) {
      focusOnBtnRef.current?.focus();
    }
  }, []);
  const theme = localStorage.getItem("theme");
  const createNewKey = useCreateNewKeyAsValue({ storyId: storyId || "" });

  const handleCreatingNewKey = () => {
    setShowCreateNewValueModal(false);
    setHighlightRedOnValueOnExisting(false);
    const keyId = generateMongoObjectId();
    createNewKey.mutate({ keyName: conditionName, keyId });
    updateConditionBlock.mutate({
      name: conditionName,
      blockValueId: keyId,
    });
  };

  useOutOfModal({
    modalRef: createNewKeyModalRef,
    setShowModal: setShowCreateNewValueModal,
    showModal: showCreateNewValueModal,
  });

  return (
    <aside
      ref={createNewKeyModalRef}
      className={`${
        showCreateNewValueModal ? "" : "hidden"
      } absolute rounded-md shadow-sm p-[1rem] bg-secondary flex flex-col gap-[.5rem] w-full`}
    >
      <p className="text-[1.5rem] text-text-light">
        Такого ключа не существует, хотите создать?
      </p>
      <button
        ref={focusOnBtnRef}
        onClick={handleCreatingNewKey}
        className={`self-end text-[1.6rem] w-fit rounded-md bg-secondary shadow-sm ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } focus-within:border-black focus-within:border-[2px] focus-within:text-black`}
      >
        Создать
      </button>
    </aside>
  );
}
