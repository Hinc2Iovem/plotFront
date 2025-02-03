import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { removeElementAtIndex } from "../../../../../../helpers/removeElementAtIndex";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "../../../../../../hooks/helpers/shared/SessionStorage/useTypedSessionStorage";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";
import useChoiceOptions from "../../../PlotFieldMain/Commands/Choice/Context/ChoiceContext";

type DeleteChoiceOptionTypes = {
  choiceOptionId: string;
  plotfieldCommandId: string;
  choiceId: string;
  episodeId: string;
  topologyBlockId: string;
};

export default function useDeleteChoiceOption({
  choiceOptionId,
  episodeId,
  plotfieldCommandId,
  topologyBlockId,
}: DeleteChoiceOptionTypes) {
  const queryClient = useQueryClient();

  const {
    removeChoiceOption,
    getChoiceOptionByIndex,
    getAmountOfChoiceOptions,
    getIndexOfChoiceOptionById,
    getCurrentlyOpenChoiceOption,
    updateCurrentlyOpenChoiceOption,
  } = useChoiceOptions();

  const { setItem, getItem } = useTypedSessionStorage<SessionStorageKeys>();

  const { getCommandOnlyByPlotfieldCommandId } = usePlotfieldCommands();

  return useMutation({
    mutationFn: async () => {
      await axiosCustomized.delete(
        `/plotFieldCommands/choices/options/${choiceOptionId}/topologyBlocks/${topologyBlockId}`
      );
    },
    onMutate: () => {
      // const focusedCommandChoice = [""];
      const focusedCommandInsideType = getItem("focusedCommandInsideType")?.split("?").filter(Boolean);

      const focusedCommandInsideTypeChoiceIndex = focusedCommandInsideType?.findIndex((i) =>
        i.includes(plotfieldCommandId)
      );
      // const focusedCommandChoiceIndex = focusedCommandChoice?.findIndex((i) => i.includes(choiceId));

      const currentlyOpen = getCurrentlyOpenChoiceOption({ plotfieldCommandId });
      const currentChoice = getCommandOnlyByPlotfieldCommandId({ plotfieldCommandId });

      const focusedChoiceOptions = [""];
      const deepLevel = focusedChoiceOptions?.includes("none")
        ? null
        : (focusedChoiceOptions?.length || 0) > 1
        ? (focusedChoiceOptions?.length || 0) - 1
        : 0;

      if (typeof deepLevel === "number") {
        // deleting on focus
        if (currentlyOpen && currentlyOpen.choiceOptionId === choiceOptionId) {
          // deleting currentlyOpen option
          const currentOptionIndex = getIndexOfChoiceOptionById({
            choiceOptionId,
            plotfieldCommandId,
          });

          const currentChoiceOption =
            typeof currentOptionIndex === "number"
              ? getChoiceOptionByIndex({ plotfieldCommandId, index: currentOptionIndex })
              : null;

          if (!currentChoiceOption) {
            console.error("Such option wasn't found");
            return;
          }

          const focusedChoiceOptionIndex = focusedChoiceOptions?.findIndex(
            (co) =>
              co ===
              `${currentChoiceOption.optionType}-${currentChoiceOption.choiceOptionId}-plotfieldCommandId-${plotfieldCommandId}`
          );

          if (typeof focusedChoiceOptionIndex !== "number") {
            console.error("For some reason deep level is not a number");
            return;
          }

          // const currentChoiceOptionSplitted = (focusedChoiceOptions || [])[focusedChoiceOptionIndex].split("-");
          // const currentChoiceOptionPlotfieldId = currentChoiceOptionSplitted[3];

          if (typeof currentOptionIndex === "number") {
            const amount = getAmountOfChoiceOptions({ plotfieldCommandId });
            const currentPlotfieldCommand = getCommandOnlyByPlotfieldCommandId({ plotfieldCommandId });

            if (!currentPlotfieldCommand || currentPlotfieldCommand.topologyBlockId === topologyBlockId) {
              setItem("focusedCommand", `choice-${plotfieldCommandId}`);
            }

            const newFocusedCommandInsideType = (focusedCommandInsideType || [])?.slice(
              0,
              (focusedCommandInsideTypeChoiceIndex || 0) + 1
            );

            // const newFocusedCommandChoice = (focusedCommandChoice || [])?.slice(
            //   0,
            //   (focusedCommandChoiceIndex || 0) + 1
            // );

            setItem(
              "focusedCommandInsideType",
              (focusedCommandInsideTypeChoiceIndex || 1) + 1 > 1 && newFocusedCommandInsideType.length
                ? `${newFocusedCommandInsideType.join("?")}?`
                : "default?"
            );

            if (amount > 1) {
              if (currentOptionIndex === 0) {
                // first option deleted
                const nextOption = getChoiceOptionByIndex({
                  index: 1,
                  plotfieldCommandId,
                });

                setItem("focusedTopologyBlock", nextOption?.topologyBlockId || "");

                if (deepLevel === 0) {
                  //
                } else {
                  if (focusedChoiceOptionIndex === 0) {
                    //
                  } else {
                    const newFocusedChoiceOptions = removeElementAtIndex({
                      array: focusedChoiceOptions || [],
                      index: focusedChoiceOptionIndex,
                    });

                    console.log("newFocusedChoiceOptions: ", newFocusedChoiceOptions);
                  }
                }

                updateCurrentlyOpenChoiceOption({
                  choiceOptionId: nextOption?.choiceOptionId || "",
                  plotfieldCommandId,
                });
                removeChoiceOption({ choiceOptionId, plotfieldCommandId });
              } else {
                // somewhere in the middle or last option
                console.log("Expecting here");

                const prevOption = getChoiceOptionByIndex({
                  index: currentOptionIndex - 1,
                  plotfieldCommandId,
                });

                setItem("focusedTopologyBlock", prevOption?.topologyBlockId || "");

                if (deepLevel === 0) {
                  //
                } else {
                  if (focusedChoiceOptionIndex === 0) {
                    //
                  } else {
                    const newFocusedChoiceOptions = removeElementAtIndex({
                      array: focusedChoiceOptions || [],
                      index: focusedChoiceOptionIndex,
                    });

                    console.log("newFocusedChoiceOptions: ", newFocusedChoiceOptions);
                  }
                }

                updateCurrentlyOpenChoiceOption({
                  choiceOptionId: prevOption?.choiceOptionId || "",
                  plotfieldCommandId,
                });
                removeChoiceOption({ choiceOptionId, plotfieldCommandId });
              }
            } else {
              // just remove and close
              setItem("focusedTopologyBlock", currentChoice?.topologyBlockId || "");

              // const newFocusedChoiceOption = removeElementAtIndex({
              //   array: focusedChoiceOptions || [],
              //   index: focusedChoiceOptionIndex || 0,
              // });
              // TODO when deleting choiceOption need to refocus

              setItem("focusedCommand", `choice-${plotfieldCommandId}`);

              updateCurrentlyOpenChoiceOption({
                choiceOptionId: "",
                plotfieldCommandId,
              });
              removeChoiceOption({ choiceOptionId, plotfieldCommandId });
            }
          } else {
            // this one shouldn't trigger at all, but in case of something wierd.
            // just remove from inner state
            updateCurrentlyOpenChoiceOption({
              choiceOptionId: "",
              plotfieldCommandId,
            });
            removeChoiceOption({ choiceOptionId, plotfieldCommandId });
          }
        } else {
          // if I'm inside choiceOption but I'm deleting not the one I'm focused one
          // just remove from inner state
          // need to check if provided plotfieldCommandId exists inside focusedChoiceOption, and if so delete it and move focusedCommand

          removeChoiceOption({ choiceOptionId, plotfieldCommandId });

          // delete topologyBlock
        }
      } else {
        // if deleting not on focus
        // just remove from inner state
        // need to check if provided plotfieldCommandId exists inside focusedChoiceOption, and if so delete it and move focusedCommand
        removeChoiceOption({ choiceOptionId, plotfieldCommandId });

        // delete topologyBlock
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["episode", episodeId, "topologyBlock"],
      });
      queryClient.invalidateQueries({
        queryKey: ["connection", "episode", episodeId],
      });
    },
  });
}

// getting topologyBlockId based on nesting
// const currentNesting = sessionStorage.getItem("focusedCommandInsideType")?.split("?");
//       let currentTopologyBlock;
//       if (currentNesting?.includes("if-") || commandIfId?.trim().length) {
//         const deepLevel = (currentNesting?.length || 0) - 1;
//         const isElseOnFocus = (currentNesting || [])[deepLevel].split("-");
//         currentTopologyBlock = getCommandIfOnlyByPlotfieldCommandId({
//           isElse: isElse || isElseOnFocus[2] === "else",
//           plotfieldCommandId,
//         })?.topologyBlockId;
//       } else {
//         currentTopologyBlock = getCommandOnlyByPlotfieldCommandId({ plotfieldCommandId })?.topologyBlockId;
//       }
