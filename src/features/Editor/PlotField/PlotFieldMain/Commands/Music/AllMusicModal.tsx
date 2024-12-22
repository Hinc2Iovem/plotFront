import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import AsideScrollable from "../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import useGetAllMusicByStoryId from "../../../hooks/Music/useGetAllMusicByStoryId";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useUpdateMusicText from "../../../hooks/Music/useUpdateMusicText";

type ExposedMethods = {
  handleUpdatingMusicState: () => void;
};

type AllMusicModalTypes = {
  showMusicDropDown: boolean;
  musicName: string;
  storyId: string;
  debouncedValue: string;
  musicId: string;
  setMusicName: React.Dispatch<React.SetStateAction<string>>;
  setShowMusicDropDown: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCreateMusicModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AllMusicModal = forwardRef<ExposedMethods, AllMusicModalTypes>(
  (
    {
      storyId,
      debouncedValue,
      musicName,
      musicId,
      showMusicDropDown,
      setShowMusicDropDown,
      setMusicName,
      setShowCreateMusicModal,
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const { data: allMusic } = useGetAllMusicByStoryId({
      storyId: storyId || "",
    });

    const allMusicFilteredMemoized = useMemo(() => {
      const res = [...(allMusic || [])];
      if (debouncedValue) {
        const filtered = res?.filter((a) => a.musicName.toLowerCase().includes(debouncedValue.toLowerCase())) || [];
        return filtered.map((f) => f.musicName.toLowerCase());
      } else {
        return res.map((r) => r.musicName.toLowerCase());
      }
    }, [allMusic, debouncedValue]);

    const allMusicMemoized = useMemo(() => {
      return allMusic?.map((a) => a.musicName.toLowerCase()) || [];
    }, [allMusic]);

    const updateMusicText = useUpdateMusicText({
      storyId: storyId || "",
      musicId,
    });

    useImperativeHandle(ref, () => ({
      handleUpdatingMusicState,
    }));

    const handleUpdatingMusicState = (mm?: string) => {
      if (!musicName?.trim().length && !mm?.trim().length) {
        console.log("Заполните поле");
        return;
      }

      setShowMusicDropDown(false);

      if (mm?.trim().length) {
        // on button click
        updateMusicText.mutate({ musicName: mm });
      } else if (allMusicMemoized?.includes(musicName.toLowerCase())) {
        // just updated music command
        updateMusicText.mutate({ musicName });
      } else {
        // suggest to create new music
        setShowCreateMusicModal(true);
      }
    };

    useOutOfModal({
      setShowModal: setShowMusicDropDown,
      showModal: showMusicDropDown,
      modalRef,
    });
    return (
      <AsideScrollable
        ref={modalRef}
        className={`${showMusicDropDown ? "" : "hidden"} translate-y-[3.5rem] ${
          !allMusicFilteredMemoized.length && musicName ? "hidden" : ""
        }`}
      >
        <ul className={`flex flex-col gap-[.5rem]`}>
          {allMusicFilteredMemoized.length ? (
            allMusicFilteredMemoized.map((mm, i) => (
              <li key={mm + i}>
                <AsideScrollableButton
                  type="button"
                  onClick={() => {
                    handleUpdatingMusicState(mm);
                    setMusicName(mm);
                    setShowMusicDropDown(false);
                  }}
                  className={`${
                    musicName === mm ? "bg-primary-darker text-text-light" : "bg-secondary text-text-dark"
                  }`}
                >
                  {mm}
                </AsideScrollableButton>
              </li>
            ))
          ) : !musicName?.trim().length ? (
            <li>
              <AsideScrollableButton
                onClick={() => {
                  setShowMusicDropDown(false);
                }}
              >
                Пусто
              </AsideScrollableButton>
            </li>
          ) : null}
        </ul>
      </AsideScrollable>
    );
  }
);

AllMusicModal.displayName = "AllMusicModal";

export default AllMusicModal;
