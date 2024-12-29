import { DraggableProvided } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import character from "../../assets/images/shared/characters.png";
import useGetStaffMember from "../../hooks/Fetching/Staff/useGetStaffMember";
import useGetSingleStory from "../../hooks/Fetching/Story/useGetSingleStory";
import useGetTranslationEpisode from "../../hooks/Fetching/Translation/useGetTranslationEpisode";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "../../hooks/helpers/shared/SessionStorage/useTypedSessionStorage";
import useEscapeOfModal from "../../hooks/UI/useEscapeOfModal";
import { EpisodeTypes } from "../../types/StoryData/Episode/EpisodeTypes";
import { AllPossiblePlotFieldComamndsTypes } from "../../types/StoryEditor/PlotField/PlotFieldTypes";
import useNavigation from "../Editor/Context/Navigation/NavigationContext";
import { getAllTopologyBlocksConnectionsByEpisodeId } from "../Editor/PlotField/hooks/TopologyBlock/useGetAllTopologyBlockConnectionsByEpisodeId";
import { getAllTopologyBlocksByEpisodeId } from "../Editor/PlotField/hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import { getAllPlotfieldCommands } from "../Editor/PlotField/hooks/useGetAllPlotFieldCommands";

type EpisodeItemTypes = {
  provided: DraggableProvided;
} & EpisodeTypes;

export default function EpisodeItem({ _id, episodeOrder, episodeStatus, provided }: EpisodeItemTypes) {
  const { storyId } = useParams();
  const { setItem, removeItem, getItem } = useTypedSessionStorage<SessionStorageKeys>();
  const { clearFocusedCommand, setCurrentTopologyBlock } = useNavigation();
  const [localTopologyBlockId] = useState(localStorage.getItem(`${_id}-topologyBlockId`));
  const [isEpisodeInfoOpen, setIsEpisodeInfoOpen] = useState(false);
  const { data: episode } = useGetTranslationEpisode({
    episodeId: _id,
    language: "russian",
  });
  const { data: currentStory } = useGetSingleStory({ storyId: storyId || "" });

  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeDescription, setEpisodeDescription] = useState("");

  useEffect(() => {
    if (episode) {
      episode.translations.map((d) => {
        if (d.textFieldName === "episodeDescription") {
          setEpisodeDescription(d.text);
        } else if (d.textFieldName === "episodeName") {
          setEpisodeTitle(d.text);
        }
      });
    }
  }, [episode]);

  const queryClient = useQueryClient();
  const prefetchTopologyBlocks = () => {
    queryClient.prefetchQuery({
      queryKey: ["episode", _id, "topologyBlock"],
      queryFn: () => getAllTopologyBlocksByEpisodeId({ episodeId: _id }),
    });
    queryClient.prefetchQuery({
      queryKey: ["connection", "episode", _id],
      queryFn: () => getAllTopologyBlocksConnectionsByEpisodeId({ episodeId: _id }),
    });
    if (localTopologyBlockId) {
      queryClient.prefetchQuery({
        queryKey: ["plotfield", "topologyBlock", localTopologyBlockId],
        queryFn: () => getAllPlotfieldCommands({ topologyBlockId: localTopologyBlockId }),
      });
    }
  };

  useEscapeOfModal({
    setValue: setIsEpisodeInfoOpen,
    value: isEpisodeInfoOpen,
  });

  const updateSessionStorageValues = () => {
    const storedEpisodeId = getItem("episodeId") || "";
    if (_id !== storedEpisodeId) {
      setItem("altArrowLeft", "");
      setItem("altArrowRight", "");
      setItem("altCurrent", "");

      setItem(`focusedCommand`, "");
      setItem("focusedCommandInsideType", `default?`);
      setItem(`focusedCommandType`, "command");
      setItem(`focusedCommandParentId`, "");
      setItem(`focusedCommandParentType`, "" as "if");
      setItem("focusedCommandOrder", 0);
      setItem("focusedCommandName", "" as AllPossiblePlotFieldComamndsTypes);
      removeItem("focusedConditionIsElse");

      clearFocusedCommand();
      setItem("episodeId", _id);
    } else {
      setCurrentTopologyBlock(localTopologyBlockId ? { _id: localTopologyBlockId } : { _id: "" });
    }
  };

  return (
    <li
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className="w-full bg-secondary flex flex-col"
    >
      <div
        onClick={() => {
          prefetchTopologyBlocks();
          setIsEpisodeInfoOpen((prev) => !prev);
        }}
        className={` ${
          isEpisodeInfoOpen ? "shadow-none border-[.1rem] border-b-0 rounded-b-none" : " hover:scale-[1.01]"
        } outline-gray-400 text-start bg-secondary w-full rounded-md shadow-sm shadow-gray-300 p-[1rem]`}
      >
        <h3 className="text-[1.5rem] text-text-light">
          {episodeTitle.trim().length ? episodeTitle : `Эпизод ${episodeOrder}`}
        </h3>
      </div>
      <div
        className={`${
          isEpisodeInfoOpen ? "border-[.1rem]  rounded-t-none" : "hidden"
        } flex flex-col min-h-[10rem] w-full bg-secondary rounded-md shadow-gray-300`}
      >
        <p className="text-[1.5rem] self-end pt-[.5rem] pr-[.5rem] text-text-dark">
          Статус:{" "}
          <span className={`text-[1.4rem] ${episodeStatus === "doing" ? "text-orange-400" : "text-green-400"}`}>
            {episodeStatus === "doing" ? "В процессе" : "Завершена"}
          </span>
        </p>
        <p className="text-[1.4rem] text-text-light opacity-70 h-full w-full break-words pl-[.5rem]">
          {episodeDescription}
        </p>
        <div className="flex justify-between items-center gap-[1rem] mt-auto w-full">
          <div
            className={`${
              currentStory?.storyStaffInfo?.length ? "" : "hidden"
            } flex gap-[.5rem] flex-wrap bg-secondary shadow-md px-[1rem] py-[.5rem]`}
          >
            {currentStory?.storyStaffInfo?.length
              ? currentStory.storyStaffInfo.map((ss) => <WorkersItems key={ss.staffId} staffId={ss.staffId} />)
              : null}
          </div>
          <Link
            onClick={updateSessionStorageValues}
            className="ml-auto w-fit text-[1.5rem] text-text-dark hover:text-text-light pr-[.5rem] transition-all"
            to={`/stories/${storyId}/editor/episodes/${_id}`}
          >
            На страницу Эпизода
          </Link>
        </div>
      </div>
    </li>
  );
}

function WorkersItems({ staffId }: { staffId: string }) {
  const { data: scriptwriter } = useGetStaffMember({ staffId });
  const [showName, setShowName] = useState(false);

  return (
    <div className="relative">
      <img
        src={scriptwriter?.imgUrl || character}
        alt={scriptwriter?.username}
        onMouseEnter={() => setShowName(true)}
        onMouseLeave={() => setShowName(false)}
        className="w-[3rem] rounded-md shadow-sm"
      />
      <aside
        className={`${
          showName ? "" : "hidden"
        } absolute bottom-[0rem] translate-y-[3rem] text-text-dark rounded-md px-[1rem] py-[.25rem] bg-secondary shadow-md z-[10] text-[1.4rem]`}
      >
        {scriptwriter?.username}
      </aside>
    </div>
  );
}
