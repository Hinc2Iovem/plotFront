import { useParams } from "react-router-dom";
import useGetTranslationAppearancePartsByStoryId from "../../../../../../../../../hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearancePartsByStoryId";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useUpdateIfAppearance from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfAppearance";
import useIfVariations from "../../../Context/IfContext";

export type ExposedMethodsIfAppearancePart = {
  updateAppearanceOnBlur: () => void;
};

type AppearancePartPromptsModalTypes = {
  showAppearancePartPromptModal: boolean;
  currentAppearancePartName: string;
  backUpName: string;
  ifVariationId: string;
  plotfieldCommandId: string;
  setBackUpName: React.Dispatch<React.SetStateAction<string>>;
  setShowAppearancePartPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentAppearancePartName: React.Dispatch<React.SetStateAction<string>>;
  setAppearancePartId: React.Dispatch<React.SetStateAction<string>>;
};

const IfVariationAppearancePromptsModal = forwardRef<ExposedMethodsIfAppearancePart, AppearancePartPromptsModalTypes>(
  (
    {
      showAppearancePartPromptModal,
      currentAppearancePartName,
      backUpName,
      ifVariationId,
      plotfieldCommandId,
      setBackUpName,
      setCurrentAppearancePartName,
      setShowAppearancePartPromptModal,
      setAppearancePartId,
    },
    ref
  ) => {
    const { storyId, episodeId } = useParams();
    const { updateValue } = useSearch();
    const { updateIfVariationValue } = useIfVariations();
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
      updateAppearanceOnBlur,
    }));

    const updateAppearanceOnBlur = () => {
      if (currentAppearancePartName?.trim().length) {
        const existingPart = memoizedAppearanceParts?.find((p) =>
          p?.translations?.find((pt) => pt.text?.toLowerCase() === currentAppearancePartName.toLowerCase())
        );
        if (existingPart) {
          setCurrentAppearancePartName((existingPart.translations || [])[0]?.text);
        } else {
          setShowAppearancePartPromptModal(false);
          setCurrentAppearancePartName(backUpName);
          // TODO did I added this everywhere?
          if (episodeId) {
            updateValue({
              episodeId,
              commandName: "If - Appearance",
              id: ifVariationId,
              type: "ifVariation",
              value: backUpName,
            });
          }
        }
      }
    };

    const updateIf = useUpdateIfAppearance({
      ifAppearanceId: ifVariationId,
    });

    const handleButtonClick = (appearanceName: string, appearanceId: string) => {
      setShowAppearancePartPromptModal(false);
      setBackUpName(appearanceName);
      setCurrentAppearancePartName(appearanceName);
      setAppearancePartId(appearanceId);

      // TODO did I added this everywhere? too
      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "If - Appearance",
          id: ifVariationId,
          type: "ifVariation",
          value: appearanceName,
        });
      }

      updateIfVariationValue({
        plotfieldCommandId,
        ifVariationId,
        appearancePartId: appearanceId,
      });

      updateIf.mutate({
        appearancePartId: appearanceId,
      });
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
                handleButtonClick((mp.translations || [])[0]?.text, mp._id);
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

IfVariationAppearancePromptsModal.displayName = "IfVariationAppearancePromptsModal";

export default IfVariationAppearancePromptsModal;
