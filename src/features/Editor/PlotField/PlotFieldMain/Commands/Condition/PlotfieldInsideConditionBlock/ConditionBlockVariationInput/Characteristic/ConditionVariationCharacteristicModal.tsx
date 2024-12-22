import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharacteristicsByStoryId from "../../../../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import useUpdateConditionCharacteristic from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacteristic";
import useConditionBlocks from "../../../Context/ConditionContext";

export type ExposedMethodsCharacteristic = {
  updateCharacteristicOnBlur: () => void;
};

type CharacteristicsPromptModalTypes = {
  setShowCharacteristicPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentCharacteristic: React.Dispatch<React.SetStateAction<string | number>>;
  setBackUpCharacteristic: React.Dispatch<React.SetStateAction<string | number>>;
  setCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  showCharacteristicPromptModal: boolean;
  currentCharacteristic: string | number;
  plotfieldCommandId: string;
  conditionBlockId: string;
  backUpCharacteristic: string;
  conditionBlockVariationId: string;
  fieldType: "conditionName" | "conditionValue";
};

const ConditionVariationCharacteristicModal = forwardRef<ExposedMethodsCharacteristic, CharacteristicsPromptModalTypes>(
  (
    {
      setShowCharacteristicPromptModal,
      setCurrentCharacteristic,
      setBackUpCharacteristic,
      setCharacteristicId,
      currentCharacteristic,
      showCharacteristicPromptModal,
      plotfieldCommandId,
      conditionBlockId,
      conditionBlockVariationId,
      fieldType,
      backUpCharacteristic,
    },
    ref
  ) => {
    const { storyId } = useParams();

    const { updateConditionBlockVariationValue } = useConditionBlocks();

    const modalRef = useRef<HTMLDivElement>(null);

    const { data: characteristics } = useGetAllCharacteristicsByStoryId({
      storyId: storyId || "",
      language: "russian",
    });

    const memoizedCharacteristics = useMemo(() => {
      if (!characteristics || typeof currentCharacteristic === "number") return [];
      if (currentCharacteristic?.trim().length) {
        return characteristics.filter((c) =>
          c.translations.filter(
            (ct) =>
              ct.textFieldName === "characterCharacteristic" &&
              ct.text?.toLowerCase().includes(currentCharacteristic?.toLowerCase())
          )
        );
      } else {
        return characteristics;
      }
    }, [currentCharacteristic, characteristics]);

    const updateConditionBlock = useUpdateConditionCharacteristic({
      conditionBlockCharacteristicId: conditionBlockVariationId,
    });

    useImperativeHandle(ref, () => ({
      updateCharacteristicOnBlur,
    }));

    const updateCharacteristicOnBlur = () => {
      if (typeof currentCharacteristic === "string") {
        const existingCharacteristic = memoizedCharacteristics.find((mc) =>
          mc.translations.find((mct) => mct.text?.toLowerCase() === currentCharacteristic?.toLowerCase())
        );
        if (existingCharacteristic) {
          handleSubmit({
            characteristicId: existingCharacteristic.characteristicId,
            currentCharacteristic:
              (existingCharacteristic.translations || []).find((t) => t.textFieldName === "characterCharacteristic")
                ?.text || "",
          });
        } else {
          setShowCharacteristicPromptModal(false);
          setCurrentCharacteristic(backUpCharacteristic);
        }
      }
    };

    const handleSubmit = ({
      characteristicId,
      currentCharacteristic,
    }: {
      currentCharacteristic: string;
      characteristicId: string;
    }) => {
      setShowCharacteristicPromptModal(false);
      setCurrentCharacteristic(currentCharacteristic);
      setBackUpCharacteristic(currentCharacteristic);
      setCharacteristicId(characteristicId);

      updateConditionBlockVariationValue({
        conditionBlockId,
        plotfieldCommandId,
        conditionBlockVariationId,
        characteristicId,
      });

      updateConditionBlock.mutate({
        characteristicId: fieldType === "conditionName" ? characteristicId : null,
        secondCharacteristicId: fieldType === "conditionValue" ? characteristicId : null,
      });
    };

    useOutOfModal({
      modalRef,
      setShowModal: setShowCharacteristicPromptModal,
      showModal: showCharacteristicPromptModal,
    });
    return (
      <AsideScrollable
        ref={modalRef}
        className={`${showCharacteristicPromptModal ? "" : "hidden"} translate-y-[.5rem]`}
      >
        {(memoizedCharacteristics || [])?.map((mk) => (
          <AsideScrollableButton
            key={mk.characteristicId}
            onClick={() =>
              handleSubmit({ currentCharacteristic: mk.translations[0]?.text, characteristicId: mk.characteristicId })
            }
          >
            {mk.translations[0]?.text}
          </AsideScrollableButton>
        ))}
      </AsideScrollable>
    );
  }
);

ConditionVariationCharacteristicModal.displayName = "ConditionVariationCharacteristicModal";

export default ConditionVariationCharacteristicModal;
