import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import staffDefaultIcon from "../../../assets/images/Story/characters.png";
import useGetStaffMember from "../../../hooks/Fetching/Staff/useGetStaffMember";
import useGetSingleStory from "../../../hooks/Fetching/Story/useGetSingleStory";
import useUpdateStaffStoryStatus from "../../../hooks/Patching/Staff/useUpdateStaffStoryStatus";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import { EpisodeStatusTypes } from "../../../types/StoryData/Episode/EpisodeTypes";
import { LocalStorageTypes, useTypedLocalStorage } from "@/hooks/helpers/shared/LocalStorage/useTypedLocalStorage";

export default function StoryFooter() {
  const { storyId } = useParams();
  const { getItem } = useTypedLocalStorage<LocalStorageTypes>();
  const { data: storyInfo } = useGetSingleStory({ storyId: storyId || "" });
  const [storyStatus, setStoryStatus] = useState<EpisodeStatusTypes>("" as EpisodeStatusTypes);
  const theme = getItem("theme");
  useEffect(() => {
    if (storyInfo) {
      setStoryStatus(storyInfo.storyStatus);
    }
  }, [storyInfo]);

  return (
    <footer className="w-full mt-[30px]">
      <div className="max-w-[1480px] mx-auto flex flex-col gap-[10px] p-[10px]">
        <div className="flex gap-[10px] items-baseline sm:flex-row flex-col">
          <h3 className="text-[35px] text-heading">Информация по истории</h3>
          <p
            className={`text-[17px] ${storyStatus === "doing" ? "text-orange" : "text-green"}
            }`}
          >
            {storyStatus === "doing" ? "(В процессе)" : "(Завершена)"}
          </p>
        </div>
        <h4 className={`text-[25px] text-paragraph ${theme === "dark" ? "opacity-70" : ""}`}>Сценаристы</h4>
        <div className={`${storyInfo?.storyStaffInfo?.length ? "" : "hidden"} flex flex-wrap gap-[10px] w-full`}>
          {storyInfo?.storyStaffInfo?.map((st) => (
            <StaffInfoItem key={st.staffId} storyId={storyId || ""} {...st} />
          ))}
        </div>
        <div className={`${storyInfo?.storyStaffInfo?.length ? "hidden" : ""} flex flex-wrap gap-[10px] w-full`}>
          <p className="text-text bg-secondary px-[10px] py-[5px] rounded-sm">Пусто</p>
        </div>
      </div>
    </footer>
  );
}

type StaffInfoItemTypes = {
  staffId: string;
  storyId: string;
  storyStatus: EpisodeStatusTypes;
};

function StaffInfoItem({ staffId, storyStatus, storyId }: StaffInfoItemTypes) {
  const { data: staff } = useGetStaffMember({ staffId });
  const [currentStoryStatus, setCurrentStoryStatus] = useState(storyStatus);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const updateStaffStatus = useUpdateStaffStoryStatus({ staffId, storyId });

  useOutOfModal({
    modalRef,
    setShowModal: setShowStaffModal,
    showModal: showStaffModal,
  });

  return (
    <div
      className={`${
        currentStoryStatus === "doing"
          ? `border-[3px] border-double border-orange`
          : `border-[3px] border-double border-green`
      } min-w-[200px] max-w-[280px] shadow-sm rounded-md relative text-text`}
    >
      <button
        onClick={(e) => {
          if (staff?.roles.includes("editor") || staff?.roles.includes("headscriptwriter")) {
            e.stopPropagation();
            setShowStaffModal((prev) => !prev);
          }
        }}
        className={` ${
          staff?.roles.includes("editor") || staff?.roles.includes("headscriptwriter")
            ? "cursor-pointer hover:scale-[1.01] transition-all"
            : ""
        } outline-none w-full p-[5px] flex items-center gap-[5px]`}
      >
        <div className="w-[4rem]">
          <img
            src={staff?.imgUrl || staffDefaultIcon}
            alt="Worker"
            className="rounded-full w-full object-contain bg-secondary"
          />
        </div>
        <div className="flex flex-grow max-w-[23rem] text-start">
          <h3 className="text-[1.6rem] break-words w-full">{staff?.username}</h3>
        </div>
      </button>

      <aside
        ref={modalRef}
        className={`${
          showStaffModal ? "" : "hidden"
        } absolute z-[2] shadow-sm bg-secondary rounded-md top-0 w-full h-full p-[5px]`}
      >
        <div className="flex gap-[5px] justify-between">
          <p className="text-[14px] text-paragraph">Статус</p>
          <button
            onClick={() => {
              setCurrentStoryStatus((prev) => {
                if (prev === "done") {
                  updateStaffStatus.mutate({ storyStatus: "doing" });
                  return "doing";
                } else {
                  updateStaffStatus.mutate({ storyStatus: "done" });
                  return "done";
                }
              });
              setShowStaffModal(false);
            }}
            className={`${
              currentStoryStatus === "doing"
                ? "text-orange outline-orange hover:text-green hover:outline-green transition-all"
                : `outline-green hover:text-orange hover:outline-orange transition-all`
            } text-[14px] px-[5px] rounded-md`}
          >
            Обновить
          </button>
        </div>
      </aside>
    </div>
  );
}
