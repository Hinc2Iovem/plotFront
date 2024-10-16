import { useRef } from "react";
import { useParams } from "react-router-dom";
import useGetSingleStory from "../../hooks/Fetching/Story/useGetSingleStory";
import useGetStoryAssignedWorkers from "../../hooks/Fetching/Story/useGetStoryAssignedWorkers";
import useOutOfModal from "../../hooks/UI/useOutOfModal";
import StoryInfoModalStaffMember from "./StoryInfoModalStaffMember";

type StoryInfoModalTypes = {
  className: string;
  setInfoModal: React.Dispatch<React.SetStateAction<boolean>>;
  infoModal: boolean;
};

export default function StoryInfoModal({
  className,
  infoModal,
  setInfoModal,
}: StoryInfoModalTypes) {
  const { storyId } = useParams();
  const { data, isLoading, isError, error } = useGetSingleStory({
    storyId: storyId ?? "",
  });

  const { data: staffInfo } = useGetStoryAssignedWorkers({
    storyId: storyId ?? "",
  });

  const modalRef = useRef<HTMLDivElement | null>(null);

  useOutOfModal({ modalRef, setShowModal: setInfoModal, showModal: infoModal });
  if (isLoading) {
    return;
  } else if (isError) {
    console.error(error.message);
    return;
  }

  return (
    <aside
      ref={modalRef}
      className={`flex flex-col justify-between z-10 bg-secondary-darker rounded-md shadow-sm shadow-gray-600 p-[1rem] ${className}`}
    >
      <div className="flex flex-col gap-[1rem]">
        <h3 className="text-[2rem] text-center text-gray-700">
          Количество Эпизодово:{" "}
          <span className="text-[1.5rem]">{data?.amountOfEpisodes}</span>
        </h3>
        <div>
          <h4 className="text-[1.5rem] text-gray-700">Сценаристы: </h4>
          <ul>
            {staffInfo?.map((st) => (
              <StoryInfoModalStaffMember key={st._id} {...st} />
            ))}
          </ul>
        </div>
      </div>
      <h3 className={`text-[1.5rem]  ml-auto w-fit`}>
        Статус:{" "}
        <span
          className={`text-[1.4rem] ${
            data?.storyStatus === "doing" ? "text-orange-400" : "text-green-400"
          }`}
        >
          {data?.storyStatus === "doing" ? "В процессе" : "Завершена"}
        </span>
      </h3>
    </aside>
  );
}
