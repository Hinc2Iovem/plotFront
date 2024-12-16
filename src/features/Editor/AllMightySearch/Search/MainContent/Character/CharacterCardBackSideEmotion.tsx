import { useEffect, useRef, useState } from "react";
import { EmotionsTypes } from "../../../../../../types/StoryData/Character/CharacterTypes";
import PlotfieldButton from "../../../../../../ui/Buttons/PlotfieldButton";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PreviewImageSmallIcons from "../../../../../../ui/shared/PreviewImageSmallIcons";
import useDeleteEmotion from "../../../../../../hooks/Posting/Emotion/useDeleteEmotion";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useUpdateEmotion from "../../../../../../hooks/Posting/Emotion/useUpdateEmotion";
import plus from "../../../../../../assets/images/shared/plus.png";
import useCreateEmotion from "../../../../../../hooks/Posting/Emotion/useCreateEmotion";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";

type CharacterEmotionBlockTypes = {
  emotions: EmotionsTypes[];
  characterId: string;
};

export function CharacterEmotionBlock({ emotions, characterId }: CharacterEmotionBlockTypes) {
  const [newEmotion, setNewEmotion] = useState("");
  const [beginCreatingNewEmotion, setBeginCreatingNewEmotion] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [deletedEmotionId, setDeletedEmotionId] = useState("");
  const [editingEmotionId, setEditingEmotionId] = useState("");
  const [showEditingModal, setShowEditingModal] = useState(false);

  const createEmotion = useCreateEmotion({ characterId });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmotion?.trim().length) {
      console.log("Can not create an element with an empty value");
      return;
    }

    const emotionId = generateMongoObjectId();

    setBeginCreatingNewEmotion(false);

    emotions.push({
      _id: emotionId,
      emotionName: newEmotion,
      imgUrl: imagePreview as string,
    });
    createEmotion.mutate({ emotionId, emotionBodyName: newEmotion, imgUrl: imagePreview as string });
  };

  useOutOfModal({
    modalRef,
    setShowModal: setBeginCreatingNewEmotion,
    showModal: beginCreatingNewEmotion,
  });
  return (
    <div className="flex flex-col gap-[.5rem] bg-secondary pt-[.5rem] rounded-md px-[.5rem]">
      <div className="flex justify-between w-full items-center px-[.5rem]">
        <h3 className="text-text-light text-[1.7rem]">Эмоции</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setBeginCreatingNewEmotion(true);
          }}
          className="w-[3rem] hover:bg-primary rounded-md transition-all hover:scale-[1.05] active:scale-[1]"
        >
          <img src={plus} alt="+" className="w-full p-[.1rem]" />
        </button>
      </div>
      <div
        className={`${
          beginCreatingNewEmotion ? "hidden" : ""
        } w-full p-[.5rem] overflow-auto h-[10rem] rounded-md flex flex-col gap-[.5rem] | containerScroll`}
      >
        {emotions.map((e) => (
          <CharacterEmotionBlockItem
            key={e._id}
            deletedEmotionId={deletedEmotionId}
            setDeletedEmotionId={setDeletedEmotionId}
            characterId={characterId}
            editingEmotionId={editingEmotionId}
            setEditingEmotionId={setEditingEmotionId}
            setShowEditingModal={setShowEditingModal}
            showEditingModal={showEditingModal}
            {...e}
          />
        ))}
      </div>

      <div
        ref={modalRef}
        className={`${
          beginCreatingNewEmotion ? "" : "hidden"
        } w-full p-[.5rem] overflow-auto h-[10rem] rounded-md flex flex-col gap-[.5rem] | containerScroll`}
      >
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[1rem]">
          <div className="flex gap-[.5rem]">
            <PlotfieldInput
              className="border-[1px] text-[1.7rem]"
              value={newEmotion}
              placeholder="Характеристика"
              onChange={(e) => setNewEmotion(e.target.value)}
            />
            <div className={`w-[4rem] relative bg-primary rounded-md h-[4rem] flex-shrink-0`}>
              <PreviewImageSmallIcons
                imagePreview={imagePreview}
                imgClasses="w-full rounded-md border-[2px] border-primary"
                setPreview={setImagePreview}
                imgNotExistingClasses="w-[3rem] absolute left-[.5rem] top-[.5rem]"
              />
            </div>
          </div>

          <div className="flex justify-between gap-[1rem]">
            <PlotfieldButton
              type="button"
              onClick={() => setBeginCreatingNewEmotion(false)}
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

type CharacterEmotionBlockItemTypes = {
  emotionName?: string;
  imgUrl?: string;
  _id: string;
  characterId: string;
  showEditingModal: boolean;
  editingEmotionId: string;
  deletedEmotionId: string;
  setDeletedEmotionId: React.Dispatch<React.SetStateAction<string>>;
  setEditingEmotionId: React.Dispatch<React.SetStateAction<string>>;
  setShowEditingModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function CharacterEmotionBlockItem({
  _id,
  emotionName,
  imgUrl,
  characterId,
  showEditingModal,
  editingEmotionId,
  deletedEmotionId,
  setDeletedEmotionId,
  setEditingEmotionId,
  setShowEditingModal,
}: CharacterEmotionBlockItemTypes) {
  const [showSuggestiveModal, setShowSuggestiveModal] = useState(false);
  const [currentEmotionName, setCurrentEmotionName] = useState(emotionName);
  const [currentImgUrl, setCurrentImgUrl] = useState(imgUrl);

  const [editingEmotionName, setEditingEmotionName] = useState(emotionName);
  const [imagePreview, setImagePreview] = useState<null | string | ArrayBuffer>(imgUrl || null);

  const updateEmotion = useUpdateEmotion({ characterId, emotionId: _id });

  useEffect(() => {
    setEditingEmotionName(emotionName);
  }, [showEditingModal, emotionName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEmotionName?.trim().length) {
      console.log("Can not save nothing");
      return;
    }

    setCurrentEmotionName(editingEmotionName);
    if (typeof imagePreview === "string" && imagePreview?.trim().length) {
      setCurrentImgUrl(imagePreview);
    }

    setShowEditingModal(false);
    updateEmotion.mutate({ emotionImg: typeof imagePreview === "string" ? imagePreview : "", emotionName });
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const deleteEmotion = useDeleteEmotion({ characterId, emotionId: _id });
  useOutOfModal({ modalRef, setShowModal: setShowSuggestiveModal, showModal: showSuggestiveModal });

  return (
    <>
      <div
        className={`${deletedEmotionId === _id ? "hidden" : ""} ${showEditingModal ? "hidden" : ""} w-full relative`}
      >
        <PlotfieldButton
          onContextMenu={(e) => {
            e.preventDefault();
            setShowSuggestiveModal((prev) => !prev);
          }}
          className="flex justify-between items-center bg-primary shadow-sm"
        >
          {currentEmotionName}
          {currentImgUrl?.trim().length ? (
            <img src={currentImgUrl} alt={"EmotionImg"} className="w-[3rem] object-cover rounded-md" />
          ) : null}
        </PlotfieldButton>

        <aside
          ref={modalRef}
          className={` absolute ${
            showSuggestiveModal ? "" : "hidden"
          }  z-[10] w-full px-[1rem] py-[1rem] pb-[1.7rem] flex gap-[1rem] bg-secondary`}
        >
          <PlotfieldButton
            onClick={() => {
              setEditingEmotionId(_id);
              setShowEditingModal(true);
              setShowSuggestiveModal(false);
            }}
            className="bg-primary-darker hover:bg-orange-800 active:bg-orange-800 hover:scale-[1.02] active:scale-[1]"
          >
            Редактировать
          </PlotfieldButton>
          <PlotfieldButton
            onClick={() => {
              setDeletedEmotionId(_id);
              deleteEmotion.mutate();
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
        className={`${showEditingModal && editingEmotionId === _id ? "" : "hidden"} w-full flex flex-col gap-[.5rem]`}
      >
        <div className="flex gap-[.5rem]">
          <PlotfieldInput
            type="text"
            value={editingEmotionName}
            onChange={(e) => setEditingEmotionName(e.target.value)}
            className="border-[1px] text-[1.7rem]"
          />
          <div className={`w-[4rem] relative bg-primary rounded-md h-[4rem] flex-shrink-0`}>
            <PreviewImageSmallIcons
              imagePreview={imagePreview}
              imgClasses="w-full rounded-md border-[2px] border-primary"
              setPreview={setImagePreview}
              imgNotExistingClasses="w-[3rem] absolute left-[.5rem] top-[.5rem]"
            />
          </div>
        </div>
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
