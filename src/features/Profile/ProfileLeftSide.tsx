import { useEffect, useState } from "react";
import scriptwriter from "../../assets/images/Auth/scriptwriter.png";
import translator from "../../assets/images/Auth/translator.png";
import crown from "../../assets/images/Profile/crown.png";
import editor from "../../assets/images/Profile/editor.png";
import useGetDecodedJWTValues from "../../hooks/Auth/useGetDecodedJWTValues";
import useGetStaffMember from "../../hooks/Fetching/Staff/useGetStaffMember";
import useUpdateImg from "../../hooks/Patching/useUpdateImg";
import { StaffRoles } from "../../types/Staff/StaffTypes";
import ButtonHoverPromptModal from "../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import PreviewImage from "../shared/utilities/PreviewImage";
import { StoryFilterTypes } from "../Story/Story";
import AmountOfFinishedEpisodesModal from "./LeftSide/Scriptwriter/AmountOfFinishedEpisodesModal";
import ProfileLeftSideScriptwriter from "./LeftSide/Scriptwriter/ProfileLeftSideScriptwriter";

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
  const currentTheme = localStorage.getItem("theme");
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
      } flex gap-[1rem] sm:flex-col sm:w-[20rem] w-full h-full flex-shrink-0 flex-wrap`}
    >
      <div
        className={`w-[20rem] flex-grow h-[20rem] relative ${
          currentTheme === "light" ? "bg-secondary border-secondary" : "bg-primary border-primary"
        } rounded-md shadow-sm border-[3px]`}
      >
        {staff?.imgUrl ? (
          <img src={staff.imgUrl} alt="AvatarImg" className="w-full h-full object-cover rounded-md" />
        ) : (
          <PreviewImage
            imgClasses="w-full h-full object-cover rounded-md absolute top-0 bottom-0 left-0 right-0 border-[3px] border-white"
            imagePreview={imagePreview}
            setPreview={setPreview}
          />
        )}
      </div>
      <div
        className={`flex gap-[1rem] flex-col flex-grow sm:bg-none ${
          currentTheme === "light" ? "bg-secondary" : "bg-primary"
        } rounded-md p-[1rem] justify-center shadow-sm`}
      >
        <div className="w-full p-[1rem] bg-secondary rounded-md text-text-light shadow-sm">
          <h3 className="text-[1.5rem] text-center">{staff?.username}</h3>
        </div>
        <div className="w-full p-[1rem] bg-secondary rounded-md text-text-light shadow-sm flex gap-[.5rem] items-center justify-center">
          <h3 className="text-[1.5rem] text-center">Роль:</h3>
          {staff?.roles.map((r) => (
            <RenderStaffRoles key={r} role={r} />
          ))}
        </div>
        {staff?.roles.includes("scriptwriter") || staff?.roles.includes("headscriptwriter") ? (
          <AmountOfFinishedEpisodesModal amountOfFinishedEpisodes={staff?.amountOfFinishedEpisodes || 0} />
        ) : null}
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
      <ButtonHoverPromptModal
        contentName={currentContentName}
        positionByAbscissa="left"
        asideClasses="text-[1.3rem] top-[4rem] bottom-[-3.3rem]"
      >
        {role === "headscriptwriter" && (
          <img
            src={crown}
            alt="Crown"
            className="w-[2rem] absolute -translate-y-1/2 translate-x-[95%] rotate-[35deg]"
          />
        )}
        <img src={currentImg} alt="Scriptwriter" className="w-[3.5rem]" />
      </ButtonHoverPromptModal>
    </>
  );
}
