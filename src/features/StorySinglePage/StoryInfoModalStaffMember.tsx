import character from "../../assets/images/Story/characters.png";
import useGetStaffMember from "../../hooks/Fetching/Staff/useGetStaffMember";
import { StoryInfoTypes } from "../../types/StoryData/Story/StoryTypes";

export default function StoryInfoModalStaffMember({
  staffId,
  storyStatus,
}: StoryInfoTypes) {
  const { data: staff } = useGetStaffMember({ staffId });

  return (
    <li className="flex gap-[1rem] items-center w-full h-fit">
      <img src={character} alt="CharacterImg" className="w-[3rem]" />
      <div>
        <p className="text-[1.5rem] text-gray-700">{staff?.username}</p>
        <p className="text-[1.4rem] text-gray-600">
          Статус истории -{" "}
          <span
            className={`text-[1.5rem] ${
              storyStatus === "doing" ? "text-orange-400" : "text-green-400"
            }`}
          >
            {storyStatus === "doing" ? "В процессе" : "Завершена"}
          </span>
        </p>
      </div>
    </li>
  );
}
