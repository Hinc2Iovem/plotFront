import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";

type WaitDefaultSettingsTypes = {
  showWait: boolean;
  setTime: React.Dispatch<React.SetStateAction<string | null>>;
  time: string | null;
};

const AllPossibleTimes = [
  "0.0",
  "0.1",
  "0.2",
  "0.3",
  "0.4",
  "0.5",
  "0.6",
  "0.7",
  "0.8",
  "0.9",
  "1.0",
];

export default function WaitDefaultSettings({
  showWait,
  setTime,
  time,
}: WaitDefaultSettingsTypes) {
  const [showTime, setShowTime] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useOutOfModal({
    modalRef,
    showModal: showTime,
    setShowModal: setShowTime,
  });

  return (
    <div
      className={`${
        showWait ? "" : "hidden"
      } ml-auto shadow-md rounded-md h-full relative`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowTime((prev) => !prev);
        }}
        className={`${
          showTime ? "border-b-[.1rem] border-black rounded-b-md" : " "
        } text-[1.5rem] outline-black px-[1rem] py-[.5rem]`}
      >
        {time ? time : "Время"}
      </button>

      <div
        ref={modalRef}
        className={`${
          showTime ? "" : "hidden"
        } flex flex-col gap-[.5rem] max-h-[10rem] overflow-auto absolute min-w-fit w-full right-0 shadow-md bg-secondary rounded-b-md | containerScroll`}
      >
        {AllPossibleTimes.map((t, i) => (
          <button
            key={t + "-" + i}
            onClick={() => {
              setTime(t);
              setShowTime(false);
            }}
            className="text-[1.5rem] outline-black px-[1rem] py-[.5rem]"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
