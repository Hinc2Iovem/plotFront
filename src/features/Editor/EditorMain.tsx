import editorUtils from "@/assets/images/Editor/editorUtils.png";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "@/const/COMMANDS_CREATED_BY_KEY_COMBINATION";
import useHandleResizeOfEditorWindows from "@/hooks/helpers/Plotfield/ResizeWindow/useHandleResizeOfEditorWindows";
import useResizeEditorWindow from "@/hooks/helpers/Plotfield/ResizeWindow/useResizeEditorWindow";
import { useRef, useState } from "react";
import AllMightySearch from "./AllMightySearch/AllMightySearch";
import DraggableExpansionDiv from "./components/DraggableExpansionDiv";
import { CoordinatesProvider } from "./Flowchart/Context/CoordinatesContext";
import Flowchart from "./Flowchart/Flowchart";
import PlotField from "./PlotField/PlotField";
import "./Flowchart/FlowchartStyles.css";
import UtilsSidebar from "./UtilsSidebar/UtilsSidebar";

export default function EditorMain() {
  const [command, setCommand] = useState<PossibleCommandsCreatedByCombinationOfKeysTypes>(
    "" as PossibleCommandsCreatedByCombinationOfKeysTypes
  );
  // TODO here should be null, changed for demo purposes only
  const [hideFlowchartFromScriptwriter, setHideFlowchartFromScriptwriter] = useState<boolean | null>(null);
  const [showAllMightySearch, setShowAllMightySearch] = useState(false);
  const [showUtils, setShowUtils] = useState(false);

  console.log(setShowAllMightySearch);
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
          className={`flex w-full ${showAllMightySearch ? "hidden" : ""} ${
            showUtils ? "w-[calc(100vw-20px)]" : "max-w-[1480px] mx-auto"
          } h-[calc(100vh-23px)] justify-center relative`}
        >
          <PlotField expansionDivDirection={expansionDivDirection} showUtils={showUtils} command={command} />
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
            onClick={() => setShowUtils(true)}
            className={`${showUtils ? "hidden" : ""} absolute bottom-[0px] right-[0px] w-[35px] rounded-full z-[10]`}
          >
            <img src={editorUtils} alt="Утилиты" className="w-full hover:scale-[1.05] transition-all" />
          </button>

          <UtilsSidebar
            setShowAllMightySearch={setShowAllMightySearch}
            setShowUtils={setShowUtils}
            showUtils={showUtils}
          />
        </main>
      )}

      <AllMightySearch showAllMightySearch={showAllMightySearch} setShowAllMightySearch={setShowAllMightySearch} />
    </>
  );
}
