import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useGetAllTopologyBlockConnectionsByEpisodeId from "../PlotField/PlotFieldMain/Commands/hooks/TopologyBlock/useGetAllTopologyBlockConnectionsByEpisodeId";
import useGetAllTopologyBlocksByEpisodeId from "../PlotField/PlotFieldMain/Commands/hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import FlowchartArrowList from "./FlowchartArrowList";
import "./FlowchartStyles.css";
import FlowchartTopologyBlockRemake from "./FlowchartTopologyBlockRemake";

type FlowChartTypes = {
  setCurrentTopologyBlockId: React.Dispatch<React.SetStateAction<string>>;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  currentTopologyBlockId: string;

  scale: number;
};

export const SCROLLBAR_WIDTH = 17;

export default function FlowchartExpanded({
  scale,
  setScale,
  setCurrentTopologyBlockId,
  currentTopologyBlockId,
}: FlowChartTypes) {
  const { episodeId } = useParams();

  const { data: allTopologyBlocks } = useGetAllTopologyBlocksByEpisodeId({
    episodeId: episodeId ?? "",
  });

  const { data: allConnections } = useGetAllTopologyBlockConnectionsByEpisodeId(
    { episodeId: episodeId ?? "" }
  );

  const boundsRef = useRef<HTMLDivElement>(null);

  const handleZoom = (event: WheelEvent) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      setScale((prevScale) => Math.min(Math.max(prevScale + delta, 0.1), 3));
    }
  };

  useEffect(() => {
    const bounds = boundsRef.current;
    if (bounds) {
      bounds.addEventListener("wheel", handleZoom);
      return () => {
        bounds.removeEventListener("wheel", handleZoom);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
      ref={boundsRef}
      className={`w-full rounded-md min-w-[500rem] min-h-[500rem] border-secondary border-[4px] border-dashed shadow-md relative bg-primary-darker`}
    >
      {allTopologyBlocks
        ? allTopologyBlocks.map((tb) => (
            <FlowchartTopologyBlockRemake
              currentTopologyBlockId={currentTopologyBlockId}
              setCurrentTopologyBlockId={setCurrentTopologyBlockId}
              key={tb._id}
              {...tb}
            />
          ))
        : null}
      {allConnections
        ? allConnections.map((c) => <FlowchartArrowList key={c._id} {...c} />)
        : null}
    </section>
  );
}

// type TopologyBlockConnectionsTypes = {
//   sectionWidth: number;
// } & TopologyBlockTypes;

// function TopologyBlockConnections({
//   _id,
//   coordinatesX,
//   coordinatesY,
//   sectionWidth,
// }: TopologyBlockConnectionsTypes) {
//   const { data: allConnections } = useGetAllTopologyBlockConnections({
//     topologyBlockId: _id,
//   });
//   const amountOfConnections = allConnections?.length || 0;

//   return (
//     <>
//       {amountOfConnections
//         ? allConnections?.map((c) => (
//             <TopologyBlockConnectionItem
//               key={c._id}
//               coordinatesX={coordinatesX}
//               coordinatesY={coordinatesY}
//               sectionWidth={sectionWidth}
//               {...c}
//             />
//           ))
//         : null}
//     </>
//   );
// }

// type TopologyBlockConnectionItemTypes = {
//   coordinatesX: number;
//   coordinatesY: number;
//   sectionWidth: number;
// } & TopologyBlockConnectionTypes;

// const HEIGHT_OF_TOPOLOGY_BLOCK = 40;
// const LENGTH_OF_TOPOLOGY_BLOCK = 40;
// const TOPOLOGY_BLOCK_CENTER_VERTICALLY = 20;
// const TOPOLOGY_BLOCK_CENTER_HORIZONTALLY = 50;

// type ArrowDirectionYTypes = "top" | "bottom" | "middle";
// type HeightExpantionDirection = "middle-top" | "middle-bottom";
// // ArrowDirectionX - when left it doesn't mean left side of the source topologyBlock,
// // it means the div which works as lines to connect target and source block
// // will expand in the left direction, and the same but vice versa for right
// type ArrowDirectionXTypes = "left" | "right";

// function TopologyBlockConnectionItem({
//   coordinatesX,
//   coordinatesY,
//   targetBlockId,
//   sectionWidth,
// }: TopologyBlockConnectionItemTypes) {
//   const { data: targetBlock } = useGetTopologyBlockById({
//     topologyBlockId: targetBlockId,
//   });

//   const blockHeight =
//     (targetBlock?.coordinatesY || 0) > coordinatesY
//       ? (targetBlock?.coordinatesY || 0) - coordinatesY
//       : coordinatesY - (targetBlock?.coordinatesY || 0);

//   const [arrowDirectionY, setArrowDirectionY] = useState<ArrowDirectionYTypes>(
//     "" as ArrowDirectionYTypes
//   );
//   const [heightExpantionDirection, setHeightExpantionDirection] =
//     useState<HeightExpantionDirection>("" as HeightExpantionDirection);
//   const [fullWidthOrNot, setFullWidthOrNot] = useState(true);

//   useEffect(() => {
//     const middleVerticallyY = coordinatesY + TOPOLOGY_BLOCK_CENTER_VERTICALLY;
//     const middleVerticallyXCloserToZero = coordinatesX;
//     const middleVerticallyXFurtherToZero =
//       coordinatesX + LENGTH_OF_TOPOLOGY_BLOCK;

//     const middleHorizontallyYCloserToZero =
//       coordinatesY + HEIGHT_OF_TOPOLOGY_BLOCK;
//     const middleHorizontallyYFurtherToZero = coordinatesY;
//     const middleHorizontallyX =
//       coordinatesX + TOPOLOGY_BLOCK_CENTER_HORIZONTALLY;
//   }, [coordinatesY, targetBlock, coordinatesX]);

//   // useEffect(() => {
//   //   if ((targetBlock?.coordinatesY || 0) > coordinatesY) {
//   //     if (
//   //       (targetBlock?.coordinatesY || 0) - coordinatesY <=
//   //       HEIGHT_OF_TOPOLOGY_BLOCK
//   //     ) {
//   //       setFullWidthOrNot(
//   //         (targetBlock?.coordinatesY || 0) - coordinatesY >=
//   //           TOPOLOGY_BLOCK_CENTER_VERTICALLY
//   //       );
//   //       setArrowDirectionY("middle");
//   //       setHeightExpantionDirection("middle-top");
//   //     } else {
//   //       setArrowDirectionY("top");
//   //     }
//   //   } else {
//   //     if (
//   //       coordinatesY - (targetBlock?.coordinatesY || 0) <=
//   //       HEIGHT_OF_TOPOLOGY_BLOCK
//   //     ) {
//   //       setFullWidthOrNot(
//   //         coordinatesY - (targetBlock?.coordinatesY || 0) >=
//   //           TOPOLOGY_BLOCK_CENTER_VERTICALLY
//   //       );
//   //       setArrowDirectionY("middle");
//   //       setHeightExpantionDirection("middle-bottom");
//   //     } else {
//   //       setArrowDirectionY("bottom");
//   //     }
//   //   }
//   // }, [coordinatesY, targetBlock]);

//   console.log(
//     "targetBlock?.name: ",
//     targetBlock?.name,
//     "targetBlock?.coordinatesY: ",
//     targetBlock?.coordinatesY,
//     "coordinatesY: ",
//     coordinatesY
//   );

//   const calculationOfHeightWhenBottom = sectionWidth - coordinatesY;

//   const blockWidth =
//     (targetBlock?.coordinatesX || 0) > coordinatesX
//       ? (targetBlock?.coordinatesX || 0) - coordinatesX
//       : coordinatesX - (targetBlock?.coordinatesX || 0);
//   const arrowDirectionX: ArrowDirectionXTypes =
//     (targetBlock?.coordinatesX || 0) > coordinatesX ? "left" : "right";

//   const calculationOfWidthWhenRight = sectionWidth - coordinatesX;

//   return (
//     <>
//       {arrowDirectionY === "top" ? (
//         <>
//           {arrowDirectionX === "left" ? (
//             <div
//               style={{
//                 left: `${coordinatesX}px`,
//                 top: `${coordinatesY}px`,
//                 width: `${blockWidth}px`,
//                 height: `calc(${blockHeight}px - 4rem)`,
//               }}
//               className={`absolute z-[100] bg-black opacity-30 translate-y-[4rem] translate-x-[5rem]`}
//             ></div>
//           ) : (
//             <div
//               style={{
//                 right: `${calculationOfWidthWhenRight}px`,
//                 top: `${coordinatesY}px`,
//                 width: `${blockWidth}px`,
//                 height: `calc(${blockHeight}px - 4rem)`,
//               }}
//               className={`absolute z-[100] bg-red-300 opacity-30 translate-y-[4rem] translate-x-[5rem]`}
//             ></div>
//           )}
//         </>
//       ) : arrowDirectionY === "bottom" ? (
//         <>
//           {arrowDirectionX === "left" ? (
//             <div
//               style={{
//                 left: `${coordinatesX}px`,
//                 bottom: `${calculationOfHeightWhenBottom}px`,
//                 width: `${blockWidth}px`,
//                 height: `calc(${blockHeight}px - 4rem)`,
//               }}
//               className={`absolute z-[100] bg-black opacity-30 translate-x-[5rem]`}
//             ></div>
//           ) : (
//             <div
//               style={{
//                 right: `${calculationOfWidthWhenRight}px`,
//                 bottom: `${calculationOfHeightWhenBottom}px`,
//                 width: `${blockWidth}px`,
//                 height: `calc(${blockHeight}px - 4rem)`,
//               }}
//               className={`absolute z-[100] bg-black opacity-30 translate-x-[5rem]`}
//             ></div>
//           )}
//         </>
//       ) : arrowDirectionY === "middle" ? (
//         heightExpantionDirection === "middle-top" ? (
//           <>
//             {arrowDirectionX === "left" ? (
//               <div
//                 style={{
//                   left: `${coordinatesX}px`,
//                   top: `calc(${coordinatesY}px + ${TOPOLOGY_BLOCK_CENTER_VERTICALLY}px)`,
//                   width: `calc(${blockWidth}px - ${
//                     fullWidthOrNot ? "5rem" : "10rem"
//                   })`,
//                   height:
//                     blockHeight - TOPOLOGY_BLOCK_CENTER_VERTICALLY > 0
//                       ? `calc(${blockHeight}px - ${TOPOLOGY_BLOCK_CENTER_VERTICALLY}px)`
//                       : `${blockHeight}px`,
//                 }}
//                 className={`absolute z-[100] bg-black opacity-30 translate-x-[10rem]`}
//               ></div>
//             ) : (
//               <div
//                 style={{
//                   right: `${calculationOfWidthWhenRight}px`,
//                   top: `calc(${coordinatesY}px + ${TOPOLOGY_BLOCK_CENTER_VERTICALLY}px)`,
//                   width: `calc(${blockWidth}px - ${
//                     fullWidthOrNot ? "5rem" : "10rem"
//                   })`,
//                   height:
//                     blockHeight - TOPOLOGY_BLOCK_CENTER_VERTICALLY > 0
//                       ? `calc(${blockHeight}px - ${TOPOLOGY_BLOCK_CENTER_VERTICALLY}px)`
//                       : `${blockHeight}px`,
//                 }}
//                 className={`absolute z-[100] bg-black opacity-30`}
//               ></div>
//             )}
//           </>
//         ) : (
//           <>
//             {arrowDirectionX === "left" ? (
//               <div
//                 style={{
//                   left: `${coordinatesX}px`,
//                   bottom: `calc(${calculationOfHeightWhenBottom}px - ${TOPOLOGY_BLOCK_CENTER_VERTICALLY}px)`,
//                   width: `calc(${blockWidth}px - ${
//                     fullWidthOrNot ? "5rem" : "10rem"
//                   })`,
//                   height:
//                     blockHeight - TOPOLOGY_BLOCK_CENTER_VERTICALLY > 0
//                       ? `calc(${blockHeight}px - ${TOPOLOGY_BLOCK_CENTER_VERTICALLY}px)`
//                       : `${blockHeight}px`,
//                 }}
//                 className={`absolute z-[100] bg-black opacity-30 translate-x-[10rem]`}
//               ></div>
//             ) : (
//               <div
//                 style={{
//                   right: `${calculationOfWidthWhenRight}px`,
//                   bottom: `calc(${calculationOfHeightWhenBottom}px - ${TOPOLOGY_BLOCK_CENTER_VERTICALLY}px)`,
//                   width: `calc(${blockWidth}px - ${
//                     fullWidthOrNot ? "5rem" : "10rem"
//                   })`,
//                   height:
//                     blockHeight - TOPOLOGY_BLOCK_CENTER_VERTICALLY > 0
//                       ? `calc(${blockHeight}px - ${TOPOLOGY_BLOCK_CENTER_VERTICALLY}px)`
//                       : `${blockHeight}px`,
//                 }}
//                 className={`absolute z-[100] bg-black opacity-30`}
//               ></div>
//             )}
//           </>
//         )
//       ) : null}
//     </>
//   );
// }
