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
import { LocalStorageTypes, useTypedLocalStorage } from "@/hooks/helpers/shared/LocalStorage/useTypedLocalStorage";
import shrinkBtnDark from "@/assets/images/Editor/minusCommand.png";
import shrinkBtnLight from "@/assets/images/Editor/minus.png";

type EpisodeItemTypes = {
  provided: DraggableProvided;
} & EpisodeTypes;

export default function EpisodeItem({ _id, episodeOrder, episodeStatus, provided }: EpisodeItemTypes) {
  const { storyId } = useParams();
  const { setItem, removeItem, getItem } = useTypedSessionStorage<SessionStorageKeys>();
  const { clearFocusedCommand, setCurrentTopologyBlock } = useNavigation();
  const { getItem: getLocalItem } = useTypedLocalStorage<LocalStorageTypes>();
  const theme = getLocalItem("theme");
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

  console.log(theme);

  return (
    <li
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className="w-full bg-accent rounded-md flex flex-col"
    >
      <div
        onClick={() => {
          prefetchTopologyBlocks();
          setIsEpisodeInfoOpen((prev) => !prev);
        }}
        className={` ${
          isEpisodeInfoOpen
            ? "border-b-0 border-accent rounded-b-none"
            : "border-border hover:border-accent transition-all"
        } text-start justify-between flex items-center w-full border-border border-[1px] rounded-md p-[10px]`}
      >
        <h3 className="text-[15px] text-text">
          {episodeTitle.trim().length ? episodeTitle : `Эпизод ${episodeOrder}`}
        </h3>

        <button className={`${isEpisodeInfoOpen ? "" : "hidden"}`}>
          <img className="w-[30px]" src={theme === "dark" ? shrinkBtnDark : shrinkBtnLight} alt="shrink" />
        </button>
      </div>
      <div
        className={`${
          isEpisodeInfoOpen ? "border-[1px] border-accent rounded-t-none" : "hidden"
        } flex flex-col min-h-[100px] w-full border-border rounded-md `}
      >
        <p
          className={`text-[15px] self-end ${
            episodeStatus === "doing" ? "bg-orange" : "bg-green"
          } text-text px-[10px] rounded-bl-md`}
        >
          {episodeStatus === "doing" ? "В процессе" : "Завершена"}
        </p>
        <p className="text-[14px] text-paragraph h-full w-full break-words pl-[5px]">{episodeDescription}</p>
        <div className="flex justify-between items-baseline gap-[10px] mt-auto w-full">
          <div
            className={`${
              currentStory?.storyStaffInfo?.length ? "" : "hidden"
            } flex gap-[5px] flex-wrap shadow-md px-[10px] py-[5px]`}
          >
            {currentStory?.storyStaffInfo?.length
              ? currentStory.storyStaffInfo.map((ss) => <WorkersItems key={ss.staffId} staffId={ss.staffId} />)
              : null}
          </div>
          <Link
            onClick={updateSessionStorageValues}
            className="ml-auto w-fit text-[14px] pb-[2px] text-text opacity-70 hover:opacity-100 pr-[5px] transition-all"
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
        className="w-[40px] rounded-md shadow-sm"
      />
      <aside
        className={`${
          showName ? "" : "hidden"
        } absolute bottom-[0px] translate-y-[33px] text-text rounded-md px-[10px] py-[5px] bg-secondary z-[10] text-[14px]`}
      >
        {scriptwriter?.username}
      </aside>
    </div>
  );
}
