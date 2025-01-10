import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import useUpdateBackgroundMusicText from "../../../../hooks/Background/useUpdateBackgroundMusicText";
import useGetAllMusicByStoryId from "../../../../hooks/Music/useGetAllMusicByStoryId";
import useGetMusicById from "../../../../hooks/Music/useGetMusicById";
import PlotfieldButton from "../../../../../../../ui/Buttons/PlotfieldButton";
import AsideScrollable from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";

type BackgroundMusicFormTypes = {
  backgroundId: string;
  musicId: string;
  setCurrentMusicName: React.Dispatch<React.SetStateAction<string>>;
};

export default function BackgroundMusicForm({ backgroundId, musicId, setCurrentMusicName }: BackgroundMusicFormTypes) {
  const { storyId } = useParams();
  const [showMusicDropDown, setShowMusicDropDown] = useState(false);
  const [musicName, setMusicName] = useState("");
  const musicRef = useRef<HTMLDivElement>(null);
  const { data: allMusic } = useGetAllMusicByStoryId({
    storyId: storyId ?? "",
  });
  const allMusicMemoized = useMemo(() => {
    const allMusicNames = allMusic?.map((a) => a.musicName) ?? [];
    return allMusicNames;
  }, [allMusic]);

  const { data: music } = useGetMusicById({
    musicId: musicId ?? "",
  });
  useEffect(() => {
    if (music) {
      setMusicName(music.musicName);
      setCurrentMusicName(music.musicName);
    }
  }, [music]);

  const updateMusicText = useUpdateBackgroundMusicText({
    storyId: storyId ?? "",
    backgroundId,
  });

  useEffect(() => {
    if (musicName?.trim().length) {
      setCurrentMusicName(musicName);
      updateMusicText.mutate({ musicName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicName]);

  useOutOfModal({
    modalRef: musicRef,
    setShowModal: setShowMusicDropDown,
    showModal: showMusicDropDown,
  });
  return (
    <div className={`sm:w-[77%] flex-grow flex-wrap sm:flex-row flex-col flex items-center gap-[1rem] relative`}>
      <div className="flex-grow relative sm:w-auto w-full">
        <PlotfieldButton
          onClick={(e) => {
            e.stopPropagation();
            setShowMusicDropDown((prev) => !prev);
          }}
          className=""
        >
          {musicName?.trim().length ? `Музыка - ${musicName}` : "Название Музыки"}
        </PlotfieldButton>

        <AsideScrollable ref={musicRef} className={`${showMusicDropDown ? "" : "hidden"} translate-y-[.5rem]`}>
          {allMusicMemoized.length ? (
            allMusicMemoized.map((mm, i) => (
              <AsideScrollableButton
                key={mm + i}
                onClick={() => {
                  setShowMusicDropDown(false);
                  setMusicName(mm);
                }}
                className={`${musicName === mm ? "bg-primary-darker text-text-light" : "bg-secondary text-text-dark"}`}
              >
                {mm}
              </AsideScrollableButton>
            ))
          ) : (
            <AsideScrollableButton
              onClick={() => {
                setShowMusicDropDown(false);
              }}
            >
              Пусто
            </AsideScrollableButton>
          )}
        </AsideScrollable>
      </div>
    </div>
  );
}
