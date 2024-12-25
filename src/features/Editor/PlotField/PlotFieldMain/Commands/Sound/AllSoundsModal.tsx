import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import useGetAllSoundByStoryIdAndIsGlobal from "../../../hooks/Sound/useGetAllSoundsByStoryIdAndIsGlobal";
import useUpdateSoundText from "../../../hooks/Sound/useUpdateSoundText";

type ExposedMethods = {
  handleUpdatingSoundState: () => void;
};

type AllSoundsModalTypes = {
  showSoundDropDown: boolean;
  soundName: string;
  initValue: string;
  storyId: string;
  debouncedValue: string;
  soundId: string;
  setSoundName: React.Dispatch<React.SetStateAction<string>>;
  setInitValue: React.Dispatch<React.SetStateAction<string>>;
  setShowSoundDropDown: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCreateSoundModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AllSoundsModal = forwardRef<ExposedMethods, AllSoundsModalTypes>(
  (
    {
      debouncedValue,
      setShowCreateSoundModal,
      setShowSoundDropDown,
      setSoundName,
      showSoundDropDown,
      soundId,
      soundName,
      storyId,
      initValue,
      setInitValue,
    },
    ref
  ) => {
    const { data: allSound } = useGetAllSoundByStoryIdAndIsGlobal({
      storyId: storyId || "",
    });

    const modalRef = useRef<HTMLDivElement>(null);

    const allSoundFilteredMemoized = useMemo(() => {
      const res = [...(allSound || [])];
      if (debouncedValue) {
        const filtered = res?.filter((a) => a.soundName?.toLowerCase().includes(debouncedValue?.toLowerCase())) || [];
        return filtered.map((f) => f.soundName?.toLowerCase());
      } else {
        return res.map((r) => r.soundName?.toLowerCase());
      }
    }, [allSound, debouncedValue]);

    const allSoundMemoized = useMemo(() => {
      return allSound?.map((a) => a.soundName?.toLowerCase()) || [];
    }, [allSound]);

    const updateSoundText = useUpdateSoundText({
      storyId: storyId ?? "",
      soundId,
    });

    useImperativeHandle(ref, () => ({
      handleUpdatingSoundState,
    }));

    const handleUpdatingSoundState = (mm?: string) => {
      if (!soundName?.trim().length && !mm?.trim().length) {
        console.log("Заполните поле");
        return;
      }

      if (initValue === soundName) {
        return;
      }

      setInitValue(soundName);
      if (mm?.trim().length) {
        // on button click
        updateSoundText.mutate({ soundName: mm });
      } else if (soundName.trim().length) {
        if (!allSoundMemoized?.includes(soundName.toLowerCase())) {
          // suggest to create new sound
          setShowCreateSoundModal(true);
        } else {
          // just updated sound command
          updateSoundText.mutate({ soundName });
        }
      }

      setShowSoundDropDown(false);
    };

    useOutOfModal({
      setShowModal: setShowSoundDropDown,
      showModal: showSoundDropDown,
      modalRef,
    });
    return (
      <AsideScrollable
        ref={modalRef}
        className={`${showSoundDropDown ? "" : "hidden"} ${
          !allSoundFilteredMemoized.length && soundName ? "hidden" : ""
        } translate-y-[3.5rem]`}
      >
        <ul className={`flex flex-col gap-[.5rem]`}>
          {allSoundFilteredMemoized.length ? (
            allSoundFilteredMemoized.map((mm, i) => (
              <li key={mm + i}>
                <AsideScrollableButton
                  onClick={() => {
                    setSoundName(mm);
                    handleUpdatingSoundState(mm);
                    setShowSoundDropDown(false);
                  }}
                  className={`${soundName === mm ? "bg-primary-darker text-text-dark" : "bg-secondary text-gray-600"} `}
                >
                  {mm}
                </AsideScrollableButton>
              </li>
            ))
          ) : (
            <li>
              <AsideScrollableButton
                onClick={() => {
                  setShowSoundDropDown(false);
                }}
              >
                Пусто
              </AsideScrollableButton>
            </li>
          )}
        </ul>
      </AsideScrollable>
    );
  }
);

AllSoundsModal.displayName = "AllSoundsModal";

export default AllSoundsModal;
