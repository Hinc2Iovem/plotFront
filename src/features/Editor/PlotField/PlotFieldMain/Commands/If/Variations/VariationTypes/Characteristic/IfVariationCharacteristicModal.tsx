import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import useIfVariations from "../../../Context/IfContext";
import useGetAllCharacteristicsByStoryId from "../../../../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import useUpdateIfCharacteristic from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfCharacteristic";
import { isNumeric } from "../../../../../../../../../utils/regExpIsNumeric";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";

export type ExposedMethodsIfCharacteristic = {
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
  characteristicId: string;
  backUpCharacteristic: string;
  ifVariationId: string;
  fieldType: "ifName" | "ifValue";
};

const IfVariationCharacteristicModal = forwardRef<ExposedMethodsIfCharacteristic, CharacteristicsPromptModalTypes>(
  (
    {
      setShowCharacteristicPromptModal,
      setCurrentCharacteristic,
      setBackUpCharacteristic,
      setCharacteristicId,
      currentCharacteristic,
      showCharacteristicPromptModal,
      plotfieldCommandId,
      ifVariationId,
      fieldType,
      backUpCharacteristic,
      characteristicId,
    },
    ref
  ) => {
    const { storyId } = useParams();

    const { updateIfVariationValue } = useIfVariations();

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

    const updateIf = useUpdateIfCharacteristic({
      ifCharacteristicId: ifVariationId,
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
          console.log("Such characteristic doesn't exist");
          if (
            !showCharacteristicPromptModal &&
            characteristicId?.trim().length &&
            backUpCharacteristic?.trim().length &&
            !isNumeric(currentCharacteristic)
          ) {
            setShowCharacteristicPromptModal(false);
            setCurrentCharacteristic(backUpCharacteristic);
          }
          return;
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

      updateIfVariationValue({
        plotfieldCommandId,
        ifVariationId,
        characteristicId,
      });

      updateIf.mutate({
        characteristicId: fieldType === "ifName" ? characteristicId : null,
        secondCharacteristicId: fieldType === "ifValue" ? characteristicId : null,
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

IfVariationCharacteristicModal.displayName = "IfVariationCharacteristicModal";

export default IfVariationCharacteristicModal;
