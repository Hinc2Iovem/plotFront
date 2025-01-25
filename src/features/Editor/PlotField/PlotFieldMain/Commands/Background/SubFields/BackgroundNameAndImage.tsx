import { useEffect, useState } from "react";
import PreviewImageSmallIcons from "../../../../../../../ui/shared/PreviewImageSmallIcons";
import useUpdateImg from "../../../../../../../hooks/Patching/useUpdateImg";
import PlotfieldInput from "../../../../../../../ui/Inputs/PlotfieldInput";
import useUpdateBackgroundText from "@/features/Editor/PlotField/hooks/Background/useUpdateBackgroundText";

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
  const [localBackgroundName, setLocalBackgroundName] = useState(backgroundName || "");
  const [localPreview, setLocalPreview] = useState<string | ArrayBuffer | null>(imagePreview);
  const [initValue, setInitValue] = useState(backgroundName || "");

  useEffect(() => {
    setLocalBackgroundName(backgroundName);
    setInitValue(backgroundName);
  }, [backgroundName]);

  const [showFullSizeImg, setShowFullSizeImg] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const updateBackgroundText = useUpdateBackgroundText({
    backgroundName: localBackgroundName,
    backgroundId: commandBackgroundId,
  });

  const updateBackgroundImg = useUpdateImg({
    id: commandBackgroundId ?? "",
    path: "/plotFieldCommands/backgrounds",
    preview: imagePreview,
  });

  useEffect(() => {
    if (isMounted && imagePreview && imagePreview !== localPreview) {
      updateBackgroundImg.mutate({});
      setLocalPreview(imagePreview);
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
        className="sm:w-[77%] flex-grow flex-col w-full flex gap-[10px] items-center"
      >
        <div className="w-full flex gap-[5px]">
          <PlotfieldInput
            type="text"
            value={localBackgroundName || ""}
            onBlur={() => {
              if (localBackgroundName !== initValue) {
                setBackgroundName(localBackgroundName);
                setInitValue(localBackgroundName);
                updateBackgroundText.mutate();
              }
            }}
            placeholder="Название заднего плана"
            onChange={(e) => setLocalBackgroundName(e.target.value)}
          />
          <div onMouseOver={() => setShowFullSizeImg(true)} onMouseLeave={() => setShowFullSizeImg(false)}>
            <PreviewImageSmallIcons
              imagePreview={imagePreview}
              imgClasses="cursor-pointer w-full h-full object-cover"
              setPreview={setPreview}
              divClasses="w-[40px] h-[40px] bg-secondary rounded-md relative"
            />
          </div>
        </div>
      </form>

      <aside
        className={`${
          showFullSizeImg && imagePreview ? "" : "hidden"
        } absolute max-w-[200px] h-[100px] z-[2] w-fit rounded-md border-[1px] border-secondary shadow-sm bg-secondary right-0 top-[45px]`}
      >
        <img src={imagePreview as string} alt={backgroundName} className="w-full h-full object-contain rounded-md" />
      </aside>
    </>
  );
}
