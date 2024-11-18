import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import useGetAllSoundByStoryIdAndIsGlobal from "../../../hooks/Sound/useGetAllSoundsByStoryIdAndIsGlobal";
import useGetCommandSound from "../../../hooks/Sound/useGetCommandSound";
import useGetSoundById from "../../../hooks/Sound/useGetSoundById";
import useUpdateSoundText from "../../../hooks/Sound/useUpdateSoundText";
import "../Prompts/promptStyles.css";
import CreateSoundField from "./CreateSoundField";

type CommandSoundFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

export default function CommandSoundField({ plotFieldCommandId, command }: CommandSoundFieldTypes) {
  const { storyId } = useParams();
  const [showSoundDropDown, setShowSoundDropDown] = useState(false);
  const [showCreateSoundModal, setShowCreateSoundModal] = useState(false);
  const [nameValue] = useState<string>(command ?? "Sound");
  const [soundName, setSoundName] = useState<string>("");
  const { data: allSound } = useGetAllSoundByStoryIdAndIsGlobal({
    storyId: storyId ?? "",
  });
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const allSoundFilteredMemoized = useMemo(() => {
    const res = [...(allSound || [])];
    if (soundName) {
      const filtered = res?.filter((a) => a.soundName?.toLowerCase().includes(soundName?.toLowerCase())) || [];
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

  console.log(allSound);

  useOutOfModal({
    setShowModal: setShowSoundDropDown,
    showModal: showSoundDropDown,
    modalRef,
  });
  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <div className={`sm:w-[77%] flex-grow w-full flex-col flex-wrap flex items-center gap-[1rem] relative`}>
        <form onSubmit={handleNewSoundSubmit} className="w-full">
          <PlotfieldInput
            focusedSecondTime={focusedSecondTime}
            onBlur={() => {
              setFocusedSecondTime(false);
            }}
            setFocusedSecondTime={setFocusedSecondTime}
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
          />
        </form>

        <AsideScrollable
          ref={modalRef}
          className={`${showSoundDropDown ? "" : "hidden"} ${
            !allSoundFilteredMemoized.length && soundName ? "hidden" : ""
          } translate-y-[3.5rem]`}
        >
          <ul className={`flex flex-col gap-[.5rem]`}>
            {allSoundFilteredMemoized.length ? (
              allSoundFilteredMemoized.map((mm, i) => (
                <li key={mm + plotFieldCommandId + i}>
                  <AsideScrollableButton
                    onClick={(e) => {
                      setSoundName(mm);
                      handleNewSoundSubmit(e, mm);
                      setShowSoundDropDown(false);
                    }}
                    className={`${
                      soundName === mm ? "bg-primary-darker text-text-dark" : "bg-secondary text-gray-600"
                    } `}
                  >
                    {mm}
                  </AsideScrollableButton>
                </li>
              ))
            ) : (
              <li>
                <AsideScrollableButton
                  onClick={() => {
                    setShowSoundDropDown(false);
                  }}
                >
                  Пусто
                </AsideScrollableButton>
              </li>
            )}
          </ul>
        </AsideScrollable>
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
