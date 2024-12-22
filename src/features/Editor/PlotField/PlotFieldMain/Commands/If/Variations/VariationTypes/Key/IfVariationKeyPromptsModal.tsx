import { useParams } from "react-router-dom";
import useIfVariations from "../../../Context/IfContext";
import useUpdateIfKey from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfKey";
import useGetAllKeysByStoryId from "../../../../../../hooks/Key/useGetAllKeysByStoryId";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import useSearch from "../../../../../../../Context/Search/SearchContext";

export type ExposedMethodsIfKey = {
  updateKeyValueOnBlur: () => void;
};

type KeyPromptsModalTypes = {
  showKeyPromptModal: boolean;
  setShowKeyPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentKeyName: React.Dispatch<React.SetStateAction<string>>;
  setBackUpIfName: React.Dispatch<React.SetStateAction<string>>;
  currentKeyName: string;
  ifVariationId: string;
  plotfieldCommandId: string;
  backUpIfName: string;
  setCommandKeyId: React.Dispatch<React.SetStateAction<string>>;
};

const IfVariationKeyPromptsModal = forwardRef<ExposedMethodsIfKey, KeyPromptsModalTypes>(
  (
    {
      showKeyPromptModal,
      setCurrentKeyName,
      setBackUpIfName,
      currentKeyName,
      setShowKeyPromptModal,
      setCommandKeyId,
      ifVariationId,
      plotfieldCommandId,
      backUpIfName,
    },
    ref
  ) => {
    const { storyId, episodeId } = useParams();
    const { updateValue } = useSearch();
    const { updateIfVariationValue } = useIfVariations();

    const updateIf = useUpdateIfKey({
      ifKeyId: ifVariationId || "",
    });
    const { data: keys } = useGetAllKeysByStoryId({ storyId: storyId || "" });

    const memoizedKeys = useMemo(() => {
      if (!keys) return [];

      if (currentKeyName) {
        return keys?.filter((k) => k?.text?.toLowerCase().includes(currentKeyName?.toLowerCase()));
      }
      return keys;
    }, [currentKeyName, keys]);

    const modalRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      updateKeyValueOnBlur,
    }));

    const updateKeyValueOnBlur = () => {
      // handle scenarios when user didn't clicked on the button and decided to just write key himself
      if (currentKeyName?.trim().length && !showKeyPromptModal) {
        const existingKey = memoizedKeys?.find((k) => k.text?.toLowerCase() === currentKeyName?.toLowerCase());
        if (existingKey) {
          handleButtonClick({ keyId: existingKey._id, text: existingKey.text });
        } else {
          setCurrentKeyName(backUpIfName);
          setShowKeyPromptModal(false);
          if (episodeId) {
            updateValue({
              episodeId,
              commandName: "If - Key",
              id: ifVariationId,
              type: "ifVariation",
              value: backUpIfName,
            });
          }
        }
      }
    };

    const handleButtonClick = ({ keyId, text }: { keyId: string; text: string }) => {
      setShowKeyPromptModal(false);

      updateIfVariationValue({
        commandKeyId: keyId,
        plotfieldCommandId,
        ifVariationId,
      });

      setCurrentKeyName(text);
      setBackUpIfName(text);
      setCommandKeyId(keyId);

      updateIf.mutate({
        keyId: keyId,
      });
    };

    useOutOfModal({
      modalRef,
      setShowModal: setShowKeyPromptModal,
      showModal: showKeyPromptModal,
    });

    return (
      <AsideScrollable ref={modalRef} className={`${showKeyPromptModal ? "" : "hidden"} translate-y-[.5rem]`}>
        {memoizedKeys?.length ? (
          memoizedKeys.map((mk) => (
            <AsideScrollableButton
              key={mk._id}
              onClick={() => {
                handleButtonClick({ keyId: mk._id, text: mk.text });
              }}
            >
              {mk.text}
            </AsideScrollableButton>
          ))
        ) : (
          <AsideScrollableButton
            onClick={() => {
              setShowKeyPromptModal(false);
            }}
          >
            Пусто
          </AsideScrollableButton>
        )}
      </AsideScrollable>
    );
  }
);

IfVariationKeyPromptsModal.displayName = "IfVariationKeyPromptsModal";

export default IfVariationKeyPromptsModal;
