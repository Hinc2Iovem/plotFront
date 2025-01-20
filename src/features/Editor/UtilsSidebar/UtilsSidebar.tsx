import React, { useState } from "react";
import { utilsSidebarAllPlotfieldCommands } from "./AllCommands/consts/UtilsSidebarAllPlotfieldCommands";
import AllCommmandButtons from "./AllCommands/UtilsSidebarAllCommands";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import home from "@/assets/images/shared/home.png";
import allMightySearch from "@/assets/images/Editor/search.png";

type UtilsSidebarTypes = {
  showUtils: boolean;
  setShowUtils: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAllMightySearch: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UtilsSidebar({ setShowAllMightySearch, setShowUtils, showUtils }: UtilsSidebarTypes) {
  const { storyId } = useParams();
  const [search, setSearch] = useState("");
  return (
    <div
      className={`${
        showUtils ? "" : "hidden"
      } sm:w-[250px] w-full h-full bg-foreground rounded-l-md py-[10px] flex flex-col ml-[10px] flex-shrink-0`}
    >
      {utilsSidebarAllPlotfieldCommands.map((u, i) => (
        <AllCommmandButtons key={`UtilsSidebar-Pair-${i}`} pair={u} />
      ))}

      <div className="h-full w-full p-[10px] flex flex-col gap-[10px]">
        <form
          className="flex-grow border-border border-[1px] rounded-md max-h-[285px] overflow-y-auto | containerScroll "
          onSubmit={(e) => e.preventDefault()}
        >
          <PlotfieldInput placeholder="Поиск" value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
        <div className="flex flex-col gap-[10px] w-full">
          <div className="flex justify-between bg-accent h-[45px] items-center rounded-md">
            <Button className="p-0 px-[5px]">
              <Link
                draggable={false}
                className="w-[40px] h-[40px] hover:scale-[1.01] hover:opacity-80 active:scale-[.99] transition-all"
                to={`/stories/${storyId}`}
              >
                <img draggable={false} src={home} alt="goBack" className="w-full" />
              </Link>
            </Button>
            <Button
              onClick={() => {
                setShowAllMightySearch(true);
                setShowUtils(false);
              }}
              className="hover:scale-[1.01] p-0 px-[5px] hover:opacity-80 active:scale-[.99] transition-all"
            >
              <img draggable={false} src={allMightySearch} alt="search" className="w-[40px] h-[40px]" />
            </Button>
          </div>
          <Button className="text-text text-[20px] w-full justify-center py-[20px] bg-accent hover:scale-[1.01] hover:opacity-80 active:scale-[.99] transition-all">
            История Удалений
          </Button>
        </div>
      </div>
    </div>
  );
}
