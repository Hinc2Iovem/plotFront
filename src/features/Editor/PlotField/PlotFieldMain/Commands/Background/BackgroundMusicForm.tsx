import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useUpdateBackgroundMusicText from "../hooks/Background/useUpdateBackgroundMusicText";
import useGetAllMusicByStoryId from "../hooks/Music/useGetAllMusicByStoryId";
import useGetMusicById from "../hooks/Music/useGetMusicById";

type BackgroundMusicFormTypes = {
  backgroundId: string;
  musicId: string;
};

export default function BackgroundMusicForm({
  backgroundId,
  musicId,
}: BackgroundMusicFormTypes) {
  const { storyId } = useParams();
  const [showMusicDropDown, setShowMusicDropDown] = useState(false);
  const [musicName, setMusicName] = useState("");
  const musicRef = useRef<HTMLDivElement>(null);
  const { data: allMusic } = useGetAllMusicByStoryId({
    storyId: storyId ?? "",
  });
  const theme = localStorage.getItem("theme");
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
    }
  }, [music]);

  const updateMusicText = useUpdateBackgroundMusicText({
    storyId: storyId ?? "",
    backgroundId,
  });

  useEffect(() => {
    if (musicName?.trim().length) {
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
    <div
      className={`sm:w-[77%] flex-grow w-full flex-wrap sm:flex-row flex-col flex items-center gap-[1rem] relative`}
    >
      <div className="flex-grow relative sm:w-auto w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMusicDropDown((prev) => !prev);
          }}
          className={`text-[1.3rem] ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light bg-secondary rounded-md px-[1rem] py-[.5rem] w-full sm:text-start text-center`}
        >
          {musicName?.trim().length ? (
            musicName
          ) : (
            <span className="text-gray-600 text-[1.3rem]">Название Музыки</span>
          )}
        </button>

        <aside
          ref={musicRef}
          className="translate-y-[.5rem] absolute w-full z-[2]"
        >
          <ul
            className={`${
              showMusicDropDown ? "" : "hidden"
            } shadow-md bg-secondary rounded-md w-full flex flex-col gap-[.5rem] max-h-[15rem] overflow-y-auto overflow-x-hidden p-[.5rem] | containerScroll`}
          >
            {allMusicMemoized.length ? (
              allMusicMemoized.map((mm, i) => (
                <li key={mm + i}>
                  <button
                    onClick={() => {
                      setShowMusicDropDown(false);
                      setMusicName(mm);
                    }}
                    className={`${
                      musicName === mm
                        ? "bg-primary-darker text-text-light"
                        : "bg-secondary text-text-dark"
                    } ${
                      theme === "light"
                        ? "outline-gray-300"
                        : "outline-gray-600"
                    } text-start hover:bg-primary-darker focus-within:text-text-light focus-within:bg-primary-darker hover:text-text-light text-text-dark transition-all cursor-pointer hover:scale-[1.005] active:scale-[1] w-full text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md`}
                  >
                    {mm}
                  </button>
                </li>
              ))
            ) : (
              <li>
                <button
                  onClick={() => {
                    setShowMusicDropDown(false);
                  }}
                  className={`bg-secondary ${
                    theme === "light" ? "outline-gray-300" : "outline-gray-600"
                  } text-start hover:bg-primary-darker focus-within:bg-primary-darker focus-within:text-text-light hover:text-text-light text-text-dark bg-primary transition-all cursor-pointer hover:scale-[1.005] active:scale-[1] w-full text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md`}
                >
                  Пусто
                </button>
              </li>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
}
