import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import { DebouncedCheckCharacterTypes } from "../../../Choice/ChoiceQuestionField";
import useUpdateConditionValue from "../../../hooks/Condition/ConditionValue/useUpdateConditionValue";
import PlotfieldCharacterPromptMain from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import useConditionBlocks from "../../Context/ConditionContext";
import ConditionSignField from "./ConditionSignField";

type ConditionBlockVariationCharacterTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
};

export default function ConditionBlockVariationCharacter({
  plotfieldCommandId,
  conditionBlockId,
}: ConditionBlockVariationCharacterTypes) {
  const [showCharacterPromptModal, setShowCharacterPromptModal] =
    useState(false);
  const {
    getConditionBlockById,
    updateConditionBlockName,
    updateConditionBlockValueId,
    conditions,
  } = useConditionBlocks();
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] =
    useState(false);
  const [currentConditionName, setCurrentConditionName] = useState(
    getConditionBlockById({ conditionBlockId, plotfieldCommandId })
      ?.conditionName || ""
  );

  useEffect(() => {
    const conditionBlock = getConditionBlockById({
      conditionBlockId,
      plotfieldCommandId,
    });
    if (conditionBlock?.conditionName !== currentConditionName) {
      setCurrentConditionName(conditionBlock?.conditionName || "");
    }
  }, [conditions, conditionBlockId, plotfieldCommandId]);

  const [characterImg, setCharacterImg] = useState("");
  const [debouncedCharacter, setDebouncedCharacter] =
    useState<DebouncedCheckCharacterTypes | null>(null);
  const [characterId, setCharacterId] = useState("");
  console.log(characterId);

  // const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  const debouncedConditionName = useDebounce({
    delay: 700,
    value: currentConditionName,
  });

  useEffect(() => {
    if (debouncedCharacter) {
      updateConditionBlockName({
        conditionBlockId:
          getConditionBlockById({
            conditionBlockId,
            plotfieldCommandId,
          })?.conditionBlockId || "",
        conditionName: debouncedCharacter.characterName,
        plotfieldCommandId,
      });

      updateConditionBlockValueId({
        blockValueId: debouncedCharacter.characterId,
        conditionBlockId,
        conditionType: "character",
        plotfieldCommandId,
      });

      setCurrentConditionName(debouncedCharacter.characterName);
      setCharacterImg(debouncedCharacter?.characterImg || "");
      setCharacterId(debouncedCharacter.characterId);

      updateConditionBlock.mutate({
        name: debouncedCharacter.characterName,
        blockValueId: debouncedCharacter.characterId,
      });
    } else {
      console.error("Such character doesn't exist");
    }
  }, [debouncedCharacter]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacterPromptModal,
    showModal: showCharacterPromptModal,
  });

  return (
    <div className="w-full flex gap-[1rem] flex-col mt-[1.5rem]">
      <div className="w-full flex gap-[1rem] flex-shrink flex-wrap">
        <div className="w-full min-w-[10rem] relative">
          <PlotfieldInput
            type="text"
            placeholder="Персонаж"
            onClick={(e) => {
              setShowCharacterPromptModal((prev) => !prev);
              e.stopPropagation();
            }}
            value={currentConditionName}
            onChange={(e) => {
              if (!showCharacterPromptModal) {
                setShowCharacterPromptModal(true);
              }
              setHighlightRedOnValueOnExisting(false);
              setCurrentConditionName(e.target.value);
            }}
            className={`${highlightRedOnValueNonExisting ? " " : ""}`}
          />
          {characterImg ? (
            <img
              src={characterImg}
              alt="CharacterImg"
              className="w-[3rem] absolute right-0 rounded-md top-0"
            />
          ) : null}
          <PlotfieldCharacterPromptMain
            characterValue={currentConditionName}
            setCharacterId={setCharacterId}
            setCharacterName={setCurrentConditionName}
            setShowCharacterModal={setShowCharacterPromptModal}
            showCharacterModal={showCharacterPromptModal}
            translateAsideValue="translate-y-[.5rem]"
            debouncedValue={debouncedConditionName}
            setCharacterImg={setCharacterImg}
            setDebouncedCharacter={setDebouncedCharacter}
          />
          {/* <AsideScrollable
            ref={modalRef}
            className={` ${
              showCharacterPromptModal ? "" : "hidden"
            } translate-y-[.5rem]`}
          >
            {(memoizedCharacters || [])?.map((mk, i) => (
              <AsideScrollableButton
                key={mk + "-" + i}
                onClick={() => {
                  setShowCharacterPromptModal(false);
                  setCurrentConditionName(mk || "");
                  updateConditionBlockName({
                    conditionBlockId:
                      getConditionBlockById({
                        conditionBlockId,
                        plotfieldCommandId,
                      })?.conditionBlockId || "",
                    conditionName: mk || "",
                    plotfieldCommandId,
                  });
                }}
              >
                {mk}
              </AsideScrollableButton>
            ))}
          </AsideScrollable> */}
          {/* <CreateNewCharacterModal
            setShowCreateNewValueModal={setShowCreateNewValueModal}
            showCreateNewValueModal={showCreateNewValueModal}
            conditionName={currentConditionName}
            conditionBlockId={conditionBlockId}
            setHighlightRedOnValueOnExisting={setHighlightRedOnValueOnExisting}
          /> */}
        </div>

        <ConditionSignField
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
        />

        <ConditionValueField
          plotfieldCommandId={plotfieldCommandId}
          conditionBlockId={conditionBlockId}
          setShowCharacterPromptModal={setShowCharacterPromptModal}
          showCharacterPromptModal={showCharacterPromptModal}
        />
      </div>
    </div>
  );
}

// type CreateNewCharacterModalTypes = {
//   setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
//   setHighlightRedOnValueOnExisting: React.Dispatch<
//     React.SetStateAction<boolean>
//   >;
//   showCreateNewValueModal: boolean;
//   conditionName: string;
//   conditionBlockId: string;
// };

// function CreateNewCharacterModal({
//   setHighlightRedOnValueOnExisting,
//   setShowCreateNewValueModal,
//   showCreateNewValueModal,
//   conditionName,
//   conditionBlockId,
// }: CreateNewCharacterModalTypes) {
//   const { storyId } = useParams();
//   const focusOnBtnRef = useRef<HTMLButtonElement>(null);
//   const createNewCharacterModalRef = useRef<HTMLDivElement>(null);

//   const createNewCharacter = useCreateCharacterBlank({
//     characterType: "minorcharacter",
//     name: conditionName,
//     storyId: storyId || "",
//     language: "russian",
//   });
//   const updateConditionBlock = useUpdateConditionValue({
//     conditionBlockId,
//   });
//   useEffect(() => {
//     if (focusOnBtnRef) {
//       focusOnBtnRef.current?.focus();
//     }
//   }, []);

//   const handleCreatingNewCharacter = () => {
//     const characterId = generateMongoObjectId();
//     createNewCharacter.mutate({ characterId });

//     updateConditionBlock.mutate({
//       name: conditionName,
//       blockValueId: characterId,
//     });
//     setShowCreateNewValueModal(false);
//     setHighlightRedOnValueOnExisting(false);
//   };

//   useOutOfModal({
//     modalRef: createNewCharacterModalRef,
//     setShowModal: setShowCreateNewValueModal,
//     showModal: showCreateNewValueModal,
//   });

//   return (
//     <AsideInformativeOrSuggestion
//       ref={createNewCharacterModalRef}
//       className={`${showCreateNewValueModal ? "" : "hidden"} `}
//     >
//       <InformativeOrSuggestionText>
//         Такого персонажа не существует, хотите создать?
//       </InformativeOrSuggestionText>
//       <InformativeOrSuggestionButton
//         ref={focusOnBtnRef}
//         onClick={handleCreatingNewCharacter}
//       >
//         Создать
//       </InformativeOrSuggestionButton>
//     </AsideInformativeOrSuggestion>
//   );
// }

type ConditionValueFieldTypes = {
  plotfieldCommandId: string;
  setShowCharacterPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCharacterPromptModal: boolean;
  conditionBlockId: string;
};

function ConditionValueField({
  plotfieldCommandId,
  showCharacterPromptModal,
  conditionBlockId,
  setShowCharacterPromptModal,
}: ConditionValueFieldTypes) {
  const { getConditionBlockById, updateConditionBlockValue } =
    useConditionBlocks();

  const [currentConditionValue, setCurrentConditionValue] = useState(
    getConditionBlockById({ conditionBlockId, plotfieldCommandId })
      ?.conditionValue || ""
  );
  const debouncedConditionValue = useDebounce({
    delay: 700,
    value:
      getConditionBlockById({ conditionBlockId, plotfieldCommandId })
        ?.conditionValue || "",
  });

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  useEffect(() => {
    if (
      debouncedConditionValue?.trim().length &&
      currentConditionValue?.trim() !== debouncedConditionValue.trim()
    ) {
      updateConditionBlock.mutate({ value: currentConditionValue });
    }
  }, [debouncedConditionValue]);

  return (
    <div className="min-w-[10rem] w-full">
      <PlotfieldInput
        type="text"
        placeholder="Значение"
        value={
          getConditionBlockById({ conditionBlockId, plotfieldCommandId })
            ?.conditionValue || ""
        }
        onChange={(e) => {
          if (showCharacterPromptModal) {
            setShowCharacterPromptModal(false);
          }
          setCurrentConditionValue(e.target.value);
          updateConditionBlockValue({
            conditionBlockId:
              getConditionBlockById({ conditionBlockId, plotfieldCommandId })
                ?.conditionBlockId || "",
            conditionValue: e.target.value,
            plotfieldCommandId,
          });
        }}
        className={`text-[1.5rem]`}
      />
    </div>
  );
}
