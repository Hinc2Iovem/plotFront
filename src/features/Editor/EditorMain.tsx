import { useRef, useState } from "react";
import search from "../../assets/images/Editor/search.png";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";
import useHandleResizeOfEditorWindows from "../../hooks/helpers/Plotfield/ResizeWindow/useHandleResizeOfEditorWindows";
import useResizeEditorWindow from "../../hooks/helpers/Plotfield/ResizeWindow/useResizeEditorWindow";
import AllMightySearch from "./AllMightySearch/AllMightySearch";
import DraggableExpansionDiv from "./components/DraggableExpansionDiv";
import { CoordinatesProvider } from "./Flowchart/Context/CoordinatesContext";
import Flowchart from "./Flowchart/Flowchart";
import PlotField from "./PlotField/PlotField";
import "./Flowchart/FlowchartStyles.css";

export default function EditorMain() {
  const [command, setCommand] = useState<PossibleCommandsCreatedByCombinationOfKeysTypes>(
    "" as PossibleCommandsCreatedByCombinationOfKeysTypes
  );
  const [hideFlowchartFromScriptwriter, setHideFlowchartFromScriptwriter] = useState<boolean | null>(null);
  const [showAllMightySearch, setShowAllMightySearch] = useState(false);

  const [expansionDivDirection, setExpansionDivDirection] = useState("" as "right" | "left");

  const keyCombinationToExpandPlotField = useHandleResizeOfEditorWindows({
    command,
    hideFlowchartFromScriptwriter,
    setCommand,
    setExpansionDivDirection,
    setHideFlowchartFromScriptwriter,
  });

  const [scale, setScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleDivPosition, setScaleDivPosition] = useState(0);

  useResizeEditorWindow({ command, containerRef, setScaleDivPosition });
  return (
    <>
      {typeof hideFlowchartFromScriptwriter === "boolean" && (
        <main
          ref={containerRef}
          className={`flex w-full ${showAllMightySearch ? "hidden" : ""} h-[calc(100vh-23px)] justify-center relative`}
        >
          <PlotField
            expansionDivDirection={expansionDivDirection}
            hideFlowchartFromScriptwriter={hideFlowchartFromScriptwriter}
            setHideFlowchartFromScriptwriter={setHideFlowchartFromScriptwriter}
            setExpansionDivDirection={setExpansionDivDirection}
            command={command}
          />
          {!command.trim().length ? (
            <DraggableExpansionDiv
              setCommand={setCommand}
              setHideFlowchartFromScriptwriter={setHideFlowchartFromScriptwriter}
              setExpansionDivDirection={setExpansionDivDirection}
            />
          ) : // this is a button in the middle of the screen to expand flowchart or plotfield
          null}
          <div
            className={`${
              keyCombinationToExpandPlotField === "expandPlotField" || hideFlowchartFromScriptwriter ? "hidden" : ""
            } fixed top-[20px] text-text-light text-[13px] transition-all bg-secondary text-text px-[10px] py-[5px] rounded-md z-[10]`}
            style={{
              left: `${scaleDivPosition}px`,
            }}
          >
            {(scale * 100).toFixed(0)}%
          </div>
          <CoordinatesProvider>
            <Flowchart
              expansionDivDirection={expansionDivDirection}
              hideFlowchartFromScriptwriter={hideFlowchartFromScriptwriter}
              command={command}
              scale={scale}
              setScale={setScale}
            />
          </CoordinatesProvider>

          <button
            onClick={() => setShowAllMightySearch(true)}
            className="absolute bottom-[0px] right-[0px] w-[35px] rounded-full "
          >
            <img src={search} alt="Поиск" className="w-full hover:scale-[1.05] transition-all" />
          </button>
        </main>
      )}

      <AllMightySearch showAllMightySearch={showAllMightySearch} setShowAllMightySearch={setShowAllMightySearch} />
    </>
  );
}
