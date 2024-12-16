import { useEffect, useRef } from "react";
import assignBlack from "../../../assets/images/Profile/assignBlack.svg";
import useGetDecodedJWTValues from "../../../hooks/Auth/useGetDecodedJWTValues";
import useGetAllScriptwriters from "../../../hooks/Fetching/Staff/useGetAllScriptwriters";
import useAssignWorker from "../../../hooks/Patching/Story/useAssignWorker";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import { EpisodeStatusTypes } from "../../../types/StoryData/Episode/EpisodeTypes";
import "../../Editor/Flowchart/FlowchartStyles.css";
import ButtonHoverPromptModal from "../../../ui/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";

type AssignScriptwriterModalTypes = {
  setCharacterIds: React.Dispatch<React.SetStateAction<string[]>>;
  setOpenedStoryId: React.Dispatch<React.SetStateAction<string>>;
  characterIds: string[];
  openedStoryId: string;
  storyTitle: string;
  storyId: string;
  showScriptwriters: boolean;
  setShowScriptwriters: React.Dispatch<React.SetStateAction<boolean>>;
  assignedWorkers?:
    | {
        staffId: string;
        storyStatus: EpisodeStatusTypes;
      }[]
    | undefined;
};

export default function AssignScriptwriterModal({
  storyTitle,
  storyId,
  openedStoryId,
  setOpenedStoryId,
  setCharacterIds,
  characterIds,
  assignedWorkers,
  setShowScriptwriters,
  showScriptwriters,
}: AssignScriptwriterModalTypes) {
  const { userId } = useGetDecodedJWTValues();
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = localStorage.getItem("theme");

  useEffect(() => {
    if (showScriptwriters && assignedWorkers) {
      const allAssignedWorkersIds: string[] = [];
      assignedWorkers.map((aw) => {
        allAssignedWorkersIds.push(aw.staffId);
      });
      setCharacterIds(allAssignedWorkersIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showScriptwriters, assignedWorkers]);

  const { data: allScriptwriters } = useGetAllScriptwriters({
    showModal: showScriptwriters,
  });

  console.log(showScriptwriters);

  // useEffect(() => {
  //   if (storyId === openedStoryId) {
  //     setShowScriptwriters(true);
  //   } else {
  //     setShowScriptwriters(false);
  //   }
  // }, [storyId, openedStoryId]);

  const assignWorker = useAssignWorker({
    storyId,
    currentUserId: userId || "",
  });

  const handleSubmit = () => {
    if (characterIds) {
      characterIds.map((c) => assignWorker.mutate({ staffId: c }));
    }
  };

  useOutOfModal({
    modalRef,
    setShowModal: setShowScriptwriters,
    showModal: showScriptwriters,
  });

  return (
    <>
      <div className="absolute bottom-[4.5rem] right-[.5rem] bg-secondary rounded-md shadow-md">
        <ButtonHoverPromptModal
          className="bg-secondary w-[3rem] shadow-md"
          positionByAbscissa="right"
          contentName="Назначить Сценариста"
          variant={"rectangle"}
          asideClasses="text-[1.5rem] text-text-light"
          onClick={(e) => {
            e.stopPropagation();
            if (openedStoryId === storyId) {
              setOpenedStoryId("");
            } else {
              setCharacterIds([""]);
            }
            setShowScriptwriters((prev) => !prev);
          }}
        >
          <img src={assignBlack} alt="Назначить Сценариста" className="w-full" />
        </ButtonHoverPromptModal>
      </div>
      <aside
        ref={modalRef}
        className={`${
          showScriptwriters ? "" : "hidden"
        } z-[10] fixed bottom-[1rem] flex flex-col gap-[1rem] right-[1rem] bg-secondary rounded-md shadow-md p-[1rem] h-[30rem] w-[20rem]`}
      >
        <h2 className="text-[1.6rem] text-center text-text-light">{storyTitle || ""}</h2>
        <ul className="h-[20rem] overflow-auto px-[1rem] py-[.5rem] flex flex-col gap-[1rem] | containerScroll">
          {allScriptwriters ? (
            allScriptwriters?.map((s) => (
              <button
                key={s._id}
                onClick={() => {
                  if (characterIds.includes(s._id)) {
                    setCharacterIds((prev) => prev.filter((c) => c !== s._id));
                  } else {
                    setCharacterIds((prev) => {
                      return [...prev, s._id];
                    });
                  }
                }}
                className={`${
                  characterIds.includes(s._id) ? "bg-primary  text-text-light" : "text-black bg-secondary"
                } flex px-[.5rem] gap-[.5rem] py-[.5rem] justify-between w-full items-center rounded-md shadow-md hover:text-text-light text-text-dark hover:bg-primary transition-all`}
              >
                {s.imgUrl ? <img src={s.imgUrl} alt={s.username} className="w-[3.5rem] rounded-md" /> : null}
                <p className="text-[1.5rem] w-full">
                  {s.username.length > 10 ? s.username.substring(0, 10) + "..." : s.username}
                </p>
              </button>
            ))
          ) : (
            <button className="flex px-[.5rem] gap-[.5rem] py-[.5rem] justify-between w-full items-center rounded-md shadow-md hover:text-text-light text-text-dark hover:bg-primary bg-secondary transition-all">
              Покамись Пусто
            </button>
          )}
        </ul>
        <button
          onClick={() => {
            setShowScriptwriters(false);
            handleSubmit();
          }}
          className={`w-full px-[1rem] py-[.5rem] rounded-md shadow-md ${
            theme === "light" ? "hover:bg-green-300 bg-secondary" : "bg-primary-darker"
          }  text-[1.5rem] text-text-dark hover:text-text-light transition-all`}
        >
          Назначить
        </button>
      </aside>
    </>
  );
}
