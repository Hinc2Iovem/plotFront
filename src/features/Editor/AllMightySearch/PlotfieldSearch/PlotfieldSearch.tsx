import { useEffect, useRef, useState } from "react";
import useDebounce from "../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../../ui/Inputs/PlotfieldInput";
import useSearch, { SearchItemTypes } from "../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";
import useGetTopologyBlockById from "../../PlotField/hooks/TopologyBlock/useGetTopologyBlockById";
import { getAllPlotfieldCommands } from "../../PlotField/hooks/useGetAllPlotFieldCommands";
import { useQueryClient } from "@tanstack/react-query";
import useNavigation from "../../Context/Navigation/NavigationContext";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "../../../../hooks/helpers/shared/SessionStorage/useTypedSessionStorage";

type PlotfieldSearchTypes = {
  setShowAllMightySearch: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PlotfieldSearch({ setShowAllMightySearch }: PlotfieldSearchTypes) {
  const { episodeId } = useParams();
  const { getItem } = useTypedSessionStorage<SessionStorageKeys>();
  const [searchValue, setSearchValue] = useState(getItem("plotfieldSearch") || "");

  const { getSearchResults } = useSearch();
  const debouncedValue = useDebounce({ value: searchValue, delay: 500 });
  const amountOfResults = getSearchResults({ episodeId: episodeId || "", value: debouncedValue }).length;
  return (
    <main className="flex-grow p-[10px] flex flex-col mt-[10px] gap-[10px]">
      <PlotfieldSearchForm searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className="flex flex-col gap-[10px] h-full overflow-auto | containerScroll">
        <h5 className={`${amountOfResults > 0 ? "" : "hidden"} text-text opacity-60 text-[13px]`}>
          Количество результатов: {amountOfResults}
        </h5>
        {getSearchResults({ episodeId: episodeId || "", value: debouncedValue }).map((sr) => (
          <PlotfieldSearchResultsItem setShowAllMightySearch={setShowAllMightySearch} key={sr.id} {...sr} />
        ))}
      </div>
    </main>
  );
}

type PlotfieldSearchResultsItemTypes = {
  setShowAllMightySearch: React.Dispatch<React.SetStateAction<boolean>>;
} & SearchItemTypes;

function PlotfieldSearchResultsItem({
  commandName,
  text,
  topologyBlockId,
  setShowAllMightySearch,
}: PlotfieldSearchResultsItemTypes) {
  const queryClient = useQueryClient();
  const { setItem } = useTypedSessionStorage<SessionStorageKeys>();
  const { currentTopologyBlock, setCurrentTopologyBlock } = useNavigation();
  const { data } = useGetTopologyBlockById({ topologyBlockId });

  const handlePrefetchPlotfieldCommands = () => {
    queryClient.prefetchQuery({
      queryKey: ["plotfield", "topologyBlock", topologyBlockId],
      queryFn: () => getAllPlotfieldCommands({ topologyBlockId }),
    });
  };

  return (
    <div className="flex flex-col p-[5px] rounded-md bg-accent gap-[25px]">
      <div className="flex w-full justify-between items-center">
        <h2
          onMouseOver={handlePrefetchPlotfieldCommands}
          onFocus={handlePrefetchPlotfieldCommands}
          onClick={() => {
            setShowAllMightySearch(false);
            setItem("altCurrent", topologyBlockId);
            setItem("altArrowLeft", currentTopologyBlock._id);
            setCurrentTopologyBlock({ _id: topologyBlockId });
          }}
          className="capitalize cursor-pointer hover:underline text-[20px] text-text py-[3px] px-[10px] rounded-md"
        >
          {commandName}
        </h2>
        <h3 className="capitalize text-[15px] cursor-default text-text opacity-70 bg-secondary py-[3px] px-[10px] rounded-md">
          {data?.name}
        </h3>
      </div>

      <div className="w-full px-[5px]">
        <button
          onMouseOver={handlePrefetchPlotfieldCommands}
          onFocus={handlePrefetchPlotfieldCommands}
          onClick={() => {
            setShowAllMightySearch(false);
            setItem("altCurrent", topologyBlockId);
            setItem("altArrowLeft", currentTopologyBlock._id);
            setCurrentTopologyBlock({ _id: topologyBlockId });
          }}
        >
          <p className="text-text opacity-70 text-[18px] hover:underline w-full text-ellipsis text-start hover:opacity-90 transition-all">
            {text}
          </p>
        </button>
      </div>
    </div>
  );
}

type PlotfieldSearchFormTypes = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string;
};

function PlotfieldSearchForm({ searchValue, setSearchValue }: PlotfieldSearchFormTypes) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setItem } = useTypedSessionStorage<SessionStorageKeys>();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <PlotfieldInput
        ref={inputRef}
        type="text"
        name="plotfieldSearchInput"
        id="plotfieldSearchInput"
        placeholder="Патрик"
        value={searchValue}
        autoComplete="off"
        onChange={(e) => {
          setSearchValue(e.target.value);
          setItem("plotfieldSearch", e.target.value);
        }}
        className="flex-grow px-[10px] py-[5px] rounded-md text-[15px]"
      />
    </form>
  );
}
