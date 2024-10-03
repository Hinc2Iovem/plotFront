import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../hooks/utilities/useDebounce";
import useGetAllTopologyBlocksByEpisodeId from "../../../Editor/PlotField/PlotFieldMain/Commands/hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";

type TopologyBlockPromptTypes = {
  setTopologyBlockId: React.Dispatch<React.SetStateAction<string>>;
  episodeId: string;
};

export default function TopologyBlockPrompt({
  setTopologyBlockId,
  episodeId,
}: TopologyBlockPromptTypes) {
  const [showTopologyBlocks, setShowTopologyBlocks] = useState(false);
  const [topologyBlockValue, setTopologyBlockValue] = useState("");
  const [topologyBlockBackupValue, setTopologyBlockBackupValue] = useState("");

  const modalTopologyBlocksRef = useRef<HTMLDivElement>(null);

  useOutOfModal({
    modalRef: modalTopologyBlocksRef,
    setShowModal: setShowTopologyBlocks,
    showModal: showTopologyBlocks,
  });

  const debouncedValue = useDebounce({ value: topologyBlockValue, delay: 500 });

  const { data: topologyBlocksSearch, isLoading } =
    useGetAllTopologyBlocksByEpisodeId({
      episodeId,
    });

  useEffect(() => {
    if (debouncedValue?.trim().length) {
      setTopologyBlockId(
        topologyBlocksSearch?.find((cs) => cs.name === debouncedValue)?._id ||
          ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, topologyBlocksSearch]);

  useEffect(() => {
    if (
      !showTopologyBlocks &&
      !topologyBlockValue &&
      topologyBlockBackupValue
    ) {
      setTopologyBlockValue(topologyBlockBackupValue);
    }
  }, [showTopologyBlocks, topologyBlockBackupValue, topologyBlockValue]);

  console.log(topologyBlockBackupValue);

  return (
    <form
      className="bg-white rounded-md shadow-md relative"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        className="w-full rounded-md shadow-md bg-white text-[1.3rem] px-[1rem] py-[.5rem] text-gray-700 outline-none"
        placeholder="Название Блока"
        onClick={(e) => {
          e.stopPropagation();
          if (topologyBlockValue?.trim().length) {
            setTopologyBlockBackupValue(topologyBlockValue);
          }
          setTopologyBlockValue("");
          setShowTopologyBlocks(true);
        }}
        value={topologyBlockValue}
        onChange={(e) => setTopologyBlockValue(e.target.value)}
      />
      {episodeId ? (
        <aside
          ref={modalTopologyBlocksRef}
          className={`${
            showTopologyBlocks ? "" : "hidden"
          } max-h-[15rem] overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-white rounded-md shadow-md translate-y-[.5rem] p-[1rem] | containerScroll`}
        >
          {isLoading ? (
            <div className="text-[1.4rem] text-gray-600 text-center py-[.5rem]">
              Загрузка...
            </div>
          ) : topologyBlocksSearch && topologyBlocksSearch.length > 0 ? (
            topologyBlocksSearch.map((s) => (
              <button
                key={s._id}
                type="button"
                onClick={() => {
                  setTopologyBlockId(s._id);
                  setTopologyBlockValue(s.name || "");
                  setShowTopologyBlocks(false);
                }}
                className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-pastel-blue hover:text-white rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
              >
                {s.name}
              </button>
            ))
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowTopologyBlocks(false);
              }}
              className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-pastel-blue hover:text-white rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
            >
              Нету Подходящих Блоков
            </button>
          )}
        </aside>
      ) : (
        <aside
          ref={modalTopologyBlocksRef}
          className={`${
            showTopologyBlocks ? "" : "hidden"
          } max-h-[15rem] overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-white rounded-md shadow-md translate-y-[.5rem] p-[1rem] | containerScroll`}
        >
          <button
            type="button"
            onClick={() => {
              setShowTopologyBlocks(false);
            }}
            className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-pastel-blue hover:text-white rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
          >
            Выберите Эпизод
          </button>
        </aside>
      )}
    </form>
  );
}
