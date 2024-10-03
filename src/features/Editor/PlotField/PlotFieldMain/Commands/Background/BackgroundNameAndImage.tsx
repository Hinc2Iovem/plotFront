import { useEffect, useState } from "react";
import PreviewImageSmallIcons from "../../../../../shared/utilities/PreviewImageSmallIcons";
import useUpdateImg from "../../../../../../hooks/Patching/useUpdateImg";

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
      updateBackgroundImg.mutate();
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
          <input
            value={backgroundName || ""}
            type="text"
            className=" w-full outline-gray-300 text-gray-600 text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]"
            placeholder="Название заднего плана"
            onChange={(e) => setBackgroundName(e.target.value)}
          />
          <div
            onMouseOver={() => setShowFullSizeImg(true)}
            onMouseLeave={() => setShowFullSizeImg(false)}
          >
            <PreviewImageSmallIcons
              imagePreview={imagePreview}
              imgClasses="cursor-pointer w-full h-full object-cover"
              setPreview={setPreview}
              divClasses="w-[4rem] h-[4rem] bg-white rounded-md relative"
            />
          </div>
        </div>
      </form>

      <aside
        className={`${
          showFullSizeImg ? "" : "hidden"
        } absolute w-[20rem] h-[10rem] z-[2] rounded-md border-[1px] border-white shadow-sm bg-white right-0 top-[5rem]`}
      >
        <img
          src={imagePreview as string}
          alt={backgroundName}
          className="w-full h-full object-cover rounded-md"
        />
      </aside>
    </>
  );
}
