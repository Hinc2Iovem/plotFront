import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useUpdateIfKey from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfKey";
import useCreateNewKeyAsValue from "../../../../../../hooks/Key/useCreateNewKeyAsValue";
import { generateMongoObjectId } from "../../../../../../../../../utils/generateMongoObjectId";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import AsideInformativeOrSuggestion from "../../../../../../../../../ui/Aside/AsideInformativeOrSuggestion/AsideInformativeOrSuggestion";
import InformativeOrSuggestionText from "../../../../../../../../../ui/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionText";
import InformativeOrSuggestionButton from "../../../../../../../../../ui/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionButton";

type CreateNewValueModalTypes = {
  showCreateNewValueModal: boolean;
  ifName: string;
  ifKeyId: string;
  setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueOnExisting: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function IfVariationNewKeyModal({
  setHighlightRedOnValueOnExisting,
  setShowCreateNewValueModal,
  showCreateNewValueModal,
  ifName,
  ifKeyId,
}: CreateNewValueModalTypes) {
  const { storyId } = useParams();
  const focusOnBtnRef = useRef<HTMLButtonElement>(null);
  const createNewKeyModalRef = useRef<HTMLDivElement>(null);

  const updateIf = useUpdateIfKey({
    ifKeyId,
  });

  useEffect(() => {
    if (focusOnBtnRef) {
      focusOnBtnRef.current?.focus();
    }
  }, []);
  const createNewKey = useCreateNewKeyAsValue({ storyId: storyId || "" });

  const handleCreatingNewKey = () => {
    setShowCreateNewValueModal(false);
    setHighlightRedOnValueOnExisting(false);
    const keyId = generateMongoObjectId();
    createNewKey.mutate({ keyName: ifName, keyId });
    updateIf.mutate({
      keyId,
    });
  };

  useOutOfModal({
    modalRef: createNewKeyModalRef,
    setShowModal: setShowCreateNewValueModal,
    showModal: showCreateNewValueModal,
  });

  return (
    <AsideInformativeOrSuggestion ref={createNewKeyModalRef} className={`${showCreateNewValueModal ? "" : "hidden"}`}>
      <InformativeOrSuggestionText>Такого ключа не существует, хотите создать?</InformativeOrSuggestionText>
      <InformativeOrSuggestionButton ref={focusOnBtnRef} onClick={handleCreatingNewKey}>
        Создать
      </InformativeOrSuggestionButton>
    </AsideInformativeOrSuggestion>
  );
}
