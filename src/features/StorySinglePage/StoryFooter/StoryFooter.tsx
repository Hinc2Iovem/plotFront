import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import staffDefaultIcon from "../../../assets/images/Story/characters.png";
import useGetStaffMember from "../../../hooks/Fetching/Staff/useGetStaffMember";
import useGetSingleStory from "../../../hooks/Fetching/Story/useGetSingleStory";
import useUpdateStaffStoryStatus from "../../../hooks/Patching/Staff/useUpdateStaffStoryStatus";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import { EpisodeStatusTypes } from "../../../types/StoryData/Episode/EpisodeTypes";

export default function StoryFooter() {
  const { storyId } = useParams();
  const { data: storyInfo } = useGetSingleStory({ storyId: storyId || "" });
  const [storyStatus, setStoryStatus] = useState<EpisodeStatusTypes>(
    "" as EpisodeStatusTypes
  );

  useEffect(() => {
    if (storyInfo) {
      setStoryStatus(storyInfo.storyStatus);
    }
  }, [storyInfo]);

  return (
    <footer className="w-full bg-white mt-[3rem]">
      <div className="max-w-[148rem] mx-auto flex flex-col gap-[1rem] p-[1rem]">
        <div className="flex gap-[1rem] items-baseline sm:flex-row flex-col">
          <h3 className="text-[3rem] text-gray-600">Информация по истории</h3>
          <p
            className={`text-[1.5rem] ${
              storyStatus === "doing" ? "text-orange-300" : "text-green-300"
            }`}
          >
            {storyStatus === "doing" ? "(В процессе)" : "(Завершена)"}
          </p>
        </div>
        <h4 className="text-[2.5rem] text-gray-500">Сценаристы</h4>
        <div className="flex flex-wrap gap-[1rem] w-full">
          {storyInfo?.storyStaffInfo?.map((st) => (
            <StaffInfoItem key={st.staffId} storyId={storyId || ""} {...st} />
          ))}
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
          ? "bg-orange-200 text-white"
          : " bg-green-300 text-white"
      } min-w-[20rem] max-w-[28rem] shadow-sm rounded-md relative`}
    >
      <button
        onClick={(e) => {
          if (
            staff?.roles.includes("editor") ||
            staff?.roles.includes("headscriptwriter")
          ) {
            e.stopPropagation();
            setShowStaffModal((prev) => !prev);
          }
        }}
        className={` ${
          staff?.roles.includes("editor") ||
          staff?.roles.includes("headscriptwriter")
            ? "cursor-pointer hover:scale-[1.01] transition-all"
            : ""
        } outline-gray-100 w-full p-[.5rem] flex items-center gap-[.5rem]`}
      >
        <div className="w-[4rem]">
          <img
            src={staff?.imgUrl || staffDefaultIcon}
            alt="Worker"
            className="rounded-full w-full object-contain bg-white"
          />
        </div>
        <div className="flex flex-grow max-w-[23rem] text-start">
          <h3 className="text-[1.6rem] break-words w-full">
            {staff?.username}
          </h3>
        </div>
      </button>

      <aside
        ref={modalRef}
        className={`${
          showStaffModal ? "" : "hidden"
        } absolute z-[2] shadow-sm bg-white rounded-md top-0 w-full h-full p-[.5rem]`}
      >
        <div className="flex gap-[.5rem] text-black  justify-between">
          <p className="text-[1.4rem] text-gray-500">Статус</p>
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
                ? "text-orange-300 outline-orange-300 hover:text-green-300 hover:outline-green-300 transition-all"
                : "text-green-300 outline-green-300 hover:text-orange-300 hover:outline-orange-300 transition-all"
            } text-[1.4rem] px-[.5rem] rounded-md`}
          >
            Обновить
          </button>
        </div>
      </aside>
    </div>
  );
}
