import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

const APPEARANCE_TYPES = [
  "Украшение",
  "Волосы",
  "Костюм",
  "Тело",
  "Татуировка",
  "Кожа",
];

type AppearanceTypesDropDownTypes = {
  setAppearanceType: React.Dispatch<
    React.SetStateAction<TranslationTextFieldNameAppearancePartsTypes>
  >;
};

export default function AppearanceTypeDropDown({
  setAppearanceType,
}: AppearanceTypesDropDownTypes) {
  const [valueToEng, setValueToEng] = useState("");
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (valueToEng === "Украшение") {
      setAppearanceType("accessory");
    } else if (valueToEng === "Волосы") {
      setAppearanceType("hair");
    } else if (valueToEng === "Костюм") {
      setAppearanceType("dress");
    } else if (valueToEng === "Тело") {
      setAppearanceType("body");
    } else if (valueToEng === "Татуировка") {
      setAppearanceType("art");
    } else if (valueToEng === "Кожа") {
      setAppearanceType("skin");
    }

    if (!valueToEng)
      setAppearanceType(
        valueToEng as TranslationTextFieldNameAppearancePartsTypes
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueToEng]);

  console.log(valueToEng);

  useOutOfModal({ modalRef, setShowModal, showModal });
  return (
    <div className="bg-secondary rounded-md shadow-md relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal((prev) => !prev);
        }}
        className="text-[1.3rem] text-center px-[1rem] py-[.5rem] whitespace-nowrap outline-gray-300"
      >
        {valueToEng || "Внешний Вид Тип"}
      </button>
      <aside
        ref={modalRef}
        className={`${
          showModal ? "" : "hidden"
        } overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-secondary rounded-md shadow-md translate-y-[.5rem] p-[1rem]`}
      >
        {APPEARANCE_TYPES.map((ct) => (
          <button
            key={ct}
            type="button"
            onClick={() => {
              if (ct === valueToEng) {
                setValueToEng("");
              } else {
                setValueToEng(ct);
              }
              setShowModal(false);
            }}
            className={`${
              ct === valueToEng
                ? "bg-primary-darker text-text-dark"
                : " text-gray-600 bg-secondary"
            } text-[1.4rem] outline-gray-300 text-start hover:bg-primary-darker hover:text-text-dark rounded-md px-[1rem] py-[.5rem] hover:shadow-md`}
          >
            {ct}
          </button>
        ))}
      </aside>
    </div>
  );
}
