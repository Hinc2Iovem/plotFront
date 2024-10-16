import { useRef, useState } from "react";
import {
  ALL_LANGUAGES,
  CurrentlyAvailableLanguagesTypes,
} from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import "../../Editor/Flowchart/FlowchartStyles.css";

type ProfileTranslatorHeaderLanguageModalTypes = {
  setValue: React.Dispatch<
    React.SetStateAction<CurrentlyAvailableLanguagesTypes>
  >;
  setPrevValue: React.Dispatch<
    React.SetStateAction<CurrentlyAvailableLanguagesTypes>
  >;
  value: CurrentlyAvailableLanguagesTypes;
  takenValue: CurrentlyAvailableLanguagesTypes;
  text: string;
};

export default function ProfileTranslatorHeaderLanguageModal({
  value,
  setValue,
  setPrevValue,
  text,
  takenValue,
}: ProfileTranslatorHeaderLanguageModalTypes) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useOutOfModal({ modalRef, setShowModal, showModal });
  return (
    <div className="relative z-[2]">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal((prev) => !prev);
        }}
        className="text-[1.4rem] capitalize px-[1rem] py-[.5rem] bg-secondary rounded-md shadow-md outline-gray-400"
      >
        {value || text}
      </button>
      <aside
        ref={modalRef}
        className={`${showModal ? "" : "hidden"} ${
          text === "Перевести на" ? "right-0" : ""
        } max-h-[15rem] overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-secondary rounded-md shadow-md translate-y-[1rem] p-[1rem] | containerScroll`}
      >
        {ALL_LANGUAGES.map((l) => (
          <button
            key={l}
            onClick={() => {
              if (value) {
                setPrevValue(value);
              }
              setValue(l);
              setShowModal(false);
            }}
            className={`${
              l === value
                ? "bg-primary-darker text-text-dark px-[1rem] py-[.5rem] rounded-md shadow-sm w-full"
                : "text-gray-700 bg-secondary"
            } ${
              takenValue === l ? "hidden" : ""
            } text-[1.5rem] hover:bg-primary-darker hover:text-text-dark transition-all px-[1rem] py-[.5rem] rounded-md outline-gray-400`}
          >
            {l}
          </button>
        ))}
      </aside>
    </div>
  );
}
