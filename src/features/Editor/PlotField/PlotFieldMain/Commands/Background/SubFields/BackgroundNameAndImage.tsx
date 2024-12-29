import { useEffect, useState } from "react";
import PreviewImageSmallIcons from "../../../../../../../ui/shared/PreviewImageSmallIcons";
import useUpdateImg from "../../../../../../../hooks/Patching/useUpdateImg";
import PlotfieldInput from "../../../../../../../ui/Inputs/PlotfieldInput";

type BackgroundNameAndImageTypes = {
  commandBackgroundId: string;
  imagePreview: string | null | ArrayBuffer;
  setPreview: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
  setBackgroundName: React.Dispatch<React.SetStateAction<string>>;
  backgroundName: string;
};

export default function BackgroundNameAndImage({
  commandBackgroundId,
  imagePreview,
  setPreview,
  setBackgroundName,
  backgroundName,
}: BackgroundNameAndImageTypes) {
  const updateBackgroundImg = useUpdateImg({
    id: commandBackgroundId ?? "",
    path: "/plotFieldCommands/backgrounds",
    preview: imagePreview,
  });
  const [showFullSizeImg, setShowFullSizeImg] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted && imagePreview) {
      updateBackgroundImg.mutate({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="sm:w-[77%] flex-grow flex-col w-full flex gap-[1rem] items-center"
      >
        <div className="w-full flex gap-[.5rem]">
          <PlotfieldInput
            type="text"
            value={backgroundName || ""}
            onBlur={() => {}}
            placeholder="Название заднего плана"
            onChange={(e) => setBackgroundName(e.target.value)}
          />
          <div onMouseOver={() => setShowFullSizeImg(true)} onMouseLeave={() => setShowFullSizeImg(false)}>
            <PreviewImageSmallIcons
              imagePreview={imagePreview}
              imgClasses="cursor-pointer w-full h-full object-cover"
              setPreview={setPreview}
              divClasses="w-[4rem] h-[4rem] bg-secondary rounded-md relative"
            />
          </div>
        </div>
      </form>

      <aside
        className={`${
          showFullSizeImg && imagePreview ? "" : "hidden"
        } absolute w-[20rem] h-[10rem] z-[2] rounded-md border-[1px] border-secondary shadow-sm bg-secondary right-0 top-[5rem]`}
      >
        <img src={imagePreview as string} alt={backgroundName} className="w-full h-full object-cover rounded-md" />
      </aside>
    </>
  );
}
