import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useRef, useState } from "react";
import commandImg from "../../../../../../assets/images/Editor/command.png";
import plus from "../../../../../../assets/images/shared/add.png";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import ButtonHoverPromptModal from "../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import { PlotfieldOptimisticCommandInsideIfTypes } from "../../../Context/PlotfieldCommandIfSlice";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";
import useCreateBlankCommandInsideIf from "../hooks/If/useCreateBlankCommandInsideIf";
import useGetCommandIf from "../hooks/If/useGetCommandIf";
import useGetCurrentCommandOrderCommandIf from "../hooks/If/useGetCurrentCommandOrderCommandIf";
import useUpdateOrderInsideCommandIf from "../hooks/If/useUpdateOrderInsideCommandIf";
import useGetAllPlotFieldCommandsByIfIdInsideElse from "../hooks/useGetAllPlotFieldCommandsByIfIdInsideIElse";
import useGetAllPlotFieldCommandsByIfIdInsideIf from "../hooks/useGetAllPlotFieldCommandsByIfIdInsideIf";
import PlotfieldItemInsideIf from "../PlotfieldItemInsideIf";
import CommandIfValues from "./CommandIfValues";
import useReorderIfCommands from "./useReorderIfCommands";
import useReorderElseCommands from "./useReorderElseCommands";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";

type CommandIfFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandIfField({
  plotFieldCommandId,
  command,
  topologyBlockId,
}: CommandIfFieldTypes) {
  const {
    addCommandIf,
    setAllIfCommands,
    updateCommandIfInfo,
    setCurrentAmountOfIfCommands,
    getCommandsByCommandIfId,
    getCurrentAmountOfIfCommands,
    removeCommandIfItem,
    updateCommandIfOrder,
  } = usePlotfieldCommands();
  const [nameValue] = useState<string>(command ?? "If");
  const [hideIfCommands, setHideIfCommands] = useState(false);
  const [hideElseCommands, setHideElseCommands] = useState(false);
  const { data: commandIf } = useGetCommandIf({
    plotFieldCommandId,
  });
  const theme = localStorage.getItem("theme");
  const [commandIfId, setCommandIfId] = useState("");
  const createCommandInsideIf = useCreateBlankCommandInsideIf({
    topologyBlockId,
    commandIfId,
  });
  const createCommandInsideElse = useCreateBlankCommandInsideIf({
    topologyBlockId,
    commandIfId,
    isElse: true,
  });

  const { data: commandsInsideIf } = useGetAllPlotFieldCommandsByIfIdInsideIf({
    commandIfId,
  });
  const { data: commandsInsideElse } =
    useGetAllPlotFieldCommandsByIfIdInsideElse({
      commandIfId,
    });

  useEffect(() => {
    if (commandsInsideElse && commandsInsideIf && commandIfId) {
      setAllIfCommands({
        commandIfId,
        commandsInsideElse:
          commandsInsideElse as PlotfieldOptimisticCommandInsideIfTypes[],
        commandsInsideIf:
          commandsInsideIf as PlotfieldOptimisticCommandInsideIfTypes[],
      });
    }
  }, [commandsInsideIf, commandsInsideElse, commandIfId]);

  const updateCommandOrder = useUpdateOrderInsideCommandIf({ commandIfId });

  useEffect(() => {
    if (commandIf) {
      setCommandIfId(commandIf._id);

      setCurrentAmountOfIfCommands({
        commandIfId: commandIf._id,
        amountOfCommandsInsideElse: commandIf.amountOfCommandsInsideElse,
        amountOfCommandsInsideIf: commandIf.amountOfCommandsInsideIf,
      });
    }
  }, [commandIf]);

  const handleCreateCommand = (isElse: boolean) => {
    const _id = generateMongoObjectId();
    if (isElse) {
      const elseCommandOrder = getCurrentAmountOfIfCommands({
        commandIfId,
        isElse: true,
      });
      addCommandIf({
        commandIfId,
        isElse: true,
        newCommand: {
          commandOrder: elseCommandOrder,
          _id,
          command: "" as AllPossiblePlotFieldComamndsTypes,
          isElse: true,
          topologyBlockId,
          commandIfId,
        },
      });
      createCommandInsideElse.mutate({
        commandOrder: elseCommandOrder,
        _id,
        command: "" as AllPossiblePlotFieldComamndsTypes,
        isElse: true,
        topologyBlockId,
        commandIfId,
      });
      updateCommandIfInfo({ addOrMinus: "add", commandIfId, isElse: true });
      if (createCommandInsideElse.isError) {
        removeCommandIfItem({ id: _id, isElse: true });
        updateCommandIfInfo({ addOrMinus: "minus", commandIfId, isElse: true });
        console.error(`Some error happened: ${createCommandInsideElse.error}`);
      }
    } else {
      const ifCommandOrder = getCurrentAmountOfIfCommands({
        commandIfId,
        isElse: false,
      });
      addCommandIf({
        commandIfId,
        isElse: false,
        newCommand: {
          commandOrder: ifCommandOrder,
          _id,
          command: "" as AllPossiblePlotFieldComamndsTypes,
          isElse,
          topologyBlockId,
          commandIfId,
        },
      });
      createCommandInsideIf.mutate({
        commandOrder: ifCommandOrder,
        _id,
        command: "" as AllPossiblePlotFieldComamndsTypes,
        isElse,
        topologyBlockId,
        commandIfId,
      });
      updateCommandIfInfo({ addOrMinus: "add", commandIfId, isElse: false });

      if (createCommandInsideIf.isError) {
        removeCommandIfItem({ id: _id, isElse: false });
        updateCommandIfInfo({
          addOrMinus: "minus",
          commandIfId,
          isElse: false,
        });
        console.error(`Some error happened: ${createCommandInsideIf.error}`);
      }
    }
  };

  const [newlyFetchedIfCommands, setNewlyFetchedIfCommands] = useState(false);
  const { data: currentCommandOrdersIf, refetch } =
    useGetCurrentCommandOrderCommandIf({
      commandIfId,
      isElse: false,
    });
  const timerRef = useRef<number | null>(null);
  const delay = 5000;

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      refetch().then(() => {
        setNewlyFetchedIfCommands(true);
      });
    }, delay);
  };

  const handleDragStart = () => {
    setNewlyFetchedIfCommands(false);
    resetTimer();
  };

  const handleDragEnd = () => {
    setNewlyFetchedIfCommands(false);
    resetTimer();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useReorderIfCommands({
    currentCommandOrdersIf,
    commandIfId,
    currentCommandsState: getCommandsByCommandIfId({
      commandIfId,
      isElse: false,
    }),
    newlyFetchedIfCommands,
  });

  const handleOnDragEndInsideIf = (result: DropResult) => {
    if (!result?.destination) return;
    handleDragEnd();

    const orderedCommandsInsideIf = [
      ...(getCommandsByCommandIfId({ commandIfId, isElse: false }) || []),
    ];
    const [reorderedItem] = orderedCommandsInsideIf.splice(
      result.source.index,
      1
    );

    orderedCommandsInsideIf.splice(result.destination.index, 0, reorderedItem);

    setAllIfCommands({
      commandIfId,
      commandsInsideIf:
        orderedCommandsInsideIf as PlotfieldOptimisticCommandInsideIfTypes[],
      commandsInsideElse: getCommandsByCommandIfId({
        commandIfId,
        isElse: true,
      }),
    });
    updateCommandIfOrder({
      commandOrder: result.destination.index,
      id: result.draggableId,
      isElse: false,
    });
    updateCommandOrder.mutate({
      newOrder: result.destination.index,
      plotFieldCommandId: result.draggableId,
    });
  };

  const [newlyFetchedElseCommands, setNewlyFetchedElseCommands] =
    useState(false);
  const { data: currentCommandOrdersElse, refetch: refetchElse } =
    useGetCurrentCommandOrderCommandIf({
      commandIfId,
      isElse: true,
    });
  const timerElseRef = useRef<number | null>(null);

  const resetElseTimer = () => {
    if (timerElseRef.current) {
      clearTimeout(timerElseRef.current);
    }

    timerElseRef.current = setTimeout(() => {
      refetchElse().then(() => {
        setNewlyFetchedElseCommands(true);
      });
    }, delay);
  };

  const handleDragStartElse = () => {
    setNewlyFetchedElseCommands(false);
    resetElseTimer();
  };

  const handleDragEndElse = () => {
    setNewlyFetchedElseCommands(false);
    resetElseTimer();
  };

  useEffect(() => {
    return () => {
      if (timerElseRef.current) {
        clearTimeout(timerElseRef.current);
      }
    };
  }, []);

  useReorderElseCommands({
    currentCommandOrdersIf: currentCommandOrdersElse,
    commandIfId,
    currentCommandsState: getCommandsByCommandIfId({
      commandIfId,
      isElse: true,
    }),
    newlyFetchedIfCommands: newlyFetchedElseCommands,
  });

  const handleOnDragEndInsideElse = (result: DropResult) => {
    if (!result?.destination) return;
    handleDragEndElse();

    const orderedCommandsInsideElse = [
      ...(getCommandsByCommandIfId({ commandIfId, isElse: true }) || []),
    ];

    const [reorderedItem] = orderedCommandsInsideElse.splice(
      result.source.index,
      1
    );
    orderedCommandsInsideElse.splice(
      result.destination.index,
      0,
      reorderedItem
    );
    setAllIfCommands({
      commandIfId,
      commandsInsideIf: getCommandsByCommandIfId({
        commandIfId,
        isElse: false,
      }),
      commandsInsideElse: orderedCommandsInsideElse,
    });
    updateCommandIfOrder({
      commandOrder: result.destination.index,
      id: result.draggableId,
      isElse: true,
    });
    updateCommandOrder.mutate({
      newOrder: result.destination.index,
      plotFieldCommandId: result.draggableId,
    });
  };

  return (
    <div className="flex gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] flex-col">
      <div className="min-w-[10rem] w-full flex flex-col gap-[1rem]">
        <div className="flex w-full relative items-center gap-[1rem]">
          <div className="flex gap-[.5rem] w-full">
            <PlotfieldCommandNameField>{nameValue}</PlotfieldCommandNameField>
            <button
              onClick={(e) => {
                setHideIfCommands((prev) => !prev);
                e.currentTarget.blur();
              }}
              className={`${
                hideIfCommands
                  ? `${
                      theme === "light"
                        ? "bg-secondary outline-none"
                        : "hover:bg-red-light hover:text-text-dark bg-primary text-text-light focus-within:bg-red-light focus-within:text-text-dark outline-gray-600"
                    } focus-within:opacity-95 hover:opacity-95 text-text-light`
                  : ` ${
                      theme === "light"
                        ? "bg-red-mid outline-none"
                        : "bg-red-light hover:bg-primary hover:text-text-light focus-within:bg-primary focus-within:text-text-light"
                    } text-text-dark focus-within:opacity-95 hover:opacity-95`
              } px-[1rem] w-fit shadow-md focus-within:shadow-sm hover:shadow-sm transition-all active:scale-[0.95] py-[.5rem] rounded-md text-[1.5rem]`}
            >
              {hideIfCommands ? "Открыть" : "Скрыть"}
            </button>
          </div>
          <ButtonHoverPromptModal
            contentName="Создать строку"
            positionByAbscissa="right"
            className="shadow-sm shadow-gray-400 active:scale-[.99] relative bg-secondary"
            asideClasses="text-[1.3rem] -translate-y-1/4 text-text-light"
            onClick={() => handleCreateCommand(false)}
            variant="rectangle"
          >
            <img
              src={plus}
              alt="+"
              className="w-[1.5rem] absolute translate-y-1/2 -translate-x-1/2 left-[0rem] bottom-0 z-[2]"
            />
            <img src={commandImg} alt="Commands" className="w-[3rem]" />
          </ButtonHoverPromptModal>
        </div>
      </div>
      <CommandIfValues ifId={commandIfId} />
      <div
        className={`${
          hideIfCommands ? "hidden" : ""
        } flex flex-col bg-primary rounded-md w-full`}
      >
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleOnDragEndInsideIf}
        >
          <Droppable droppableId="commandIf">
            {(provided: DroppableProvided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-[.5rem] py-[.5rem] w-full bg-primary rounded-md"
              >
                {getCommandsByCommandIfId({ commandIfId, isElse: false })?.map(
                  (p, i) => {
                    return (
                      <Draggable key={p._id} draggableId={p._id} index={i}>
                        {(provided) => (
                          <PlotfieldItemInsideIf provided={provided} {...p} />
                        )}
                      </Draggable>
                    );
                  }
                )}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <div className="h-[10vh] bg-primary w-full rounded-b-md"></div>
      </div>
      <div className="min-w-[10rem] w-full relative flex items-center gap-[1rem] p-[.5rem]">
        <div className="flex gap-[.5rem] w-full">
          <PlotfieldCommandNameField>Else</PlotfieldCommandNameField>
          <button
            onClick={(e) => {
              setHideElseCommands((prev) => !prev);
              e.currentTarget.blur();
            }}
            className={`${
              hideElseCommands
                ? `${
                    theme === "light"
                      ? "bg-secondary outline-none"
                      : "hover:bg-red-light hover:text-text-dark bg-primary text-text-light focus-within:bg-red-light focus-within:text-text-dark outline-gray-600"
                  } focus-within:opacity-95 hover:opacity-95 text-text-light`
                : ` ${
                    theme === "light"
                      ? "bg-red-mid outline-none"
                      : "bg-red-light hover:bg-primary hover:text-text-light focus-within:bg-primary focus-within:text-text-light"
                  } text-text-dark focus-within:opacity-95 hover:opacity-95`
            } px-[1rem] w-fit shadow-md hover:shadow-sm transition-all active:scale-[0.95] py-[.5rem] rounded-md text-[1.5rem]`}
          >
            {hideElseCommands ? "Открыть" : "Скрыть"}
          </button>
        </div>
        <ButtonHoverPromptModal
          contentName="Создать строку"
          positionByAbscissa="right"
          className="shadow-sm shadow-gray-400 active:scale-[.99] relative bg-primary z-[2]"
          asideClasses="text-[1.3rem] -translate-y-1/3 text-text-light"
          onClick={() => handleCreateCommand(true)}
          variant="rectangle"
        >
          <img
            src={plus}
            alt="+"
            className="w-[1.5rem] absolute translate-y-1/2 -translate-x-1/2 left-[0rem] bottom-0"
          />
          <img src={commandImg} alt="Commands" className="w-[3rem]" />
        </ButtonHoverPromptModal>
      </div>
      <div
        className={`${
          hideElseCommands ? "hidden" : ""
        } flex flex-col bg-secondary rounded-md w-full`}
      >
        <DragDropContext
          onDragStart={handleDragStartElse}
          onDragEnd={handleOnDragEndInsideElse}
        >
          <Droppable droppableId="commandIfElse">
            {(provided: DroppableProvided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-[.5rem] py-[.5rem] w-full bg-secondary rounded-md"
              >
                {getCommandsByCommandIfId({ commandIfId, isElse: true })?.map(
                  (p, i) => {
                    return (
                      <Draggable key={p._id} draggableId={p._id} index={i}>
                        {(provided) => (
                          <PlotfieldItemInsideIf provided={provided} {...p} />
                        )}
                      </Draggable>
                    );
                  }
                )}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <div className="h-[10vh] bg-secondary w-full rounded-b-md"></div>
      </div>
    </div>
  );
}
