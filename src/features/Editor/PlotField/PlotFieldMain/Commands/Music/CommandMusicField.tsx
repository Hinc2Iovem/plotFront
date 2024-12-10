import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import useGetAllMusicByStoryId from "../../../hooks/Music/useGetAllMusicByStoryId";
import useGetCommandMusic from "../../../hooks/Music/useGetCommandMusic";
import useGetMusicById from "../../../hooks/Music/useGetMusicById";
import useUpdateMusicText from "../../../hooks/Music/useUpdateMusicText";
import "../Prompts/promptStyles.css";
import CreateMusicField from "./CreateMusicField";
import useSearch from "../../../../Context/Search/SearchContext";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";

type CommandMusicFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandMusicField({ plotFieldCommandId, command, topologyBlockId }: CommandMusicFieldTypes) {
  const { storyId, episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Music");
  const [musicName, setMusicName] = useState<string>("");
  const [showMusicDropDown, setShowMusicDropDown] = useState(false);
  const [showCreateMusicModal, setShowCreateMusicModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });

  const debouncedValue = useDebounce({ value: musicName, delay: 600 });

  const { data: allMusic } = useGetAllMusicByStoryId({
    storyId: storyId ?? "",
  });

  const allMusicFilteredMemoized = useMemo(() => {
    const res = [...(allMusic || [])];
    if (musicName) {
      const filtered = res?.filter((a) => a.musicName.toLowerCase().includes(musicName.toLowerCase())) || [];
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

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: nameValue || "music",
          id: plotFieldCommandId,
          text: musicName,
          topologyBlockId,
          type: "command",
        },
      });
    }
  }, [episodeId]);

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
    musicId: commandMusic?.musicId || "",
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

  useEffect(() => {
    if (debouncedValue?.trim().length && debouncedValue !== musicName && episodeId) {
      updateValue({ episodeId, commandName: "music", id: plotFieldCommandId, type: "command", value: debouncedValue });
    }
  }, [debouncedValue, musicName, episodeId]);

  useOutOfModal({
    setShowModal: setShowMusicDropDown,
    showModal: showMusicDropDown,
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
        <form onSubmit={handleNewMusicSubmit} className="w-full">
          <PlotfieldInput
            onBlur={() => {}}
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
          />
        </form>

        <AsideScrollable
          ref={modalRef}
          className={`${showMusicDropDown ? "" : "hidden"} translate-y-[3.5rem] ${
            !allMusicFilteredMemoized.length && musicName ? "hidden" : ""
          }`}
        >
          <ul className={`flex flex-col gap-[.5rem]`}>
            {allMusicFilteredMemoized.length ? (
              allMusicFilteredMemoized.map((mm, i) => (
                <li key={mm + i}>
                  <AsideScrollableButton
                    onClick={(e) => {
                      setMusicName(mm);
                      handleNewMusicSubmit(e, mm);
                      setShowMusicDropDown(false);
                    }}
                    className={`${
                      musicName === mm ? "bg-primary-darker text-text-light" : "bg-secondary text-text-dark"
                    }`}
                  >
                    {mm}
                  </AsideScrollableButton>
                </li>
              ))
            ) : !musicName?.trim().length ? (
              <li>
                <AsideScrollableButton
                  onClick={() => {
                    setShowMusicDropDown(false);
                  }}
                >
                  Пусто
                </AsideScrollableButton>
              </li>
            ) : null}
          </ul>
        </AsideScrollable>
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
