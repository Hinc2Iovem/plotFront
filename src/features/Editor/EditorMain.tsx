import { useRef, useState } from "react";
import search from "../../assets/images/Editor/search.png";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";
import useHandleDuplicationOfAllCommands from "../../hooks/helpers/Plotfield/Duplication/useHandleDuplicationOfAllCommands";
import useHandleAllCommandsCreatedViaKeyCombination from "../../hooks/helpers/Plotfield/useHandleAllCommandsCreatedViaKeyCombination";
import useHandleNavigationThroughCommands from "../../hooks/helpers/Plotfield/useHandleNavigationThroughCommands";
import useHandleResizeOfEditorWindows from "../../hooks/helpers/Plotfield/useHandleResizeOfEditorWindows";
import useResizeEditorWindow from "../../hooks/helpers/Plotfield/useResizeEditorWindow";
import AllMightySearch from "./AllMightySearch/AllMightySearch";
import DraggableExpansionDiv from "./components/DraggableExpansionDiv";
import { CoordinatesProvider } from "./Flowchart/Context/CoordinatesContext";
import Flowchart from "./Flowchart/Flowchart";
import "./Flowchart/FlowchartStyles.css";
import useHandleDeletionOfCommand from "./PlotField/hooks/helpers/useHandleDeletionOfCommand";
import PlotField from "./PlotField/PlotField";
import useNavigation from "./Context/Navigation/NavigationContext";

type EditorMainTypes = {
  setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditorMain({ setShowHeader }: EditorMainTypes) {
  const { currentTopologyBlockId } = useNavigation();
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

  useHandleAllCommandsCreatedViaKeyCombination({
    topologyBlockId: currentTopologyBlockId,
  });

  useHandleDuplicationOfAllCommands({
    topologyBlockId: currentTopologyBlockId,
  });

  useHandleNavigationThroughCommands();

  useHandleDeletionOfCommand();

  return (
    <>
      {typeof hideFlowchartFromScriptwriter === "boolean" && (
        <main
          ref={containerRef}
          className={`flex w-full ${
            showAllMightySearch ? "hidden" : ""
          } h-[calc(100vh-2.30rem)] justify-center relative`}
        >
          <PlotField
            expansionDivDirection={expansionDivDirection}
            hideFlowchartFromScriptwriter={hideFlowchartFromScriptwriter}
            setHideFlowchartFromScriptwriter={setHideFlowchartFromScriptwriter}
            setShowHeader={setShowHeader}
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
            } fixed top-[2rem] text-text-light text-[1.3rem] transition-all bg-secondary hover:bg-primary-darker hover:text-text-dark text-gray-700 shadow-md px-[1rem] py-[.5rem] rounded-md z-[10]`}
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
            className="absolute bottom-[1rem] right-[1rem] w-[3.5rem] rounded-full "
          >
            <img src={search} alt="Поиск" className="w-full hover:scale-[1.05] transition-all" />
          </button>
        </main>
      )}

      <AllMightySearch showAllMightySearch={showAllMightySearch} setShowAllMightySearch={setShowAllMightySearch} />
    </>
  );
}
