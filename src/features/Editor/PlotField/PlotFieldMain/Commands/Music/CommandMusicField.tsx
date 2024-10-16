import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useGetAllMusicByStoryId from "../hooks/Music/useGetAllMusicByStoryId";
import useGetCommandMusic from "../hooks/Music/useGetCommandMusic";
import useGetMusicById from "../hooks/Music/useGetMusicById";
import useUpdateMusicText from "../hooks/Music/useUpdateMusicText";
import "../Prompts/promptStyles.css";
import CreateMusicField from "./CreateMusicField";

type CommandMusicFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

export default function CommandMusicField({
  plotFieldCommandId,
  command,
}: CommandMusicFieldTypes) {
  const { storyId } = useParams();
  const [nameValue] = useState<string>(command ?? "Music");
  const [musicName, setMusicName] = useState<string>("");
  const [showMusicDropDown, setShowMusicDropDown] = useState(false);
  const [showCreateMusicModal, setShowCreateMusicModal] = useState(false);
  const theme = localStorage.getItem("theme");
  const modalRef = useRef<HTMLDivElement>(null);

  const { data: allMusic } = useGetAllMusicByStoryId({
    storyId: storyId ?? "",
  });

  const allMusicFilteredMemoized = useMemo(() => {
    const res = [...(allMusic || [])];
    if (musicName) {
      const filtered =
        res?.filter((a) =>
          a.musicName.toLowerCase().includes(musicName.toLowerCase())
        ) || [];
      return filtered.map((f) => f.musicName.toLowerCase());
    } else {
      return res.map((r) => r.musicName.toLowerCase());
    }
  }, [allMusic, musicName]);

  const allMusicMemoized = useMemo(() => {
    return allMusic?.map((a) => a.musicName.toLowerCase()) || [];
  }, [allMusic]);

  const { data: commandMusic } = useGetCommandMusic({
    plotFieldCommandId,
  });

  const [commandMusicId, setCommandMusicId] = useState("");
  const { data: music } = useGetMusicById({
    musicId: commandMusic?.musicId || "",
  });

  useEffect(() => {
    if (commandMusic) {
      setCommandMusicId(commandMusic._id);
    }
  }, [commandMusic]);

  useEffect(() => {
    if (music) {
      setMusicName(music.musicName);
    }
  }, [music]);

  const updateMusicText = useUpdateMusicText({
    storyId: storyId || "",
    commandMusicId,
  });

  const handleNewMusicSubmit = (e: React.FormEvent, mm?: string) => {
    e.preventDefault();
    if (!musicName?.trim().length && !mm?.trim().length) {
      console.log("Заполните поле");
      return;
    }

    if (mm?.trim().length) {
      updateMusicText.mutate({ musicName: mm });
    } else if (musicName?.trim().length) {
      if (!allMusicMemoized?.includes(musicName.toLowerCase())) {
        // suggest to create new music
        setShowCreateMusicModal(true);
      } else {
        // just updated music command
        updateMusicText.mutate({ musicName });
      }
    }

    setShowMusicDropDown(false);
  };

  useOutOfModal({
    setShowModal: setShowMusicDropDown,
    showModal: showMusicDropDown,
    modalRef,
  });

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <h3 className="text-[1.3rem] text-text-light text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-secondary cursor-default">
          {nameValue}
        </h3>
      </div>
      <div
        className={`sm:w-[77%] flex-grow w-full flex-col flex-wrap flex items-center gap-[1rem] relative`}
      >
        <form onSubmit={handleNewMusicSubmit} className="w-full">
          <input
            onClick={(e) => {
              e.stopPropagation();
              setShowMusicDropDown((prev) => !prev);
            }}
            value={musicName || ""}
            onChange={(e) => {
              setShowMusicDropDown(true);
              setMusicName(e.target.value);
            }}
            placeholder="Музыка"
            className={`text-[1.3rem] ${
              theme === "light" ? "outline-gray-300" : "outline-gray-600"
            } text-text-light bg-secondary rounded-md px-[1rem] py-[.5rem] flex-grow w-full text-start min-h-[3rem]`}
          />
        </form>

        <aside
          ref={modalRef}
          className={`${showMusicDropDown ? "" : "hidden"} ${
            !allMusicFilteredMemoized.length && musicName ? "hidden" : ""
          } bg-secondary shadow-md translate-y-[3rem] rounded-md z-[10] w-full min-w-fit max-h-[15rem] overflow-y-auto overflow-x-hidden p-[.5rem] absolute | containerScroll`}
        >
          <ul className={`flex flex-col gap-[.5rem]`}>
            {allMusicFilteredMemoized.length ? (
              allMusicFilteredMemoized.map((mm, i) => (
                <li key={mm + i}>
                  <button
                    onClick={(e) => {
                      setMusicName(mm);
                      handleNewMusicSubmit(e, mm);
                      setShowMusicDropDown(false);
                    }}
                    className={`${
                      musicName === mm
                        ? "bg-primary-darker text-text-light"
                        : "bg-secondary text-text-dark"
                    } text-start outline-gray-300 hover:bg-primary-darker hover:text-text-light text-text-dark transition-all cursor-pointer active:scale-[0.99] w-full text-[1.4rem] px-[1rem] py-[.5rem] rounded-md shadow-md`}
                  >
                    {mm}
                  </button>
                </li>
              ))
            ) : !musicName?.trim().length ? (
              <li>
                <button
                  onClick={() => {
                    setShowMusicDropDown(false);
                  }}
                  className={`bg-secondary ${
                    theme === "light" ? "outline-gray-300" : "outline-gray-600"
                  } text-text-dark hover:text-text-light text-start hover:bg-primary-darker transition-all cursor-pointer active:scale-[0.99] w-full text-[1.4rem] px-[1rem] py-[.5rem] rounded-md shadow-md`}
                >
                  Пусто
                </button>
              </li>
            ) : null}
          </ul>
        </aside>
      </div>

      <CreateMusicField
        commandMusicId={commandMusicId}
        setShowModal={setShowCreateMusicModal}
        showModal={showCreateMusicModal}
        storyId={storyId || ""}
        musicName={musicName}
      />
    </div>
  );
}
