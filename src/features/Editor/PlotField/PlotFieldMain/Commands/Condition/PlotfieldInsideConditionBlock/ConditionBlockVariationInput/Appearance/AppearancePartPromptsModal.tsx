import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationAppearancePartsByStoryId from "../../../../../../../../../hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearancePartsByStoryId";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import useUpdateConditionAppearance from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionAppearance";
import useConditionBlocks from "../../../Context/ConditionContext";

export type ExposedMethodsAppearance = {
  updateAppearancePartOnBlur: () => void;
};

type AppearancePartPromptsModalTypes = {
  showAppearancePartPromptModal: boolean;
  currentAppearancePartName: string;
  initialValue: string;
  appearancePartId: string;
  conditionBlockVariationId: string;
  conditionBlockId: string;
  plotfieldCommandId: string;
  setShowAppearancePartPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentAppearancePartName: React.Dispatch<React.SetStateAction<string>>;
  setAppearancePartId: React.Dispatch<React.SetStateAction<string>>;
  setInitialValue: React.Dispatch<React.SetStateAction<string>>;
};

const AppearancePartPromptsModal = forwardRef<ExposedMethodsAppearance, AppearancePartPromptsModalTypes>(
  (
    {
      showAppearancePartPromptModal,
      currentAppearancePartName,
      initialValue,
      appearancePartId,
      conditionBlockVariationId,
      conditionBlockId,
      plotfieldCommandId,
      setCurrentAppearancePartName,
      setShowAppearancePartPromptModal,
      setAppearancePartId,
      setInitialValue,
    },
    ref
  ) => {
    const { storyId } = useParams();
    const { data: appearanceParts } = useGetTranslationAppearancePartsByStoryId({
      storyId: storyId || "",
    });

    const memoizedAppearanceParts = useMemo(() => {
      if (!appearanceParts) return [];

      if (currentAppearancePartName) {
        return appearanceParts?.filter((p) =>
          p?.translations?.filter((pt) => pt.text?.toLowerCase().includes(currentAppearancePartName?.toLowerCase()))
        );
      }
      return appearanceParts;
    }, [currentAppearancePartName, appearanceParts]);

    const modalRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      updateAppearancePartOnBlur,
    }));

    const updateConditionBlock = useUpdateConditionAppearance({
      conditionBlockAppearanceId: conditionBlockVariationId,
    });

    const { updateConditionBlockVariationValue } = useConditionBlocks();

    const updateAppearancePartOnBlur = () => {
      const existingPart = memoizedAppearanceParts?.find((p) =>
        p?.translations?.find((pt) => pt.text?.toLowerCase() === currentAppearancePartName.toLowerCase())
      );
      if (existingPart) {
        setInitialValue((existingPart.translations || [])[0]?.text || "");
        handleUpdatingValues({
          id: existingPart?.appearancePartId || "",
          name: (existingPart.translations || [])[0]?.text || "",
        });
      } else {
        handleUpdatingValues({
          id: appearancePartId,
          name: initialValue,
        });
      }
    };

    const handleUpdatingValues = ({ id, name }: { id: string; name: string }) => {
      if (appearancePartId !== id) {
        updateConditionBlock.mutate({
          appearancePartId,
        });
        updateConditionBlockVariationValue({
          conditionBlockId,
          plotfieldCommandId,
          conditionBlockVariationId,
          appearancePartId,
        });
      }
      setAppearancePartId(id);
      setCurrentAppearancePartName(name);
      setShowAppearancePartPromptModal(false);
    };

    useOutOfModal({
      modalRef,
      setShowModal: setShowAppearancePartPromptModal,
      showModal: showAppearancePartPromptModal,
    });

    return (
      <AsideScrollable
        ref={modalRef}
        className={`${showAppearancePartPromptModal ? "" : "hidden"} translate-y-[.5rem]`}
      >
        {memoizedAppearanceParts?.length ? (
          memoizedAppearanceParts.map((mp) => (
            <AsideScrollableButton
              key={mp._id}
              onClick={() => {
                setInitialValue((mp.translations || [])[0]?.text || "");
                handleUpdatingValues({ id: mp.appearancePartId, name: (mp.translations || [])[0]?.text });
              }}
            >
              {(mp.translations || [])[0]?.text}
            </AsideScrollableButton>
          ))
        ) : (
          <AsideScrollableButton
            onClick={() => {
              setShowAppearancePartPromptModal(false);
            }}
          >
            Пусто
          </AsideScrollableButton>
        )}
      </AsideScrollable>
    );
  }
);

AppearancePartPromptsModal.displayName = "AppearancePartPromptsModal";

export default AppearancePartPromptsModal;
