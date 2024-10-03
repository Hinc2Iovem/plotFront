import { useEffect, useRef, useState } from "react";
import plus from "../../../../../../assets/images/shared/plus.png";
import useGetDecodedJWTValues from "../../../../../../hooks/Auth/useGetDecodedJWTValues";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import {
  ChoiceOptionVariationsTypes,
  ChoiceVariationsTypes,
} from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import ButtonHoverPromptModal from "../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import IndividualOptionTypeBlock from "./IndividualOptionTypeBlock";
import MovingOptionBlocks from "./MovingOptionBlocks";
import ShowOptionVariationsModal from "./ShowOptionVariationsModal";
import CreateNewDefaultOptionGroup from "./CreateNewDefaultOptionGroup";
import DefaultOptionVariant from "./DefaultOptionVariant";
import ChoiceTypeModal from "./ChoiceTypeModal";

type ChoiceDefaultSettings = {
  showChoice: boolean;
  setChoiceType: React.Dispatch<React.SetStateAction<ChoiceVariationsTypes>>;
  setOptionVariations: React.Dispatch<
    React.SetStateAction<ChoiceOptionVariationsTypes[]>
  >;
  choiceType: ChoiceVariationsTypes;
  optionVariations: ChoiceOptionVariationsTypes[];
};

export default function ChoiceDefaultSettings({
  showChoice,
  choiceType,
  optionVariations,
  setChoiceType,
  setOptionVariations,
}: ChoiceDefaultSettings) {
  const { userId } = useGetDecodedJWTValues();

  const [currentDefaultChoiceOption, setCurrentDefaultChoiceOption] =
    useState("");

  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showOptionVariations, setShowOptionVariations] = useState(false);
  const [addChoiceOptionVariation, setAddChoiceOptionVariation] =
    useState(false);
  const [moveBlocks, setMoveBlocks] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const modalOptionRef = useRef<HTMLDivElement>(null);
  const modalAddOptionVariationRef = useRef<HTMLDivElement>(null);

  const [groupedItems, setGroupedItems] = useState<
    Record<
      string,
      {
        key: string;
        value: string;
      }
    >
  >({});

  useEffect(() => {
    const regex = new RegExp(`^${userId},choiceOption,v(\\d+)$`);

    const items: Record<
      string,
      {
        key: string;
        value: string;
      }
    > = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) as string;
      const match = key?.match(regex);

      if (match) {
        const version = match[1];
        const value = localStorage.getItem(key);

        if (!items[`v${version}`] && value) {
          items[`v${version}`] = {
            key: `v${version}`,
            value,
          };
        }
      }
    }
    setGroupedItems(items);
  }, [userId]);

  useOutOfModal({
    modalRef,
    showModal: showChoiceModal,
    setShowModal: setShowChoiceModal,
  });

  useOutOfModal({
    modalRef: modalOptionRef,
    showModal: showOptionVariations,
    setShowModal: setShowOptionVariations,
  });
  useOutOfModal({
    modalRef: modalAddOptionVariationRef,
    showModal: addChoiceOptionVariation,
    setShowModal: setAddChoiceOptionVariation,
  });

  return (
    <div
      className={`${
        showChoice ? "" : "hidden"
      } ml-auto rounded-md h-full flex gap-[2rem]`}
    >
      <ChoiceTypeModal choiceType={choiceType} setChoiceType={setChoiceType} />
      <div className="relative">
        <div
          onMouseEnter={() => setMoveBlocks(true)}
          onMouseLeave={() => setMoveBlocks(false)}
          className={`absolute hover:left-[-2rem] h-full top-[0rem] left-[-1rem] z-[0]`}
        >
          {optionVariations.map((ov, i) => (
            <MovingOptionBlocks
              key={`${ov}-MovingOptionBlock-${i}`}
              moveBlocks={moveBlocks}
              ov={ov}
              i={i}
            />
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowChoiceModal((prev) => !prev);
            setShowOptionVariations(false);
          }}
          className={`shadow-md relative rounded-md bg-white text-[1.5rem] outline-black px-[1rem] py-[.5rem] w-[8.5rem]`}
        >
          Ответы
        </button>

        <aside
          ref={modalRef}
          className={`${
            showChoiceModal ? "" : "hidden"
          } flex flex-col gap-[.5rem] max-h-[20rem] translate-y-[.5rem] overflow-auto absolute min-w-[17rem] w-full right-0 shadow-md bg-white rounded-b-md | containerScroll`}
        >
          <div className="w-full px-[1rem] py-[.5rem] flex flex-wrap gap-[.5rem] relative">
            <ButtonHoverPromptModal
              positionByAbscissa="left"
              contentName="Вид Ответа"
              className="w-[3rem] rounded-md shadow-md"
              positionForDiv="relative"
              asideClasses="absolute -translate-y-[1.1rem] text-[1.3rem]"
              onClick={() => setShowOptionVariations((prev) => !prev)}
            >
              <img src={plus} alt="Plus" className="w-full object-cover" />
            </ButtonHoverPromptModal>
            {optionVariations.map((ov, i) => (
              <IndividualOptionTypeBlock
                key={ov + "-" + i}
                userId={userId || ""}
                setGroupedItems={setGroupedItems}
                currentDefaultChoiceOption={currentDefaultChoiceOption}
                setOptionVariations={setOptionVariations}
                ov={ov}
                i={i}
              />
            ))}
            <ShowOptionVariationsModal
              currentDefaultChoiceOption={currentDefaultChoiceOption}
              optionVariations={optionVariations}
              setOptionVariations={setOptionVariations}
              showOptionVariations={showOptionVariations}
              userId={userId || ""}
            />
          </div>

          <div className={`flex flex-col gap-[1rem] w-full`}>
            {!currentDefaultChoiceOption?.trim().length && (
              <CreateNewDefaultOptionGroup
                setCurrentDefaultChoiceOption={setCurrentDefaultChoiceOption}
                setGroupedItems={setGroupedItems}
                optionVariations={optionVariations}
                amountOfKeys={Object.keys(groupedItems).length}
                userId={userId || ""}
              />
            )}
            <div
              className={`${
                Object.keys(groupedItems).length > 0 ? "" : "hidden"
              } flex gap-[.5rem] justify-center w-full mb-[1rem]`}
            >
              {Object.keys(groupedItems).length > 0 &&
                Object.entries(groupedItems).map((gi) => (
                  <DefaultOptionVariant
                    key={gi[0]}
                    setOptionVariations={setOptionVariations}
                    currentDefaultChoiceOption={currentDefaultChoiceOption}
                    setCurrentDefaultChoiceOption={
                      setCurrentDefaultChoiceOption
                    }
                    gi={gi}
                  />
                ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
