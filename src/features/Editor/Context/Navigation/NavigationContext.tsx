import { create } from "zustand";
import { devtools } from "zustand/middleware";

type TopLevelNavigationStateTypes = {
  currentTopologyBlockId: string;
  currentlyFocusedCommandId: string;
  setCurrentTopologyBlockId: ({ topologyBlockId }: { topologyBlockId: string }) => void;
  setCurrentlyFocusedCommandId: ({ currentlyFocusedCommandId }: { currentlyFocusedCommandId: string }) => void;
};

const useNavigation = create<TopLevelNavigationStateTypes>()(
  devtools(
    (set) => ({
      currentTopologyBlockId: "",
      currentlyFocusedCommandId: "",
      setCurrentTopologyBlockId: ({ topologyBlockId }) => {
        if (topologyBlockId?.trim().length) {
          set({
            currentTopologyBlockId: topologyBlockId,
          });
        }
      },
      setCurrentlyFocusedCommandId: ({ currentlyFocusedCommandId }) => {
        if (currentlyFocusedCommandId?.trim().length) {
          set({
            currentlyFocusedCommandId,
          });
        }
      },
    }),
    { name: "NavigationName", store: "NavigationStore" }
  )
);

export default useNavigation;
