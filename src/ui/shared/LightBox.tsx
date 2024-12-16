import { useEffect, useRef } from "react";

type LightBoxConfigureTypes = {
  isLightBox: boolean;
  setIsLightBox: React.Dispatch<React.SetStateAction<boolean>>;
  showModal?: React.Dispatch<React.SetStateAction<boolean>>;
  multipleLightBoxesOnOnePage?: boolean;
};

export default function LightBox({
  isLightBox,
  setIsLightBox,
  multipleLightBoxesOnOnePage = false,
  showModal,
}: LightBoxConfigureTypes) {
  const lightBoxImagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleExitClick = (e: MouseEvent) => {
      if (isLightBox && e.target === lightBoxImagesRef.current) {
        setIsLightBox(false);
        if (multipleLightBoxesOnOnePage && showModal) {
          showModal(false);
        }
      }
    };

    const handleExitKey = (e: KeyboardEvent) => {
      if (isLightBox && e.key == "Escape") {
        setIsLightBox(false);
        if (multipleLightBoxesOnOnePage && showModal) {
          showModal(false);
        }
      }
    };

    document.addEventListener("click", handleExitClick);
    document.addEventListener("keydown", handleExitKey);

    return () => {
      document.removeEventListener("click", handleExitClick);
      document.removeEventListener("keydown", handleExitKey);
    };
  }, [isLightBox, setIsLightBox, multipleLightBoxesOnOnePage, showModal]);

  return (
    <>
      <div
        ref={lightBoxImagesRef}
        className={` ${
          isLightBox ? "opacity-80 fixed inset-0 visible" : "opacity-0 hidden"
        }
        bg-black
        z-[3]
        transition-opacity
        `}
      ></div>
    </>
  );
}
