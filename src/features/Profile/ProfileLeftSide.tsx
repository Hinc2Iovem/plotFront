import { useEffect, useState } from "react";
import scriptwriter from "../../assets/images/Auth/scriptwriter.png";
import translator from "../../assets/images/Auth/translator.png";
import crown from "../../assets/images/Profile/crown.png";
import editor from "../../assets/images/Profile/editor.png";
import useGetDecodedJWTValues from "../../hooks/Auth/useGetDecodedJWTValues";
import useGetStaffMember from "../../hooks/Fetching/Staff/useGetStaffMember";
import useUpdateImg from "../../hooks/Patching/useUpdateImg";
import { StaffRoles } from "../../types/Staff/StaffTypes";
import PreviewImage from "../../ui/shared/PreviewImage";
import { StoryFilterTypes } from "../Story/Story";
import ProfileLeftSideScriptwriter from "./LeftSide/Scriptwriter/ProfileLeftSideScriptwriter";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type ProfileLeftSideTypes = {
  setStoriesType: React.Dispatch<React.SetStateAction<StoryFilterTypes>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  expandedTranslationSide: boolean;
  storiesType: StoryFilterTypes;
};

export default function ProfileLeftSide({
  setStoriesType,
  setSearchValue,
  storiesType,
  expandedTranslationSide,
}: ProfileLeftSideTypes) {
  const { userId: staffId } = useGetDecodedJWTValues();
  const { data: staff } = useGetStaffMember({ staffId: staffId ?? "" });

  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const updateImg = useUpdateImg({
    id: staffId ?? "",
    path: "/staff",
    preview: imagePreview,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted && imagePreview) {
      updateImg.mutate({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={`${
        expandedTranslationSide ? "hidden" : ""
      } flex gap-[10px] sm:flex-col sm:w-[210px] w-full flex-shrink-0 flex-wrap sm:h-[calc(100vh-20px)]`}
    >
      <div className={`w-full relative rounded-md shadow-sm border-[5px] border-accent`}>
        {staff?.imgUrl ? (
          <img src={staff.imgUrl} alt="AvatarImg" className="w-full h-full object-cover" />
        ) : (
          <PreviewImage
            imgClasses="w-full h-full object-cover rounded-md absolute top-0 bottom-0 left-0 right-0"
            divClasses="bg-secondary"
            imagePreview={imagePreview}
            setPreview={setPreview}
          />
        )}
      </div>
      <div
        className={`flex flex-col gap-[5px] flex-grow border-[1px] border-border rounded-md p-[10px] justify-center`}
      >
        <div className="w-full rounded-md">
          <h3 className="text-[15px] text-center text-text bg-secondary px-[10px] py-[5px] rounded-md">
            {staff?.username}
          </h3>
        </div>
        <div className="w-full p-[5px] rounded-md flex gap-[5px] items-center justify-center bg-secondary">
          <h3 className="text-[15px] text-center text-text">Роль:</h3>
          {staff?.roles.map((r) => (
            <RenderStaffRoles key={r} role={r} />
          ))}
        </div>
        {/* {staff?.roles.includes("scriptwriter") || staff?.roles.includes("headscriptwriter") ? (
          <AmountOfFinishedEpisodesModal amountOfFinishedEpisodes={staff?.amountOfFinishedEpisodes || 0} />
        ) : null} */}
      </div>

      <ProfileLeftSideScriptwriter
        setSearchValue={setSearchValue}
        setStoriesType={setStoriesType}
        storiesType={storiesType}
      />
    </div>
  );
}

function RenderStaffRoles({ role }: { role: StaffRoles }) {
  const [currentImg] = useState(
    role === "scriptwriter"
      ? scriptwriter
      : role === "translator"
      ? translator
      : role === "editor"
      ? editor
      : role === "headscriptwriter"
      ? scriptwriter
      : scriptwriter
  );
  const [currentContentName] = useState(
    role === "scriptwriter"
      ? "Сценарист"
      : role === "translator"
      ? "Переводчик"
      : role === "editor"
      ? "Редактор"
      : role === "headscriptwriter"
      ? "Главный сценарист"
      : "Сценарист"
  );

  return (
    <>
      <HoverCard>
        <HoverCardTrigger className="relative cursor-pointer">
          {role === "headscriptwriter" && (
            <img
              src={crown}
              alt="Crown"
              className="w-[20px] absolute -translate-y-1/2 translate-x-[95%] rotate-[35deg]"
            />
          )}
          <img src={currentImg} alt="Scriptwriter" className="w-[35px]" />
        </HoverCardTrigger>
        <HoverCardContent className="bg-secondary text-paragraph text-[14px] w-fit">
          {currentContentName}
        </HoverCardContent>
      </HoverCard>
    </>
  );
}
