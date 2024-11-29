import { useEffect, useRef, useState } from "react";
import { CharacterTypes } from "../../../../../../types/StoryData/Character/CharacterTypes";
import { FinedCharacteristicTypes } from "./AllMightySearchMainContentCharacter";
import plus from "../../../../../../assets/images/shared/plus.png";
import { useParams } from "react-router-dom";
import useDeleteCharacteristic from "../../../../../../hooks/Deleting/Characteristic/useDeleteCharacteristic";
import useUpdateCharacteristicTranslation from "../../../../../../hooks/Patching/Translation/useUpdateCharacteristicTranslation";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import PlotfieldButton from "../../../../../shared/Buttons/PlotfieldButton";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import useCreateCharacteristicOptimistic from "../../../../../../hooks/Posting/Characteristic/useCreateCharacteristicOptimistic";

type CharacterCharacteristicsBlockTypes = {
  characterType: CharacterTypes;
  characteristics: FinedCharacteristicTypes[];
};

export function CharacterCharacteristicsBlock({ characterType, characteristics }: CharacterCharacteristicsBlockTypes) {
  const { storyId } = useParams();
  const [newCharacteristic, setNewCharacteristic] = useState<FinedCharacteristicTypes | null>(null);
  const [beginCreatingNewCharacteristic, setBeginCreatingNewCharacteristic] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const [deletedCharacteristicId, setDeletedCharacteristicId] = useState("");
  const [editingCharacteristicId, setEditingCharacteristicId] = useState("");
  const [showEditingCharacteristic, setShowEditingCharacteristic] = useState(false);

  const createCharacteristic = useCreateCharacteristicOptimistic({ language: "russian", storyId: storyId || "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharacteristic?.characteristicText?.trim().length) {
      console.log("Can not create an element with an empty value");
      return;
    }

    const _id = generateMongoObjectId();
    const characteristicId = generateMongoObjectId();

    setNewCharacteristic((prev) => {
      if (prev !== null) {
        return {
          _id,
          characteristicId,
          characteristicText: prev.characteristicText,
        };
      } else {
        return null;
      }
    });

    setBeginCreatingNewCharacteristic(false);

    characteristics.push(newCharacteristic);
    createCharacteristic.mutate({ characteristicId, characteristicNameBody: newCharacteristic.characteristicText });
  };

  useOutOfModal({
    modalRef,
    setShowModal: setBeginCreatingNewCharacteristic,
    showModal: beginCreatingNewCharacteristic,
  });
  return (
    <div
      className={` ${
        characterType === "maincharacter" ? "" : "hidden"
      } flex flex-col gap-[.5rem] bg-secondary pt-[.5rem] rounded-md px-[.5rem]`}
    >
      <div className="flex justify-between w-full items-center px-[.5rem]">
        <h3 className="text-text-light text-[1.7rem]">Характеристики</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setNewCharacteristic(null);
            setBeginCreatingNewCharacteristic(true);
          }}
          className="w-[3rem] hover:bg-primary rounded-md transition-all hover:scale-[1.05] active:scale-[1]"
        >
          <img src={plus} alt="+" className="w-full p-[.1rem]" />
        </button>
      </div>
      <div
        className={`${
          beginCreatingNewCharacteristic ? "hidden" : ""
        } w-full p-[.5rem] overflow-auto h-[10rem] rounded-md flex flex-col gap-[.5rem] | containerScroll`}
      >
        {characteristics.map((c) => (
          <CharacterCharacteristicBlockItem
            key={c._id}
            _id={c._id}
            deletedCharacteristicId={deletedCharacteristicId}
            editingCharacteristicId={editingCharacteristicId}
            characteristicId={c.characteristicId}
            setDeletedCharacteristicId={setDeletedCharacteristicId}
            setEditingCharacteristicId={setEditingCharacteristicId}
            setShowEditingModal={setShowEditingCharacteristic}
            showEditingModal={showEditingCharacteristic}
            characteristicName={c.characteristicText}
          />
        ))}
      </div>

      <div
        ref={modalRef}
        className={`${
          beginCreatingNewCharacteristic ? "" : "hidden"
        } w-full p-[.5rem] overflow-auto h-[10rem] rounded-md flex flex-col gap-[.5rem] | containerScroll`}
      >
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[1rem]">
          <PlotfieldInput
            className="border-[1px]"
            value={newCharacteristic?.characteristicText}
            placeholder="Характеристика"
            onChange={(e) =>
              setNewCharacteristic((prev) => {
                if (prev !== null) {
                  return {
                    _id: prev?._id || "",
                    characteristicId: prev?.characteristicId || "",
                    characteristicText: e.target.value,
                  };
                } else {
                  return {
                    _id: "",
                    characteristicId: "",
                    characteristicText: e.target.value,
                  };
                }
              })
            }
          />
          <div className="flex justify-between gap-[1rem]">
            <PlotfieldButton
              type="button"
              onClick={() => setBeginCreatingNewCharacteristic(false)}
              className="w-fit self-end bg-primary-darker hover:bg-primary hover:scale-[1.03] active:scale-[1]"
            >
              Назад
            </PlotfieldButton>
            <PlotfieldButton className="w-fit self-end bg-primary-darker hover:bg-primary hover:scale-[1.03] active:scale-[1]">
              Создать
            </PlotfieldButton>
          </div>
        </form>
      </div>
    </div>
  );
}

type CharacterCharacteristicBlockItemTypes = {
  _id: string;
  characteristicId: string;
  showEditingModal: boolean;
  characteristicName?: string;
  editingCharacteristicId: string;
  deletedCharacteristicId: string;
  setDeletedCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  setEditingCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  setShowEditingModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function CharacterCharacteristicBlockItem({
  characteristicName,
  characteristicId,
  showEditingModal,
  editingCharacteristicId,
  deletedCharacteristicId,
  setDeletedCharacteristicId,
  setEditingCharacteristicId,
  setShowEditingModal,
}: CharacterCharacteristicBlockItemTypes) {
  const { storyId } = useParams();
  const [showSuggestiveModal, setShowSuggestiveModal] = useState(false);
  const [currentCharacteristicName, setCurrentCharacteristicName] = useState(characteristicName);
  const [editingCharacteristicName, setEditingCharacteristicName] = useState(characteristicName);

  const deleteCharacteristic = useDeleteCharacteristic({
    characteristicId,
    currentLanguage: "russian",
    storyId: storyId || "",
  });
  const updateCharacteristic = useUpdateCharacteristicTranslation({
    characterCharacteristicId: characteristicId,
    language: "russian",
    storyId: storyId || "",
  });

  useEffect(() => {
    setEditingCharacteristicName(characteristicName);
  }, [showEditingModal, characteristicName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCharacteristicName?.trim().length) {
      console.log("Can not save nothing");
      return;
    }

    setCurrentCharacteristicName(editingCharacteristicName);

    setShowEditingModal(false);
    updateCharacteristic.mutate({
      characteristicName: editingCharacteristicName,
    });
  };

  const modalRef = useRef<HTMLDivElement>(null);
  useOutOfModal({ modalRef, setShowModal: setShowSuggestiveModal, showModal: showSuggestiveModal });

  return (
    <>
      <div
        className={`${deletedCharacteristicId === characteristicId ? "hidden" : ""} ${
          showEditingModal ? "hidden" : ""
        } w-full relative`}
      >
        <PlotfieldButton
          onContextMenu={(e) => {
            e.preventDefault();
            setShowSuggestiveModal((prev) => !prev);
          }}
          className="flex justify-between items-center bg-primary shadow-sm"
        >
          {currentCharacteristicName}
        </PlotfieldButton>

        <aside
          ref={modalRef}
          className={` absolute ${
            showSuggestiveModal ? "" : "hidden"
          }  z-[10] w-full px-[1rem] py-[1rem] pb-[1.7rem] flex gap-[1rem] bg-secondary`}
        >
          <PlotfieldButton
            onClick={() => {
              setEditingCharacteristicId(characteristicId);
              setShowEditingModal(true);
              setShowSuggestiveModal(false);
            }}
            className="bg-primary-darker hover:bg-orange-800 active:bg-orange-800 hover:scale-[1.02] active:scale-[1]"
          >
            Редактировать
          </PlotfieldButton>
          <PlotfieldButton
            onClick={() => {
              setDeletedCharacteristicId(characteristicId);
              deleteCharacteristic.mutate();
              setShowSuggestiveModal(false);
            }}
            className="bg-primary-darker hover:bg-red-700 active:bg-red-700 hover:scale-[1.02] active:scale-[1]"
          >
            Удалить
          </PlotfieldButton>
        </aside>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`${
          showEditingModal && editingCharacteristicId === characteristicId ? "" : "hidden"
        } w-full flex flex-col gap-[.5rem]`}
      >
        <PlotfieldInput
          type="text"
          value={editingCharacteristicName}
          onChange={(e) => setEditingCharacteristicName(e.target.value)}
          className="border-[1px] text-[1.7rem]"
        />
        <div className="flex gap-[.5rem]">
          <PlotfieldButton
            onClick={() => {
              setShowEditingModal(false);
            }}
            className="bg-primary hover:bg-orange-800"
            type="button"
          >
            Закрыть
          </PlotfieldButton>
          <PlotfieldButton className="bg-primary hover:bg-green-700">Изменить</PlotfieldButton>
        </div>
      </form>
    </>
  );
}
