import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useGetAllSoundByStoryIdAndIsGlobal from "../hooks/Sound/useGetAllSoundsByStoryIdAndIsGlobal";
import useGetCommandSound from "../hooks/Sound/useGetCommandSound";
import useGetSoundById from "../hooks/Sound/useGetSoundById";
import useUpdateSoundText from "../hooks/Sound/useUpdateSoundText";
import "../Prompts/promptStyles.css";
import CreateSoundField from "./CreateSoundField";

type CommandSoundFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

export default function CommandSoundField({
  plotFieldCommandId,
  command,
}: CommandSoundFieldTypes) {
  const { storyId } = useParams();
  const [showSoundDropDown, setShowSoundDropDown] = useState(false);
  const [showCreateSoundModal, setShowCreateSoundModal] = useState(false);
  const [nameValue] = useState<string>(command ?? "Sound");
  const [soundName, setSoundName] = useState<string>("");
  const { data: allSound } = useGetAllSoundByStoryIdAndIsGlobal({
    storyId: storyId ?? "",
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const theme = localStorage.getItem("theme");
  const allSoundFilteredMemoized = useMemo(() => {
    const res = [...(allSound || [])];
    if (soundName) {
      const filtered =
        res?.filter((a) =>
          a.soundName?.toLowerCase().includes(soundName?.toLowerCase())
        ) || [];
      return filtered.map((f) => f.soundName?.toLowerCase());
    } else {
      return res.map((r) => r.soundName?.toLowerCase());
    }
  }, [allSound, soundName]);

  const allSoundMemoized = useMemo(() => {
    return allSound?.map((a) => a.soundName?.toLowerCase()) || [];
  }, [allSound]);

  const { data: commandSound } = useGetCommandSound({
    plotFieldCommandId,
  });
  const [commandSoundId, setCommandSoundId] = useState("");
  const { data: sound } = useGetSoundById({
    soundId: commandSound?.soundId || "",
  });

  useEffect(() => {
    if (commandSound) {
      setCommandSoundId(commandSound._id);
    }
  }, [commandSound]);

  useEffect(() => {
    if (sound) {
      setSoundName(sound.soundName);
    }
  }, [sound]);

  const updateSoundText = useUpdateSoundText({
    storyId: storyId ?? "",
    commandSoundId,
  });

  const handleNewSoundSubmit = (e: React.FormEvent, mm?: string) => {
    e.preventDefault();
    if (!soundName?.trim().length && !mm?.trim().length) {
      console.log("Заполните поле");
      return;
    }
    if (mm?.trim().length) {
      updateSoundText.mutate({ soundName: mm });
    } else if (soundName?.trim().length) {
      if (!allSoundMemoized?.includes(soundName?.toLowerCase() || "")) {
        // suggest to create new sound
        setShowCreateSoundModal(true);
      } else {
        // just updated sound command
        updateSoundText.mutate({ soundName });
      }
    }

    setShowSoundDropDown(false);
  };

  useOutOfModal({
    setShowModal: setShowSoundDropDown,
    showModal: showSoundDropDown,
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
        <form onSubmit={handleNewSoundSubmit} className="w-full">
          <input
            onClick={(e) => {
              e.stopPropagation();
              setShowSoundDropDown((prev) => !prev);
            }}
            value={soundName || ""}
            onChange={(e) => {
              setShowSoundDropDown(true);
              setSoundName(e.target.value);
              setShowCreateSoundModal(false);
            }}
            placeholder="Звук"
            className={`text-[1.3rem] ${
              theme === "light" ? "outline-gray-300" : "outline-gray-600"
            } text-text-light bg-secondary rounded-md px-[1rem] py-[.5rem] flex-grow w-full text-start min-h-[3rem]`}
          />
        </form>

        <aside
          ref={modalRef}
          className={`${showSoundDropDown ? "" : "hidden"} ${
            !allSoundFilteredMemoized.length && soundName ? "hidden" : ""
          } bg-secondary shadow-md translate-y-[3rem] rounded-md z-[10] w-full min-w-fit max-h-[15rem] overflow-y-auto overflow-x-hidden p-[.5rem] absolute | containerScroll`}
        >
          <ul className={`flex flex-col gap-[.5rem]`}>
            {allSoundFilteredMemoized.length ? (
              allSoundFilteredMemoized.map((mm, i) => (
                <li key={mm + plotFieldCommandId + i}>
                  <button
                    onClick={(e) => {
                      setSoundName(mm);
                      handleNewSoundSubmit(e, mm);
                      setShowSoundDropDown(false);
                    }}
                    className={`${
                      soundName === mm
                        ? "bg-primary-darker text-text-dark"
                        : "bg-secondary text-gray-600"
                    } text-start ${
                      theme === "light"
                        ? "outline-gray-300"
                        : "outline-gray-600"
                    } focus-within:bg-primary-darker hover:bg-primary-darker hover:text-text-dark transition-all cursor-pointer active:scale-[0.99] w-full text-[1.4rem] px-[1rem] py-[.5rem] rounded-md shadow-md`}
                  >
                    {mm}
                  </button>
                </li>
              ))
            ) : !soundName?.trim().length ? (
              <li>
                <button
                  onClick={() => {
                    setShowSoundDropDown(false);
                  }}
                  className={`bg-secondary ${
                    theme === "light" ? "outline-gray-300" : "outline-gray-600"
                  } focus-within:bg-primary-darker text-text-dark hover:text-text-light text-start hover:bg-primary-darker transition-all cursor-pointer active:scale-[0.99] w-full text-[1.4rem] px-[1rem] py-[.5rem] rounded-md shadow-md`}
                >
                  Пусто
                </button>
              </li>
            ) : null}
          </ul>
        </aside>
      </div>

      <CreateSoundField
        commandSoundId={commandSoundId}
        setShowModal={setShowCreateSoundModal}
        showModal={showCreateSoundModal}
        storyId={storyId || ""}
        soundName={soundName}
      />
    </div>
  );
}
