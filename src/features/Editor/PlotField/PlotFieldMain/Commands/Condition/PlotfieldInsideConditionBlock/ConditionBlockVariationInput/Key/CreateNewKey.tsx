import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useUpdateConditionKey from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionKey";
import useCreateNewKeyAsValue from "../../../../../../hooks/Key/useCreateNewKeyAsValue";
import { generateMongoObjectId } from "../../../../../../../../../utils/generateMongoObjectId";
import AsideInformativeOrSuggestion from "../../../../../../../../../ui/Aside/AsideInformativeOrSuggestion/AsideInformativeOrSuggestion";
import InformativeOrSuggestionText from "../../../../../../../../../ui/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionText";
import InformativeOrSuggestionButton from "../../../../../../../../../ui/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionButton";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";

type CreateNewValueModalTypes = {
  showCreateNewValueModal: boolean;
  conditionName: string;
  conditionBlockKeyId: string;
  setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueOnExisting: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateNewValueModal({
  setHighlightRedOnValueOnExisting,
  setShowCreateNewValueModal,
  showCreateNewValueModal,
  conditionName,
  conditionBlockKeyId,
}: CreateNewValueModalTypes) {
  const { storyId } = useParams();
  const focusOnBtnRef = useRef<HTMLButtonElement>(null);
  const createNewKeyModalRef = useRef<HTMLDivElement>(null);

  const updateConditionBlock = useUpdateConditionKey({
    conditionBlockKeyId,
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
    createNewKey.mutate({ keyName: conditionName, keyId });
    updateConditionBlock.mutate({
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
