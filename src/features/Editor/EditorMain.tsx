import { useEffect, useRef, useState } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";
import useGetDecodedJWTValues from "../../hooks/Auth/useGetDecodedJWTValues";
import useHandleAllCommandsCreatedViaKeyCombination from "../../hooks/helpers/Plotfield/useHandleAllCommandsCreatedViaKeyCombination";
import useCheckKeysCombinationExpandFlowchart from "../../hooks/helpers/useCheckKeysCombinationExpandFlowchart";
import useCheckKeysCombinationExpandPlotField from "../../hooks/helpers/useCheckKeysCombinationExpandPlotField";
import DraggableExpansionDiv from "./components/DraggableExpansionDiv";
import { CoordinatesProvider } from "./Flowchart/Context/CoordinatesContext";
import Flowchart from "./Flowchart/Flowchart";
import "./Flowchart/FlowchartStyles.css";
import PlotField from "./PlotField/PlotField";

type EditorMainTypes = {
  setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTopologyBlockId: React.Dispatch<React.SetStateAction<string>>;
  currentTopologyBlockId: string;
};

export default function EditorMain({
  setCurrentTopologyBlockId,
  setShowHeader,
  currentTopologyBlockId,
}: EditorMainTypes) {
  const { roles } = useGetDecodedJWTValues();
  const [command, setCommand] =
    useState<PossibleCommandsCreatedByCombinationOfKeysTypes>(
      "" as PossibleCommandsCreatedByCombinationOfKeysTypes
    );
  const [hideFlowchartFromScriptwriter, setHideFlowchartFromScriptwriter] =
    useState<boolean | null>(null);

  const [expansionDivDirection, setExpansionDivDirection] = useState(
    "" as "right" | "left"
  );

  const [afterFirstRerender, setAfterFirstRerender] = useState(false);
  const keyCombinationToExpandPlotField =
    useCheckKeysCombinationExpandPlotField({
      setCommand,
      setHideFlowchartFromScriptwriter,
      setExpansionDivDirection,
      command,
    });

  useCheckKeysCombinationExpandFlowchart({
    setCommand,
    setHideFlowchartFromScriptwriter,
    setExpansionDivDirection,
    command,
  });

  useEffect(() => {
    // makes only plotfield to show up(for roles below);
    // setAfterFirstRerender - needs to be here for this effect to work only when page loads first time
    if (roles && typeof hideFlowchartFromScriptwriter !== "boolean") {
      if (
        roles.includes("editor") ||
        roles.includes("headscriptwriter") ||
        roles.includes("scriptwriter")
      ) {
        setHideFlowchartFromScriptwriter(true);
        setCommand("expandPlotField");
      } else {
        setHideFlowchartFromScriptwriter(false);
        setCommand("" as PossibleCommandsCreatedByCombinationOfKeysTypes);
      }
      setAfterFirstRerender(true);
    }
  }, [roles, keyCombinationToExpandPlotField]);

  useEffect(() => {
    // when clicked on the shrink btn, changes command to show both plotfield and flowchart
    if (
      afterFirstRerender &&
      !hideFlowchartFromScriptwriter &&
      command !== "expandFlowchart"
    ) {
      setCommand("" as PossibleCommandsCreatedByCombinationOfKeysTypes);
    }
  }, [afterFirstRerender, hideFlowchartFromScriptwriter]);

  const [scale, setScale] = useState(1);

  // const checkScrollbarPresence = () => {
  //   const hasScrollbar =
  //     document.documentElement.scrollHeight > window.innerHeight;
  //   setHasScrollbar(hasScrollbar);
  // };

  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleDivPosition, setScaleDivPosition] = useState(0);

  useEffect(() => {
    const updateHalfSize = () => {
      if (containerRef.current) {
        if (command === "expandFlowchart") {
          setScaleDivPosition(
            window.innerWidth / 2 - containerRef.current.clientWidth / 2 + 10
          );
        } else {
          setScaleDivPosition(window.innerWidth / 2 + 10);
        }
      }
    };

    updateHalfSize();

    window.addEventListener("resize", updateHalfSize);

    return () => {
      window.removeEventListener("resize", updateHalfSize);
    };
  }, [command]);

  useHandleAllCommandsCreatedViaKeyCombination({
    topologyBlockId: currentTopologyBlockId,
  });

  return (
    <>
      {typeof hideFlowchartFromScriptwriter === "boolean" && (
        <main
          ref={containerRef}
          className={`flex w-full h-[calc(100vh-2.30rem)] justify-center relative`}
        >
          <PlotField
            expansionDivDirection={expansionDivDirection}
            hideFlowchartFromScriptwriter={hideFlowchartFromScriptwriter}
            setHideFlowchartFromScriptwriter={setHideFlowchartFromScriptwriter}
            setShowHeader={setShowHeader}
            topologyBlockId={currentTopologyBlockId}
            setExpansionDivDirection={setExpansionDivDirection}
            command={command}
          />
          {!command.trim().length ? (
            <DraggableExpansionDiv
              setCommand={setCommand}
              setHideFlowchartFromScriptwriter={
                setHideFlowchartFromScriptwriter
              }
              setExpansionDivDirection={setExpansionDivDirection}
            />
          ) : // this is a button in the middle of the screen to expand flowchart or plotfield
          null}
          <div
            className={`${
              keyCombinationToExpandPlotField === "expandPlotField" ||
              hideFlowchartFromScriptwriter
                ? "hidden"
                : ""
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
              currentTopologyBlockId={currentTopologyBlockId}
              setCurrentTopologyBlockId={setCurrentTopologyBlockId}
              command={command}
              scale={scale}
              setScale={setScale}
            />
          </CoordinatesProvider>
        </main>
      )}
    </>
  );
}
